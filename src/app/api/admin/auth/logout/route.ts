import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Buat response yang akan mengclear token
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });
    
    // Clear token cookie
    response.cookies.delete('admin_token');
    
    // Log untuk debugging
    console.log('User logged out successfully');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Tetap hapus cookie bahkan jika ada error
    const response = NextResponse.json(
      { success: false, message: 'Error during logout' },
      { status: 500 }
    );
    
    response.cookies.delete('admin_token');
    
    return response;
  }
}
