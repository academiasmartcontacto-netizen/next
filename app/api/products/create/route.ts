import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, stores } from '@/lib/db/schema'
import { products, productImages, productBadges, badges } from '@/lib/db/schema-products'
import { eq, and } from 'drizzle-orm'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookies (como en /api/auth/me)
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: 'No autenticado - Sesión no encontrada' },
        { status: 401 }
      )
    }
    
    // Get user by session token
    const user = await AuthService.getUserBySessionToken(sessionToken)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No autenticado - Sesión inválida' },
        { status: 401 }
      )
    }

    // Obtener datos del formulario
    const formData = await request.formData()
    
    // Extraer campos básicos
    const categoria_id = formData.get('categoria_id') as string
    const subcategoria_id = formData.get('subcategoria_id') as string
    const titulo = formData.get('titulo') as string
    const descripcion = formData.get('descripcion') as string
    const precio = formData.get('precio') as string
    const estado = formData.get('estado') as string
    const departamento = formData.get('departamento') as string
    const municipio = formData.get('municipio') as string
    const categoria_tienda = formData.get('categoria_tienda') as string
    const store_id = formData.get('store_id') as string
    
    // Badges (JSON string)
    const badgesStr = formData.get('badges') as string
    let badges = []
    if (badgesStr) {
      try {
        badges = JSON.parse(badgesStr)
      } catch (e) {
        console.error('Error parsing badges:', e)
      }
    }

    // Validaciones
    if (!categoria_id || !subcategoria_id || !titulo || !descripcion || !precio || !estado || !departamento || !municipio) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    if (titulo.length < 10) {
      return NextResponse.json(
        { success: false, message: 'El título debe tener al menos 10 caracteres' },
        { status: 400 }
      )
    }

    if (descripcion.length < 20) {
      return NextResponse.json(
        { success: false, message: 'La descripción debe tener al menos 20 caracteres' },
        { status: 400 }
      )
    }

    if (parseFloat(precio) <= 0) {
      return NextResponse.json(
        { success: false, message: 'El precio debe ser mayor a 0' },
        { status: 400 }
      )
    }

    // Obtener imágenes
    const imagenes = formData.getAll('imagenes[]') as File[]
    if (imagenes.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Debes subir al menos una imagen' },
        { status: 400 }
      )
    }

    if (imagenes.length > 5) {
      return NextResponse.json(
        { success: false, message: 'Máximo 5 imágenes permitidas' },
        { status: 400 }
      )
    }

    // Mapeo de estados (igual que en PHP)
    const mapa_estados: Record<string, string> = {
      'nuevo': 'Nuevo',
      'como_nuevo': 'Como Nuevo',
      'buen_estado': 'Buen Estado',
      'aceptable': 'Aceptable'
    }

    const estado_formateado = mapa_estados[estado] || estado

    const usuario_id = user.id

    // Validar que la tienda pertenece al usuario
    const storeResult = await db.select()
      .from(stores)
      .where(and(eq(stores.id, store_id), eq(stores.userId, usuario_id)))
      .limit(1)

    if (storeResult.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tienda no encontrada o no pertenece al usuario' },
        { status: 404 }
      )
    }

    try {
      // Insertar producto
      const productResult = await db.insert(products)
        .values({
          storeId: store_id,
          name: titulo, // Usar título como name
          description: descripcion,
          price: parseFloat(precio),
          titulo,
          descripcion,
          precio: parseFloat(precio),
          categoria_id,        // ✅ AGREGADO
          subcategoria_id,     // ✅ AGREGADO
          departamento,
          municipio,
          categoria_tienda: categoria_tienda || null,
          estado,              // ✅ AGREGADO
          activo: true,
          fecha_publicacion: new Date()
        })
        .returning()

      const producto_id = productResult[0]?.id

      // Omitir badges por ahora - requieren UUID de tabla badges
      // TODO: Implementar búsqueda de badges por nombre y obtener UUID

      // Procesar imágenes
      let imagenes_subidas = 0
      for (let i = 0; i < imagenes.length; i++) {
        const imagen = imagenes[i]
        
        // Validar tipo y tamaño
        if (!imagen.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
          continue
        }
        
        if (imagen.size > 5 * 1024 * 1024) { // 5MB
          continue
        }

        // Generar nombre de archivo único
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 8)
        const extension = imagen.name.split('.').pop()
        const filename = `producto_${producto_id}_${timestamp}_${random}.${extension}`
        
        // Guardar archivo en el sistema de archivos
        const buffer = Buffer.from(await imagen.arrayBuffer())
        
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'productos')
        await mkdir(uploadDir, { recursive: true })
        
        const filepath = path.join(uploadDir, filename)
        await writeFile(filepath, buffer)

        // Insertar registro en la base de datos
        const isPrincipalValue = i === 0  // ✅ true/false para boolean
        console.log('=== DEBUG productImages ===')
        console.log('i:', i)
        console.log('i === 0:', i === 0)
        console.log('isPrincipalValue (boolean):', isPrincipalValue)
        console.log('typeof isPrincipalValue:', typeof isPrincipalValue)
        console.log('productId:', producto_id)
        console.log('url:', `/uploads/productos/${filename}`)
        console.log('order:', i)
        
        try {
          await db.insert(productImages)
            .values({
              productId: producto_id,
              url: `/uploads/productos/${filename}`,  // ✅ Con / al inicio
              isPrincipal: isPrincipalValue, // ✅ true/false para boolean
              order: i
            })
          console.log('✅ Insert productImages EXITOSO')
        } catch (dbError) {
          console.error('❌ ERROR en INSERT productImages:', dbError)
          console.error('❌ Detalles del error:', JSON.stringify(dbError, null, 2))
          throw dbError
        }

        imagenes_subidas++
      }

      if (imagenes_subidas === 0) {
        throw new Error('No se pudo subir ninguna imagen válida')
      }

      return NextResponse.json({
        success: true,
        message: 'Producto creado exitosamente',
        producto_id,
        imagenes_subidas
      })

    } catch (error) {
      throw error
    }

  } catch (error: any) {
    console.error('Error en API de productos:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}
