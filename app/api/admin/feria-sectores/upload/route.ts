import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const sectorId = formData.get('sectorId') as string
    const slug = formData.get('slug') as string

    if (!file || !sectorId || !slug) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos: file, sectorId, slug' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo JPG, PNG, WebP' },
        { status: 400 }
      )
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Archivo demasiado grande. Máximo 5MB' },
        { status: 400 }
      )
    }

    // Convertir a AVIF con Sharp
    const buffer = await file.arrayBuffer()
    const convertedBuffer = await sharp(Buffer.from(buffer))
      .avif({ 
        quality: 80, 
        effort: 6, // Calidad de compresión (0-9, 9 = mejor pero más lento)
        chromaSubsampling: '4:4:4' // Máxima calidad de color
      })
      .toBuffer()

    // Generar nombre de archivo con UUID
    const fileName = `banner.avif`
    const filePath = `banners/sector-${sectorId}/${fileName}`

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('feria')
      .upload(filePath, convertedBuffer, {
        contentType: 'image/avif',
        upsert: true // Sobreescribir si existe
      })

    if (error) {
      console.error('Error al subir a Supabase:', error)
      return NextResponse.json(
        { error: 'Error al subir la imagen' },
        { status: 500 }
      )
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('feria')
      .getPublicUrl(filePath)

    // Devolver información del archivo
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      filePath,
      originalSize: file.size,
      compressedSize: convertedBuffer.length,
      compressionRatio: ((file.size - convertedBuffer.length) / file.size * 100).toFixed(1) + '%',
      format: 'AVIF'
    })

  } catch (error) {
    console.error('Error en upload de banner:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET para obtener información de un banner existente
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectorId = searchParams.get('sectorId')

    if (!sectorId) {
      return NextResponse.json(
        { error: 'Se requiere sectorId' },
        { status: 400 }
      )
    }

    // Listar archivos del sector
    const { data, error } = await supabase.storage
      .from('feria')
      .list(`banners/sector-${sectorId}`)

    if (error) {
      console.error('Error al listar archivos:', error)
      return NextResponse.json(
        { error: 'Error al obtener información del banner' },
        { status: 500 }
      )
    }

    // Si hay archivos, obtener URL pública
    if (data && data.length > 0) {
      const bannerFile = data.find(file => file.name === 'banner.avif')
      if (bannerFile) {
        const { data: { publicUrl } } = supabase.storage
          .from('feria')
          .getPublicUrl(`banners/sector-${sectorId}/${bannerFile.name}`)

        return NextResponse.json({
          success: true,
          url: publicUrl,
          fileName: bannerFile.name,
          size: bannerFile.metadata?.size || 0
        })
      }
    }

    return NextResponse.json({
      success: false,
      message: 'No se encontró banner para este sector'
    })

  } catch (error) {
    console.error('Error al obtener banner:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE para eliminar banner
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectorId = searchParams.get('sectorId')

    if (!sectorId) {
      return NextResponse.json(
        { error: 'Se requiere sectorId' },
        { status: 400 }
      )
    }

    // Eliminar archivo
    const { error } = await supabase.storage
      .from('feria')
      .remove([`banners/sector-${sectorId}/banner.avif`])

    if (error) {
      console.error('Error al eliminar banner:', error)
      return NextResponse.json(
        { error: 'Error al eliminar el banner' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Banner eliminado correctamente'
    })

  } catch (error) {
    console.error('Error al eliminar banner:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
