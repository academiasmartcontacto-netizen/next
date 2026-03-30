import { NextRequest, NextResponse } from 'next/server'
import { AuthService, type LoginCredentials } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  phone: z.string().regex(/^[67]\d{7}$/),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Iniciando login')
    
    const body = await request.json()
    console.log('🔍 DEBUG: Body login:', body)
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    console.log('🔍 DEBUG: Validación OK')
    
    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    console.log('🔍 DEBUG: Llamando a AuthService.login')
    
    // Login user
    const { user, session } = await AuthService.login(
      validatedData as LoginCredentials,
      ipAddress,
      userAgent
    )
    
    console.log('🔍 DEBUG: Login exitoso, user:', user.id)
    
    // Set session token in cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      }
    })
    
    response.cookies.set('session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })
    
    console.log('🔍 DEBUG: Login completado')
    return response
    
  } catch (error) {
    console.error('🔍 DEBUG: Error en login:', error)
    console.error('🔍 DEBUG: Error stack:', error instanceof Error ? error.stack : 'No stack')
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
}
