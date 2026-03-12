import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { z } from 'zod'

const profileUpdateSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().regex(/^[67]\d{7}$/).nullable().optional(),
  department: z.string().nullable().optional(),
  municipality: z.string().nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
})

export async function PUT(request: NextRequest) {
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
    const validatedData = profileUpdateSchema.parse(body)
    
    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Update profile
    const updatedProfile = await AuthService.updateProfile(
      user.id,
      validatedData,
      ipAddress,
      userAgent
    )
    
    return NextResponse.json({
      success: true,
      profile: updatedProfile
    })
    
  } catch (error) {
    console.error('Profile update error:', error)
    
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
      { error: 'Error al actualizar perfil' },
      { status: 500 }
    )
  }
}

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
      return NextResponse.json(
        { error: 'Sesión inválida' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      }
    })
    
  } catch (error) {
    console.error('Get profile error:', error)
    
    return NextResponse.json(
      { error: 'Error al obtener perfil' },
      { status: 500 }
    )
  }
}
