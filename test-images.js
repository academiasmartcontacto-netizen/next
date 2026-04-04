// Script para probar URLs de imágenes de productos
const testImageUrls = async () => {
  try {
    console.log('🔍 Probando URLs de imágenes de productos...')
    
    // Obtener una tienda de prueba
    const storesResponse = await fetch('http://localhost:3000/api/stores/test')
    if (!storesResponse.ok) {
      console.error('❌ Error obteniendo tienda:', storesResponse.status)
      return
    }
    
    const storeData = await storesResponse.json()
    console.log('✅ Tienda encontrada:', storeData.store?.nombre)
    
    // Obtener productos
    const productsResponse = await fetch('http://localhost:3000/api/stores/test/products')
    if (!productsResponse.ok) {
      console.error('❌ Error obteniendo productos:', productsResponse.status)
      return
    }
    
    const productsData = await productsResponse.json()
    console.log(`✅ ${productsData.products?.length || 0} productos encontrados`)
    
    // Analizar cada producto
    productsData.products?.forEach((product, index) => {
      console.log(`\n📦 Producto ${index + 1}: ${product.name}`)
      console.log(`   Imagen principal: ${product.image}`)
      console.log(`   allImages.length: ${product.allImages?.length || 0}`)
      
      if (product.allImages && product.allImages.length > 0) {
        product.allImages.forEach((img, imgIndex) => {
          console.log(`   Imagen ${imgIndex + 1}: ${img.url || img}`)
        })
      }
    })
    
  } catch (error) {
    console.error('❌ Error en prueba:', error)
  }
}

// Ejecutar prueba
testImageUrls()
