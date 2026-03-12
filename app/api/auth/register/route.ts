import { NextRequest, NextResponse } from 'next/server'
import { AuthService, type RegisterData } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().regex(/^[67]\d{7}$/).optional(),
  department: z.string().optional(),
  municipality: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    console.log(' DEBUG: Iniciando register')
    
    const body = await request.json()
    console.log(' DEBUG: Body register:', body)
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    console.log(' DEBUG: Validación OK')
    
    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    console.log(' DEBUG: Llamando a AuthService.register')
    
    // Register user
    const user = await AuthService.register(
      validatedData as RegisterData,
      ipAddress,
      userAgent
    )
    
    console.log(' DEBUG: Usuario registrado:', user.id)
    
    // Create session
    const session = await AuthService.createSession(user.id, ipAddress, userAgent)
    
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
    
    console.log(' DEBUG: Register exitoso')
    return response
    
  } catch (error) {
    console.error(' DEBUG: Error en register:', error)
    console.error(' DEBUG: Error stack:', error instanceof Error ? error.stack : 'No stack')
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    )
  }
}
