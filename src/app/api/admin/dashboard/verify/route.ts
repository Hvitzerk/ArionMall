import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { SECRET_KEY, SERVER_START_TIME, MAX_SESSION_AGE } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Ambil token dari cookies
    const token = request.cookies.get('admin_token');
    
    // Jika tidak ada token, kembalikan unauthorized
    if (!token) {
      console.log('[API] Verify: No token found');
      return NextResponse.json(
        { success: false, message: 'No token found' },
        { status: 401 }
      );
    }
    
    // Verifikasi token
    const { payload } = await jwtVerify(token.value, SECRET_KEY);
    
    console.log('[API] Verify: Token payload:', payload);
    
    // Tambahan pemeriksaan waktu login
    const loginTime = payload.loginTime as number;
    const currentTime = Date.now();
    const sessionAgeMs = currentTime - loginTime;
    
    // HAPUS VALIDASI SERVER RESTART - Menyebabkan masalah login
    
    // Sesi paksa habis setelah 30 menit
    if (sessionAgeMs > MAX_SESSION_AGE) {
      console.log('[API] Verify: Session expired (over 30 minutes)');
      const response = NextResponse.json(
        { success: false, message: 'Session expired' },
        { status: 401 }
      );
      response.cookies.delete('admin_token');
      return response;
    }
    
    // Token valid, kembalikan data pengguna
    return NextResponse.json({
      success: true,
      user: { username: payload.username }
    });
    
  } catch (error) {
    console.error('[API] Verify error:', error);
    const response = NextResponse.json(
      { success: false, message: 'Invalid token' },
      { status: 401 }
    );
    response.cookies.delete('admin_token');
    return response;
  }
}
