// Test directo para verificar eliminación del Storage
const { createClient } = require('@supabase/supabase-js')

// Configuración
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

class TestStorageService {
  constructor() {
    this.bucket = 'productos'
  }

  extractPathFromUrl(url) {
    if (!url || !url.includes('/storage/v1/object/public/')) return null
    
    try {
      const parts = url.split('/storage/v1/object/public/')
      if (parts.length < 2) return null
      
      const fullPath = parts[1] // "productos/productos/archivo.jpg"
      const bucketPrefix = `${this.bucket}/`
      
      if (fullPath.startsWith(bucketPrefix)) {
        return fullPath.substring(bucketPrefix.length) // "productos/archivo.jpg"
      }
      return null
    } catch (e) {
      console.error('Error extrayendo path de URL:', e)
      return null
    }
  }

  async deleteImage(path) {
    try {
      console.log(`🗑️ Eliminando imagen de Supabase: ${path}`)

      const cleanPath = path.startsWith(`${this.bucket}/`) 
        ? path.replace(`${this.bucket}/`, '') 
        : path

      const { error } = await supabase.storage
        .from(this.bucket)
        .remove([cleanPath])

      if (error) {
        console.error('❌ Error eliminando imagen en Supabase:', error)
        throw error
      }

      console.log(`✅ Imagen eliminada exitosamente: ${cleanPath}`)
      return true

    } catch (error) {
      console.error('❌ Error en deleteImage:', error)
      throw error
    }
  }
}

async function testDeleteSpecificImage() {
  const storage = new TestStorageService()
  
  // URL específica que mencionaste
  const imageUrl = 'https://sfbsplymrielpfkoalsd.supabase.co/storage/v1/object/public/productos/productos/producto_4af8fde4-dd8e-47a8-aa84-d93b904e9701_1775253960581_c2ptj7.webp'
  
  console.log('=== TEST ELIMINACIÓN IMAGEN ESPECÍFICA ===')
  console.log('URL:', imageUrl)
  
  // Extraer path
  const path = storage.extractPathFromUrl(imageUrl)
  console.log('Path extraído:', path)
  
  if (!path) {
    console.log('❌ No se pudo extraer path de la URL')
    return
  }
  
  // Verificar si existe antes de eliminar
  console.log('\n=== VERIFICANDO SI EXISTE ===')
  const { data: existsData, error: existsError } = await supabase.storage
    .from('productos')
    .list('productos', { search: path.split('/').pop() })
  
  if (existsError) {
    console.error('Error verificando existencia:', existsError)
  } else {
    console.log('Archivos encontrados:', existsData?.length || 0)
    if (existsData?.length > 0) {
      existsData.forEach(file => {
        console.log(`- ${file.name} (${file.id})`)
      })
    }
  }
  
  // Eliminar
  console.log('\n=== ELIMINANDO ===')
  try {
    await storage.deleteImage(path)
    console.log('✅ Eliminación completada')
  } catch (error) {
    console.error('❌ Error en eliminación:', error.message)
  }
  
  // Verificar después de eliminar
  console.log('\n=== VERIFICANDO DESPUÉS DE ELIMINAR ===')
  const { data: afterData, error: afterError } = await supabase.storage
    .from('productos')
    .list('productos', { search: path.split('/').pop() })
  
  if (afterError) {
    console.error('Error verificando después de eliminar:', afterError)
  } else {
    console.log('Archivos encontrados después:', afterData?.length || 0)
    if (afterData?.length > 0) {
      afterData.forEach(file => {
        console.log(`- ${file.name} (${file.id})`)
      })
    } else {
      console.log('✅ No se encontraron archivos - eliminación exitosa')
    }
  }
}

testDeleteSpecificImage().catch(console.error)
