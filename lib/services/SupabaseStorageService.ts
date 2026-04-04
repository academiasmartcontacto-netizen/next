// SERVICIO DE STORAGE USANDO SUPABASE STORAGE
// ¡Ya tienes Supabase, no necesitas Cloudinary!

import { createClient } from '@supabase/supabase-js'

export interface UploadResult {
  url: string
  path: string
  publicUrl: string
}

export class SupabaseStorageService {
  private supabase: any
  private bucket: string = 'productos'

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  async uploadImage(file: File, productId: string): Promise<UploadResult> {
    try {
      // Generar nombre único
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 8)
      const fileName = `producto_${productId}_${timestamp}_${random}.${file.name.split('.').pop()}`
      const filePath = `productos/${fileName}`

      console.log(`📤 Subiendo imagen a Supabase Storage: ${filePath}`)

      // Subir a Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('❌ Error subiendo a Supabase:', error)
        throw new Error(`Error subiendo imagen: ${error.message}`)
      }

      // Obtener URL pública
      const { data: { publicUrl } } = this.supabase.storage
        .from(this.bucket)
        .getPublicUrl(filePath)

      console.log(`✅ Imagen subida exitosamente: ${publicUrl}`)

      return {
        url: publicUrl,
        path: filePath,
        publicUrl: publicUrl
      }

    } catch (error: any) {
      console.error('❌ Error en uploadImage:', error)
      throw new Error(`Error subiendo imagen: ${error.message}`)
    }
  }

  async uploadMultipleImages(files: File[], productId: string): Promise<UploadResult[]> {
    const results: UploadResult[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        const result = await this.uploadImage(file, productId)
        results.push(result)
      } catch (error) {
        console.error(`❌ Error subiendo imagen ${i + 1}:`, error)
        // Continuar con las demás imágenes
      }
    }

    return results
  }

  async deleteImageByUrl(url: string): Promise<void> {
    if (!url || !url.includes('/storage/v1/object/public/')) return

    try {
      console.log(`🗑️ Procesando URL para eliminar de Supabase: ${url}`)
      
      // Extraer path después del nombre del bucket
      // El formato suele ser: .../storage/v1/object/public/[bucket]/[path]
      const bucketSearchStr = `/storage/v1/object/public/${this.bucket}/`
      const pathParts = url.split(bucketSearchStr)
      
      if (pathParts.length < 2) {
        console.warn(`⚠️ No se pudo extraer el path de la URL: ${url}`)
        return
      }

      const imagePath = pathParts[pathParts.length - 1]
      await this.deleteImage(imagePath)
    } catch (error: any) {
      console.warn(`⚠️ Error en deleteImageByUrl: ${error.message}`)
    }
  }

  async deleteMultipleImagesByUrls(urls: string[]): Promise<void> {
    if (!urls || urls.length === 0) return
    const deletePromises = urls.map(url => this.deleteImageByUrl(url))
    await Promise.all(deletePromises)
  }

  async deleteImage(path: string): Promise<void> {
    try {
      console.log(`🗑️ Eliminando imagen de Supabase: ${path}`)

      const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([path])

      if (error) {
        console.warn('⚠️ Error eliminando imagen:', error)
        return
      }

      console.log(`✅ Imagen eliminada exitosamente`)

    } catch (error: any) {
      console.warn('⚠️ Error en deleteImage:', error)
    }
  }

  async deleteMultipleImages(paths: string[]): Promise<void> {
    const deletePromises = paths.map(path => this.deleteImage(path))
    await Promise.all(deletePromises)
  }

  async getImageUrl(path: string): Promise<string> {
    const { data: { publicUrl } } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(path)

    return publicUrl
  }

  // Crear bucket si no existe
  async createBucketIfNotExists(): Promise<void> {
    try {
      const { data: buckets } = await this.supabase.storage.listBuckets()
      
      const bucketExists = buckets.some((bucket: any) => bucket.name === this.bucket)
      
      if (!bucketExists) {
        console.log(`📦 Creando bucket: ${this.bucket}`)
        
        const { error } = await this.supabase.storage.createBucket(this.bucket, {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 5242880 // 5MB
        })

        if (error) {
          console.error('❌ Error creando bucket:', error)
          throw new Error(`Error creando bucket: ${error.message}`)
        }

        console.log(`✅ Bucket ${this.bucket} creado exitosamente`)
      } else {
        console.log(`✅ Bucket ${this.bucket} ya existe`)
      }
    } catch (error: any) {
      console.error('❌ Error verificando bucket:', error)
    }
  }
}

// Instancia global
export const supabaseStorageService = new SupabaseStorageService()
