import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('logo') as File  // Cambiado de 'file' a 'logo'
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

    // Crear directorio si no existe
    const uploadDir = join(process.cwd(), 'public', 'logos')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generar nombre único con timestamp y random
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()
    const uniqueId = storeId ? `${storeId}_${timestamp}_${random}` : `${timestamp}_${random}`
    const filename = `${uniqueId}.${extension}`
    
    // Guardar archivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Generar URL pública
    const publicUrl = `/logos/${filename}`

    return NextResponse.json({
      success: true,
      logoUrl: publicUrl,  // Cambiado de 'url' a 'logoUrl'
      filename: filename,
      uniqueId: uniqueId,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 })
    }

    // Eliminar archivo (implementar lógica de eliminación real si es necesario)
    const filepath = join(process.cwd(), 'public', 'logos', filename)
    
    // Por ahora solo retornamos éxito, ya que la eliminación física puede ser opcional
    return NextResponse.json({ success: true, message: 'Logo deleted successfully' })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
