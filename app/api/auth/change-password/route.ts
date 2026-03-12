import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { z } from 'zod'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { error: 'Sesión inválida' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Validate input
    const validatedData = changePasswordSchema.parse(body)
    
    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Change password
    await AuthService.changePassword(
      user.id,
      validatedData.currentPassword,
      validatedData.newPassword,
      ipAddress,
      userAgent
    )
    
    return NextResponse.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    })
    
  } catch (error) {
    console.error('Change password error:', error)
    
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
      { error: 'Error al cambiar contraseña' },
      { status: 500 }
    )
  }
}
