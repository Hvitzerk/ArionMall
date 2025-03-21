import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { SECRET_KEY, SERVER_START_TIME, MAX_SESSION_AGE } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Parsing request body
    const { username, password } = await request.json();
    
    console.log('Login attempt:', { username, password });
    
    // Hardcoded credentials for testing
    const validCredentials = [
      { username: 'admin', password: 'admin12345' },
      { username: 'addmin', password: 'addmin54321' }
    ];
    
    const isValid = validCredentials.some(
      cred => cred.username === username && cred.password === password
    );
    
    if (isValid) {
      console.log('Login success for:', username);
      console.log('Using server start time:', SERVER_START_TIME);
      
      // Buat session ID unik
      const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      
      // Generate token using jose (edge-compatible) dengan waktu kedaluwarsa yang lebih pendek
      const token = await new SignJWT({ 
        username,
        sessionId,
        loginTime: Date.now(),
        serverStartTime: SERVER_START_TIME
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        // Token hanya berlaku 30 menit
        .setExpirationTime('30m')
        .sign(SECRET_KEY);
      
      // Create response with token in cookies
      const response = NextResponse.json(
        { success: true, redirectUrl: '/admin/dashboard' },
        { status: 200 }
      );
      
      // Set cookie with token
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', 
        path: '/',
        maxAge: MAX_SESSION_AGE / 1000 // Convert ms to seconds for cookie maxAge
      });
      
      return response;
    }
    
    console.log('Login failed for:', username);
    return NextResponse.json({ success: false, message: 'Username atau password salah' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
