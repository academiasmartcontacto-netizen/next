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

      // Extraer el path de la URL de Supabase
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/')
      
      // Buscar el bucket y el path
      const bucketIndex = pathParts.findIndex((part, index) => part === 'object' && pathParts[index - 1] === 'public')
      if (bucketIndex === -1) {
        throw new Error('URL no válida de Supabase Storage')
      }
      
      const filePath = pathParts.slice(bucketIndex + 2).join('/')
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
