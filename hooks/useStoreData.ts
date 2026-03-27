'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'

interface StoreData {
  store: any
  products: any[]
  sections: any[]
  loading: boolean
  error: string | null
  updateProduct: (productId: string, updates: any) => void
  addProduct: (product: any) => void
}

export function useStoreData(): StoreData {
  const params = useParams()
  const storeLink = params.link as string
  
  const [data, setData] = useState<StoreData>({
    store: null,
    products: [],
    sections: [],
    loading: true,
    error: null,
    updateProduct: () => {},
    addProduct: () => {}
  })

  // Refs para mantener las funciones actualizadas
  const updateProductRef = useRef<(productId: string, updates: any) => void>(() => {})
  const addProductRef = useRef<(product: any) => void>(() => {})

  // Función para actualizar un producto
  const updateProduct = (productId: string, updates: any) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(product => 
        product.id === productId ? { ...product, ...updates } : product
      )
    }))
  }

  // Función para agregar un nuevo producto
  const addProduct = (product: any) => {
    setData(prev => ({
      ...prev,
      products: [...prev.products, product]
    }))
  }

  // Actualizar refs cuando las funciones cambian
  useEffect(() => {
    updateProductRef.current = updateProduct
    addProductRef.current = addProduct
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
          error: null,
          updateProduct,
          addProduct
        })
        
        console.log('✅ Hook DRY - Carga completada exitosamente')
        
      } catch (error: any) {
        console.error('❌ Error en hook DRY:', error)
        setData({
          store: null,
          products: [],
          sections: [],
          loading: false,
          error: error.message || 'Error loading store data',
          updateProduct,
          addProduct
        })
      }
    }

    fetchAllData()
  }, [storeLink])

  // Escuchar mensajes del editor
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'UPDATE_PRODUCT_NAME') {
        updateProductRef.current(event.data.productId, { name: event.data.productName })
      } else if (event.data.type === 'ADD_NEW_PRODUCT') {
        addProductRef.current(event.data.product)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return data
}
