import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'No autenticado' },
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

    // Obtener usuario desde la base de datos
    const userResult = await db.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [session.user.email]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const usuario_id = userResult.rows[0].id

    // Validar que la tienda pertenece al usuario
    const storeResult = await db.query(
      'SELECT id FROM tiendas WHERE id = $1 AND usuario_id = $2',
      [store_id, usuario_id]
    )

    if (storeResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tienda no encontrada o no pertenece al usuario' },
        { status: 404 }
      )
    }

    // Iniciar transacción
    await db.query('BEGIN')

    try {
      // Insertar producto
      const productResult = await db.query(`
        INSERT INTO productos (
          usuario_id, categoria_id, subcategoria_id, categoria_tienda,
          titulo, descripcion, precio, estado,
          departamento_codigo, municipio_codigo,
          departamento_nombre, municipio_nombre,
          activo, fecha_publicacion
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, NOW())
        RETURNING id
      `, [
        usuario_id,
        parseInt(categoria_id),
        parseInt(subcategoria_id),
        categoria_tienda || null,
        titulo,
        descripcion,
        parseFloat(precio),
        estado_formateado,
        departamento,
        municipio,
        departamento, // TODO: Obtener nombre real del departamento
        municipio     // TODO: Obtener nombre real del municipio
      ])

      const producto_id = productResult.rows[0].id

      // Insertar badges
      if (badges.length > 0) {
        for (const badge of badges) {
          await db.query(
            'INSERT INTO producto_badges (producto_id, badge_id) VALUES ($1, $2)',
            [producto_id, badge]
          )
        }
      }

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
        const fs = require('fs').promises
        const path = require('path')
        
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'productos')
        await fs.mkdir(uploadDir, { recursive: true })
        
        const filepath = path.join(uploadDir, filename)
        await fs.writeFile(filepath, buffer)

        // Insertar registro en la base de datos
        await db.query(`
          INSERT INTO producto_imagenes (producto_id, nombre_archivo, es_principal, orden)
          VALUES ($1, $2, $3, $4)
        `, [
          producto_id,
          `uploads/productos/${filename}`,
          i === 0 ? 1 : 0, // La primera imagen es principal
          i
        ])

        imagenes_subidas++
      }

      if (imagenes_subidas === 0) {
        throw new Error('No se pudo subir ninguna imagen válida')
      }

      // Confirmar transacción
      await db.query('COMMIT')

      return NextResponse.json({
        success: true,
        message: 'Producto creado exitosamente',
        producto_id,
        imagenes_subidas
      })

    } catch (error) {
      // Revertir transacción en caso de error
      await db.query('ROLLBACK')
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
