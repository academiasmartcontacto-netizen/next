// SERVICIO DE STORAGE USANDO SUPABASE STORAGE
// ¡Ya tienes Supabase, no necesitas Cloudinary!

import { createClient } from '@supabase/supabase-js'

export interface UploadResult {
  url: string
  path: string
  publicUrl: string
}

export class SupabaseStorageService {
  private _supabase: any = null
  private bucket: string = 'productos'

  private get supabase() {
    if (!this._supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase URL and Service Role Key are required at runtime')
      }

      this._supabase = createClient(supabaseUrl, supabaseKey)
    }
    return this._supabase
  }

  constructor() {
    // No inicializar aquí para evitar errores en tiempo de build
  }

  async uploadImage(file: File, folder: string = 'productos', prefix: string = 'img'): Promise<UploadResult> {
    try {
      // Generar nombre único
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 8)
      const extension = file.name.split('.').pop()
      const fileName = `${prefix}_${timestamp}_${random}.${extension}`
      const filePath = `${folder}/${fileName}`

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

  async uploadMultipleImages(files: File[], folder: string = 'productos', prefix: string = 'img'): Promise<UploadResult[]> {
    const results: UploadResult[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      try {
        const result = await this.uploadImage(file, folder, prefix)
        results.push(result)
      } catch (error) {
        console.error(`❌ Error subiendo imagen ${i + 1}:`, error)
        // Continuar con las demás imágenes
      }
    }

    return results
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
