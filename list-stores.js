// Script para listar tiendas disponibles
const listStores = async () => {
  try {
    console.log('🔍 Listando tiendas disponibles...')
    
    // Intentar obtener lista de tiendas (necesitamos un endpoint para esto)
    // Por ahora vamos a probar con algunos links comunes
    const testLinks = ['test', 'demo', 'mi-tienda', 'store', 'shop']
    
    for (const link of testLinks) {
      try {
        const response = await fetch(`http://localhost:3000/api/stores/${link}`)
        if (response.ok) {
          const data = await response.json()
          console.log(`✅ Tienda encontrada: "${link}" - ${data.store?.nombre}`)
          
          // Obtener productos de esta tienda
          const productsResponse = await fetch(`http://localhost:3000/api/stores/${link}/products`)
          if (productsResponse.ok) {
            const productsData = await productsResponse.json()
            console.log(`   📦 ${productsData.products?.length || 0} productos`)
            
            // Mostrar detalles del primer producto si existe
            if (productsData.products && productsData.products.length > 0) {
              const firstProduct = productsData.products[0]
              console.log(`   🔍 Primer producto: ${firstProduct.name}`)
              console.log(`   🖼️ Imagen principal: ${firstProduct.image}`)
              console.log(`   📸 allImages: ${firstProduct.allImages?.length || 0} imágenes`)
              
              if (firstProduct.allImages && firstProduct.allImages.length > 0) {
                firstProduct.allImages.forEach((img, index) => {
                  console.log(`      Imagen ${index + 1}: ${img.url || img}`)
                })
              }
            }
          }
          break // Encontramos una tienda válida
        }
      } catch (error) {
        // Continuar con el siguiente link
      }
    }
    
  } catch (error) {
    console.error('❌ Error listando tiendas:', error)
  }
}

// Ejecutar prueba
listStores()
