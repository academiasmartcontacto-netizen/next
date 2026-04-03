import { NextRequest, NextResponse } from 'next/server'
import { SupabaseStorageService } from '@/lib/services/SupabaseStorageService'

const storageService = new SupabaseStorageService()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('logo') as File
    const storeId = formData.get('storeId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, GIF, WebP, SVG allowed' }, { status: 400 })
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB' }, { status: 400 })
    }

    // Subir a Supabase Storage
    const uploadResult = await storageService.uploadImage(file, 'logos', storeId || 'general')
    const publicUrl = uploadResult.publicUrl

    return NextResponse.json({
      success: true,
      logoUrl: publicUrl,
      filename: uploadResult.path,
      size: file.size,
      type: file.type
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('filename') // En el nuevo sistema, filename es el path en Supabase

    if (!path) {
      return NextResponse.json({ error: 'Path required' }, { status: 400 })
    }

    // Eliminar de Supabase Storage
    await storageService.deleteImage(path)
    
    return NextResponse.json({ success: true, message: 'Logo deleted successfully' })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
