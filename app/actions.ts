'use server'

import { db } from '@/lib/db'
import { waitlist } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function addToWaitlist(email: string) {
  try {
    const sanitizedEmail = email.toLowerCase().trim()

    // Check if email already exists
    const existing = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, sanitizedEmail))
      .limit(1)

    if (existing.length > 0) {
      return { 
        success: false, 
        message: 'Este email ya está registrado en nuestra lista de espera.' 
      }
    }

    // Insert new email
    await db.insert(waitlist).values({
      email: sanitizedEmail,
    })

    return { 
      success: true, 
      message: '¡Gracias por suscribirte! Te mantendremos informado.' 
    }
  } catch (error) {
    console.error('Error in addToWaitlist server action:', error)
    return { 
      success: false, 
      message: 'Error al suscribirte. Por favor intenta de nuevo.' 
    }
  }
}
