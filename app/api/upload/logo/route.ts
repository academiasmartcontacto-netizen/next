import { NextRequest, NextResponse } from 'next/server'
import { supabaseStorageService } from '@/lib/services/SupabaseStorageService'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('logo') as File
    const storeId = formData.get('storeId') as string

    if (!file || !storeId) {
      return NextResponse.json({ error: 'Falta el archivo o el ID de la tienda' }, { status: 400 })
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no válido' }, { status: 400 })
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Archivo demasiado grande' }, { status: 400 })
    }

    // SUBIR A SUPABASE STORAGE con estructura jerárquica: storeId/logos/logo.jpg
    const uploadResult = await supabaseStorageService.uploadImage(file, storeId, 'logo', 'logos')
    const publicUrl = uploadResult.publicUrl

    return NextResponse.json({
      success: true,
      logoUrl: publicUrl,
      path: uploadResult.path
    })

  } catch (error: any) {
    console.error('Logo upload error:', error)
    return NextResponse.json({ error: error.message || 'Error subiendo el logo' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const logoUrl = searchParams.get('url')

    if (!logoUrl) {
      return NextResponse.json({ error: 'URL del logo requerida' }, { status: 400 })
    }

    // Eliminar del Storage
    await supabaseStorageService.deleteImageByUrl(logoUrl)
    
    return NextResponse.json({ success: true, message: 'Logo eliminado exitosamente' })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Error al eliminar el logo' }, { status: 500 })
  }
}
