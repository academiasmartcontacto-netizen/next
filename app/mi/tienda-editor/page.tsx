'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Store, Eye, Monitor, Smartphone, Plus, X, ChevronDown, 
  ChevronUp, Upload, Palette, Type, Layout, Settings,
  Facebook, Instagram, Youtube, MapPin,
  Save, Search, Filter, Grid, List, Edit, Trash2
} from 'lucide-react'
import Link from 'next/link'

// Importar CSS específico para forzar estilos
import './tienda-editor.css'

export default function TiendaEditorPage() {
  const [store, setStore] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop')
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [activeAccordion, setActiveAccordion] = useState('identidad')
  const [selectedSection, setSelectedSection] = useState('inicio')
  const [showProductDrawer, setShowProductDrawer] = useState(false)
  const [showInventoryDrawer, setShowInventoryDrawer] = useState(false)
  const [showFeriaDrawer, setShowFeriaDrawer] = useState(false)
  const [showSectionsDrawer, setShowSectionsDrawer] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Cargar datos reales de la tienda del usuario
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        const response = await fetch('/api/stores?user-store=true')
        if (response.ok) {
          const data = await response.json()
          if (data.store) {
            // Establecer valores por defecto si no existen
            setStore({
              ...data.store,
              mostrar_nombre: data.store.mostrarNombre ?? true,
              mostrar_logo: data.store.mostrarLogo ?? true,
              color_primario: data.store.colorPrimario ?? '#1a73e8',
              navbar_style: 'blanco',
              estilo_fondo: 'blanco',
              estilo_bordes: 'suave',
              estilo_tarjetas: 'borde',
              estilo_fotos: 'cuadrado',
              grid_density: 'auto',
              tipografia: 'system',
              tamano_texto: 'normal'
            })
          }
        }
      } catch (error) {
        console.error('Error cargando tienda:', error)
        // Si hay error, mostrar estado vacío con mensaje
        setStore({
          error: 'No se pudo cargar la tienda. Por favor crea una tienda primero.'
        })
      }
    }

    loadStoreData()
  }, [])

  // Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoSaveStatus('saved')
    }, 1000)
    return () => clearTimeout(timer)
  }, [store])

  const handleSave = () => {
    setAutoSaveStatus('saving')
    // Simulate save
    setTimeout(() => {
      setAutoSaveStatus('saved')
    }, 1000)
  }

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? '' : section)
  }

  const updateStore = (field: string, value: any) => {
    setStore((prev: any) => ({ ...prev, [field]: value }))
    setAutoSaveStatus('saving')
    handleSave()
  }

  const openProductDrawer = (product: any = null) => {
    setEditingProduct(product)
    setShowProductDrawer(true)
  }

  const closeProductDrawer = () => {
    setShowProductDrawer(false)
    setEditingProduct(null)
  }

  return (
    <div className="flex h-screen" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden'
    }}>
      {/* SYMBALOO-STYLE SIDEBAR */}
      <aside 
        className="w-[520px] flex flex-col" 
        style={{
          background: '#ffffff',
          borderRight: '3px solid #ff6b6b',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)'
        }}
      >
        {/* Header Colorido Symbaloo */}
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom: '3px solid #4ecdc4',
            background: 'linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 flex items-center justify-center"
              style={{
                background: '#ffffff',
                borderRadius: '50%',
                border: '3px solid #feca57'
              }}
            >
              <Store size={24} style={{ color: '#ff6b6b' }} />
            </div>
            <div>
              <h2 
                className="text-xl font-bold"
                style={{
                  color: '#ffffff',
                  fontWeight: '800',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  margin: '0'
                }}
              >
                EDITOR
              </h2>
              <p 
                className="text-sm font-bold"
                style={{
                  color: '#ffffff',
                  fontWeight: '600',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  marginTop: '2px'
                }}
              >
                STORE CONFIGURATION
              </p>
            </div>
          </div>
          <div 
            className="flex items-center gap-1"
            style={{
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '25px',
              padding: '8px',
              border: '2px solid #feca57'
            }}
          >
            <Link 
              href={store?.link ? `/tienda/${store.link}` : '#'}
              target={store?.link ? '_blank' : '_self'}
              onClick={(e) => {
                if (!store?.link || store.error) {
                  e.preventDefault()
                  alert(store?.error || 'Cargando tienda...')
                }
              }}
              className="p-2 transition-all duration-300"
              style={{
                color: store?.link ? '#ff6b6b' : '#ccc',
                background: 'transparent',
                borderRadius: '15px',
                cursor: store?.link ? 'pointer' : 'not-allowed'
              }}
              title={store?.error || (store?.link ? 'Preview' : 'Cargando...')}
            >
              <Eye size={18} />
            </Link>
            <button
              onClick={() => setDeviceMode('desktop')}
              className="p-2 transition-all duration-300"
              style={{
                color: deviceMode === 'desktop' ? '#ffffff' : '#4ecdc4',
                background: deviceMode === 'desktop' ? '#4ecdc4' : 'transparent',
                borderRadius: '15px'
              }}
              title="Desktop"
            >
              <Monitor size={18} />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className="p-2 transition-all duration-300"
              style={{
                color: deviceMode === 'mobile' ? '#ffffff' : '#4ecdc4',
                background: deviceMode === 'mobile' ? '#4ecdc4' : 'transparent',
                borderRadius: '15px'
              }}
              title="Mobile"
            >
              <Smartphone size={18} />
            </button>
          </div>
        </div>

        {/* Status Bar Colorida */}
        <div 
          className="px-6 py-3 text-sm font-bold transition-all duration-300"
          style={{
            borderBottom: '3px solid #feca57',
            background: 'linear-gradient(90deg, #feca57 0%, #ff6b6b 100%)',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: '700',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{
                  backgroundColor: '#ffffff',
                  boxShadow: '0 0 10px rgba(255,255,255,0.8)'
                }}
              ></div>
              {autoSaveStatus === 'saved' && '✓ ALL CHANGES SAVED'}
              {autoSaveStatus === 'saving' && '⟳ SAVING...'}
              {autoSaveStatus === 'error' && '⚠ ERROR SAVING'}
            </span>
            <span style={{ color: '#ffffff' }}>
              {new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* SYMBALOO GRID SYSTEM */}
        <div className="flex-1 overflow-y-auto p-4">
          {!store ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>
                  Cargando datos de tu tienda...
                </p>
              </div>
            </div>
          ) : store.error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center bg-white p-8 rounded-2xl" style={{ maxWidth: '400px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                <h3 style={{ color: '#ff6b6b', marginBottom: '16px' }}>Error</h3>
                <p style={{ color: '#666', marginBottom: '24px' }}>{store.error}</p>
                <a 
                  href="/mi/crear-tienda"
                  className="inline-block px-6 py-3 rounded-lg text-white font-bold"
                  style={{ background: '#ff6b6b', textDecoration: 'none' }}
                >
                  Crear Tienda
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {/* TILE 1: IDENTITY */}
              <div
                onClick={() => toggleAccordion('identidad')}
                className="cursor-pointer transition-all duration-300 transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
                  borderRadius: '15px',
                  padding: '16px',
                  border: '3px solid #ffffff',
                  boxShadow: '0 8px 25px rgba(255,107,107,0.3)',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Store size={32} style={{ color: '#ffffff', marginBottom: '8px' }} />
                <h3 
                  style={{
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '700',
                    textAlign: 'center',
                    margin: '0'
                  }}
                >
                  IDENTIDAD
                </h3>
              </div>

              {/* TILE 2: APARIENCIA */}
              <div
                onClick={() => toggleAccordion('apariencia')}
                className="cursor-pointer transition-all duration-300 transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                  borderRadius: '15px',
                  padding: '16px',
                  border: '3px solid #ffffff',
                  boxShadow: '0 8px 25px rgba(78,205,196,0.3)',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Palette size={32} style={{ color: '#ffffff', marginBottom: '8px' }} />
                <h3 
                  style={{
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '700',
                    textAlign: 'center',
                    margin: '0'
                  }}
                >
                  APARIENCIA
                </h3>
              </div>

              {/* TILE 3: PRODUCTOS */}
              <div
                onClick={() => setShowProductDrawer(true)}
                className="cursor-pointer transition-all duration-300 transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #feca57 0%, #ff6b1a 100%)',
                  borderRadius: '15px',
                  padding: '16px',
                  border: '3px solid #ffffff',
                  boxShadow: '0 8px 25px rgba(254,202,87,0.3)',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Plus size={32} style={{ color: '#ffffff', marginBottom: '8px' }} />
                <h3 
                  style={{
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '700',
                    textAlign: 'center',
                    margin: '0'
                  }}
                >
                  PRODUCTOS
                </h3>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Preview Section */}
      {!store ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>
              Cargando preview...
            </p>
          </div>
        </div>
      ) : store.error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>
              {store.error}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6">
          <iframe
            ref={iframeRef}
            src={`/tienda/${store.link}`}
            className="w-full h-full rounded-lg border-2 border-white"
            style={{ background: '#ffffff' }}
            title="Store Preview"
          />
        </div>
      )}
    </div>
  )
}
