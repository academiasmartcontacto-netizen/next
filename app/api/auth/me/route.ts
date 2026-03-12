import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    // Get user by session token
    const user = await AuthService.getUserBySessionToken(sessionToken)
    
    if (!user) {
      // Clear invalid session token
      const response = NextResponse.json(
        { error: 'Sesión inválida' },
        { status: 401 }
      )
      
      response.cookies.set('session_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      })
      
      return response
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        createdAt: new Date().toISOString(), // This should come from the user record
        lastLoginAt: new Date().toISOString(), // This should come from the user record
      }
    })
    
  } catch (error) {
    console.error('Get user error:', error)
    
    return NextResponse.json(
      { error: 'Error al obtener información del usuario' },
      { status: 500 }
    )
  }
}
