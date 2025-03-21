import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { SECRET_KEY, SERVER_START_TIME, MAX_SESSION_AGE } from './lib/auth';

// Tambahkan matcher untuk membatasi middleware hanya pada path yang spesifik
export const config = {
  matcher: ['/admin/:path*']
};

// Daftar URL aktif yang sedang diakses & timestamp terakhir
// Key: token ID, Value: timestamp
const activeTokens: Map<string, number> = new Map();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Jangan terapkan middleware pada halaman login
  if (pathname.includes('/admin/auth')) {
    return NextResponse.next();
  }
  
  console.log('Checking auth for path:', pathname);
  
  // Cek token untuk semua rute admin lainnya
  const token = request.cookies.get('admin_token');
  
  // Jika tidak ada token, redirect ke login
  if (!token) {
    console.log('No admin token found, redirecting to login');
    return NextResponse.redirect(new URL('/admin/auth', request.url));
  }
  
  try {
    // Verifikasi token menggunakan jose
    const { payload } = await jwtVerify(token.value, SECRET_KEY);
    
    console.log('Token payload:', payload);
    
    // Tambahan pemeriksaan waktu login
    const loginTime = payload.loginTime as number;
    const currentTime = Date.now();
    const sessionAgeMs = currentTime - loginTime;
    
    // PENGECEKAN DASHBOARD-ONLY ACCESS
    const sessionId = payload.sessionId as string;
    
    // Jika ini adalah URL dashboard, update token timestamp
    if (pathname === '/admin/dashboard') {
      activeTokens.set(sessionId, currentTime);
    } 
    // Jika bukan dashboard, periksa apakah user pernah ke dashboard
    else {
      // Token belum pernah ada di dashboard -> belum pernah ke dashboard -> hapus
      if (!activeTokens.has(sessionId)) {
        console.log('User never visited dashboard first, forcing login');
        const response = NextResponse.redirect(new URL('/admin/auth', request.url));
        response.cookies.delete('admin_token');
        return response;
      }
      
      // Token ada tapi terakhir akses dashboard > 5 detik yang lalu, hapus
      const lastDashboardAccess = activeTokens.get(sessionId) || 0;
      if (currentTime - lastDashboardAccess > 5000) { // 5 detik
        console.log('Last dashboard access was too long ago, forcing login');
        activeTokens.delete(sessionId);
        const response = NextResponse.redirect(new URL('/admin/auth', request.url));
        response.cookies.delete('admin_token');
        return response;
      }
    }
    
    // Sesi paksa habis setelah 30 menit
    if (sessionAgeMs > MAX_SESSION_AGE) {
      console.log('Session expired (over 30 minutes), forcing logout');
      const response = NextResponse.redirect(new URL('/admin/auth', request.url));
      response.cookies.delete('admin_token');
      activeTokens.delete(sessionId as string);
      return response;
    }
    
    // Token valid, lanjutkan request
    return NextResponse.next();
  } catch (error) {
    // Token invalid atau expired, redirect ke login
    console.error('Token verification failed:', error);
    const response = NextResponse.redirect(new URL('/admin/auth', request.url));
    response.cookies.delete('admin_token');
    return response;
  }
}
