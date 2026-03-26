'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface StoreData {
  store: any
  products: any[]
  sections: any[]
  loading: boolean
  error: string | null
}

export function useStoreData(): StoreData {
  const params = useParams()
  const storeLink = params.link as string
  
  const [data, setData] = useState<StoreData>({
    store: null,
    products: [],
    sections: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchAllData = async () => {
      if (!storeLink) {
        setData(prev => ({ ...prev, loading: false, error: 'Store link not provided' }))
        return
      }

      try {
        console.log('=== HOOK DRY - INICIO CARGA ===')
        console.log('🔗 StoreLink:', storeLink)
        
        // ✅ UNA SOLA LLAMADA - USANDO API EXISTENTE QUE FUNCIONA
        const startTime = Date.now()
        
        // Obtener store
        const storeResponse = await fetch(`/api/stores/${storeLink}`)
        if (!storeResponse.ok) {
          throw new Error('Store not found')
        }
        const storeData = await storeResponse.json()
        
        // Obtener productos
        const productsResponse = await fetch(`/api/stores/${storeLink}/products`)
        if (!productsResponse.ok) {
          throw new Error('Products not found')
        }
        const productsData = await productsResponse.json()
        
        // Obtener secciones
        const sectionsResponse = await fetch(`/api/store-navigation-sections?storeId=${storeData.store.id}`)
        const sectionsData = sectionsResponse.ok ? await sectionsResponse.json() : { sections: [] }
        
        const endTime = Date.now()
        console.log(`⚡ Tiempo de respuesta API: ${endTime - startTime}ms`)
        
        const result = {
          store: storeData.store,
          products: productsData.products || [],
          sections: sectionsData.sections?.filter((s: any) => s.isVisible) || []
        }
        
        console.log('📦 Datos recibidos:', {
          store: !!result.store,
          products: result.products.length,
          sections: result.sections.length
        })
        
        setData({
          store: result.store,
          products: result.products,
          sections: result.sections,
          loading: false,
          error: null
        })
        
        console.log('✅ Hook DRY - Carga completada exitosamente')
        
      } catch (error: any) {
        console.error('❌ Error en hook DRY:', error)
        setData({
          store: null,
          products: [],
          sections: [],
          loading: false,
          error: error.message || 'Error loading store data'
        })
      }
    }

    fetchAllData()
  }, [storeLink])

  return data
}
