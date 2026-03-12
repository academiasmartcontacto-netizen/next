import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Iniciando logout')
    
    // Get session token from cookies
    const sessionToken = request.cookies.get('session_token')?.value
    console.log('🔍 DEBUG: Session token:', sessionToken ? '✅' : '❌')
    
    if (sessionToken) {
      // Get client info
      const ipAddress = request.headers.get('x-forwarded-for') || 
                        request.headers.get('x-real-ip') || 
                        'unknown'
      const userAgent = request.headers.get('user-agent') || 'unknown'
      
      console.log('🔍 DEBUG: Llamando a AuthService.logout')
      
      // Logout user
      await AuthService.logout(sessionToken, ipAddress, userAgent)
      console.log('🔍 DEBUG: Logout completado')
    }
    
    // Clear session token cookie
    const response = NextResponse.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    })
    
    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })
    
    console.log('🔍 DEBUG: Cookie limpiada')
    return response
    
  } catch (error) {
    console.error('🔍 DEBUG: Error en logout:', error)
    console.error('🔍 DEBUG: Error stack:', error instanceof Error ? error.stack : 'No stack')
    
    // Always clear cookie even if logout fails
    const response = NextResponse.json({
      success: true,
      message: 'Sesión cerrada'
    })
    
    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })
    
    return response
  }
}
