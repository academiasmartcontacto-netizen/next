import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, userProfiles, stores } from '@/lib/db/schema'
import { eq, count, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching admin users...')
    
    // Obtener usuarios básicos primero
    const usersData = await db
      .select({
        id: users.id,
        email: users.email,
        isActive: users.isActive,
        role: users.role,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
        firstName: userProfiles.firstName,
        lastName: userProfiles.lastName,
        phone: userProfiles.phone,
        avatar: userProfiles.avatar
      })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .orderBy(desc(users.createdAt))

    console.log('Users fetched:', usersData.length)

    // Formatear datos para el frontend
    const formattedUsers = usersData.map(user => ({
      id: user.id,
      name: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.email.split('@')[0],
      email: user.email,
      phone: user.phone || 'No registrado',
      status: user.isActive ? 'active' : 'inactive',
      registrationDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A',
      lastLogin: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Nunca',
      productsCount: 0, // TODO: Implementar conteo de productos
      storesCount: 0, // TODO: Implementar conteo de tiendas
      storeName: 'Sin tienda', // TODO: Obtener nombre de tienda
      role: user.role || 'user'
    }))

    console.log('Formatted users:', formattedUsers.length)

    return NextResponse.json({
      success: true,
      users: formattedUsers
    })

  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al obtener los usuarios' 
      },
      { status: 500 }
    )
  }
}
