// SERVICIO DE STORAGE PARA FERIA VIRTUAL USANDO SUPABASE STORAGE

import { createClient } from '@supabase/supabase-js'

export class FeriaStorageService {
  private supabase: any
  private bucket: string = 'feria'

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  async deleteFileByUrl(url: string): Promise<boolean> {
    try {
      console.log(`🗑️ [FERIA] Eliminando banner de feria: ${url}`)
      
      if (!url || !url.includes('/storage/v1/object/public/')) {
        console.warn(`⚠️ [FERIA] URL no válida para Supabase Storage: ${url}`)
        return true
      }

      // Extraer path después del nombre del bucket
      // El formato suele ser: .../storage/v1/object/public/[bucket]/[path]
      const bucketSearchStr = `/storage/v1/object/public/${this.bucket}/`
      const pathParts = url.split(bucketSearchStr)
      
      if (pathParts.length < 2) {
        console.warn(`⚠️ [FERIA] No se pudo extraer el path de la URL: ${url}`)
        return true
      }

      const filePath = pathParts[pathParts.length - 1]
      console.log(`🗑️ [FERIA] Path extraído: ${filePath}`)

      const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([filePath])

      if (error) {
        console.error('❌ [FERIA] Error eliminando banner:', error)
        throw new Error(`Error eliminando banner: ${error.message}`)
      }

      console.log(`✅ [FERIA] Banner eliminado exitosamente: ${filePath}`)
      return true

    } catch (error: any) {
      console.error('❌ [FERIA] Error en deleteFileByUrl:', error)
      // No lanzar error si el archivo no existe
      if (error.message.includes('No such object') || error.message.includes('not found')) {
        console.log(`ℹ️ [FERIA] El archivo ya no existe en storage: ${url}`)
        return true
      }
      throw new Error(`Error eliminando banner: ${error.message}`)
    }
  }
}
