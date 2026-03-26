'use client'

import { useState, useEffect, useRef } from 'react'

export function useEditorData(storeLink: string = 'benedeto') {
  const [store, setStore] = useState<any>(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Cargar datos reales de la tienda del usuario
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const storeResponse = await fetch(`/api/stores/${storeLink}`)
        if (!storeResponse.ok) {
          throw new Error('Tienda no encontrada')
        }
        
        const storeData = await storeResponse.json()
        setStore(storeData.store)
      } catch (err: any) {
        console.error('Error cargando tienda:', err)
        setStore({
          error: 'No se pudo cargar la tienda. Por favor crea una tienda primero.'
        })
      }
    }

    fetchStoreData()
  }, [storeLink])

  // Auto-save logic with debounce
  useEffect(() => {
    if (autoSaveStatus === 'saving') {
      const debounceTimer = setTimeout(() => {
        handleSave()
      }, 1000)
      return () => clearTimeout(debounceTimer)
    }
  }, [store, autoSaveStatus])

  const handleSave = async () => {
    if (!store || store.error) return
    
    setAutoSaveStatus('saving')
    try {
      const response = await fetch(`/api/stores/${store.link}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(store),
      })

      if (!response.ok) throw new Error('Error al guardar')
      setAutoSaveStatus('saved')
    } catch (error) {
      console.error('Fallo al guardar:', error)
      setAutoSaveStatus('error')
    }
  }

  const updateStore = (field: string, value: any) => {
    setStore((prev: any) => ({ ...prev, [field]: value }))
    setAutoSaveStatus('saving')

    // Immediate save for visibility fields
    if (field.startsWith('mostrar')) {
      saveFieldImmediately(field, value)
    }

    // Real-time communication with iframe
    if (iframeRef.current) {
      const msgType = field === 'navbarColor' ? 'UPDATE_NAVBAR_COLOR' : 
                      field === 'deviceMode' ? 'UPDATE_DEVICE_MODE' :
                      field === 'logo' ? 'UPDATE_LOGO' : null
      
      if (msgType) {
        iframeRef.current.contentWindow?.postMessage({ type: msgType, [field === 'logo' ? 'logo' : field === 'navbarColor' ? 'color' : 'mode']: value }, '*')
      }
    }
  }

  const saveFieldImmediately = async (field: string, value: any) => {
    if (!store || store.error) return
    
    try {
      const payload = { ...store, [field]: value }
      await fetch(`/api/stores/${store.link}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setAutoSaveStatus('saved')
    } catch (error) {
      console.error('Error saving field:', error)
      setAutoSaveStatus('error')
    }
  }

  return {
    store,
    updateStore,
    autoSaveStatus,
    iframeRef,
    setStore
  }
}
