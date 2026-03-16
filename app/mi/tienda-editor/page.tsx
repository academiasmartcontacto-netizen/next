'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Store, Eye, Monitor, Smartphone, Plus, X, ChevronDown, 
  ChevronUp, Upload, Palette, Type, Layout, Settings,
  Facebook, Instagram, Youtube, MapPin,
  Save, Search, Filter, Grid, List, Edit, Trash2, Menu
} from 'lucide-react'
import Link from 'next/link'

// Importar CSS específico para forzar estilos
import './tienda-editor.css'

function NavbarDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ padding: '16px' }}>
      <button onClick={onClose} style={{ marginBottom: '16px', color: 'black', background: 'white', border: '1px solid black', padding: '8px 16px', cursor: 'pointer' }}>
        &larr; Volver
      </button>
      <h2 style={{color: 'black'}}>Editar Barra de Navegación</h2>
      <p style={{color: 'black'}}>Aquí irán las opciones para la barra de navegación.</p>
    </div>
  )
}

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
  const [isNavbarDrawerOpen, setIsNavbarDrawerOpen] = useState(false)
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
          boxShadow: '0 0 20px rgba(0,0,0,0.1)'
        }}
      >
        {/* Header Colorido Symbaloo */}
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{
            background: 'red'
          }}
        >
          <div className="flex items-center gap-3">
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
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
                href={store?.link ? `/tienda/${store.link}` : '#'}
                target={store?.link ? '_blank' : '_self'}
                onClick={(e) => {
                  if (!store?.link || store.error) {
                    e.preventDefault()
                  }
                }}
                className="p-3 transition-all duration-300 flex items-center justify-center"
                style={{
                  color: store?.link ? '#ffffff' : '#ffaa80',
                  background: store?.link ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  cursor: store?.link ? 'pointer' : 'not-allowed',
                  border: store?.link ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: store?.link ? '0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)' : '0 4px 15px rgba(0,0,0,0.05)',
                  minHeight: '40px',
                  minWidth: '40px'
                }}
                title={store?.error || (store?.link ? 'Preview' : 'Cargando...')}
              >
                <Eye size={20} strokeWidth={2.5} />
              </Link>
              <button
                onClick={() => setDeviceMode('desktop')}
                className="p-3 transition-all duration-300 flex items-center justify-center"
                style={{
                  color: deviceMode === 'desktop' ? '#ff6b1a' : '#ffffff',
                  background: deviceMode === 'desktop' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  border: deviceMode === 'desktop' ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: deviceMode === 'desktop' ? '0 4px 15px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)' : '0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                  minHeight: '40px',
                  minWidth: '40px'
                }}
                title="Desktop"
              >
                <Monitor size={20} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className="p-3 transition-all duration-300 flex items-center justify-center"
                style={{
                  color: deviceMode === 'mobile' ? '#ff6b1a' : '#ffffff',
                  background: deviceMode === 'mobile' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  border: deviceMode === 'mobile' ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: deviceMode === 'mobile' ? '0 4px 15px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)' : '0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                  minHeight: '40px',
                  minWidth: '40px'
                }}
                title="Mobile"
              >
                <Smartphone size={20} strokeWidth={2.5} />
              </button>
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
            <div>
              {isNavbarDrawerOpen ? (
                <NavbarDrawer onClose={() => setIsNavbarDrawerOpen(false)} />
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {/* TILE 1: BARRA DE NAVEGACIÓN - GLASSMORPHISM */}
                    <div
                      onClick={() => setIsNavbarDrawerOpen(true)}
                      className="cursor-pointer transition-all duration-500 transform hover:scale-105 hover:rotate-1"
                      style={{
                        background: 'rgba(173, 216, 230, 0.25)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(173, 216, 230, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(173, 216, 230, 0.1) 0%, transparent 70%)',
                        pointerEvents: 'none'
                      }} />
                      <Menu size={32} style={{ color: '#0d6efd', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(13, 110, 253, 0.3))' }} />
                      <h3 
                        style={{
                          color: '#084298',
                          fontSize: '14px',
                          fontWeight: '700',
                          textAlign: 'center',
                          margin: '0',
                          textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
                          letterSpacing: '0.5px'
                        }}
                      >
                        Barra de<br />Navegación
                      </h3>
                    </div>

                    {/* TILE 2: IDENTIDAD - GLASSMORPHISM */}
                    <div
                      onClick={() => toggleAccordion('identidad')}
                      className="cursor-pointer transition-all duration-500 transform hover:scale-105 hover:rotate-1"
                      style={{
                        background: 'rgba(255, 182, 193, 0.25)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(255, 182, 193, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(255, 182, 193, 0.1) 0%, transparent 70%)',
                        pointerEvents: 'none'
                      }} />
                      <Store size={32} style={{ color: '#d63384', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(214, 51, 132, 0.3))' }} />
                      <h3 
                        style={{
                          color: '#831943',
                          fontSize: '14px',
                          fontWeight: '700',
                          textAlign: 'center',
                          margin: '0',
                          textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
                          letterSpacing: '0.5px'
                        }}
                      >
                        Identidad Visual
                      </h3>
                    </div>

                    {/* TILE 3: APARIENCIA - GLASSMORPHISM */}
                    <div
                      onClick={() => toggleAccordion('apariencia')}
                      className="cursor-pointer transition-all duration-500 transform hover:scale-105 hover:rotate-1"
                      style={{
                        background: 'rgba(176, 224, 230, 0.25)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(176, 224, 230, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(176, 224, 230, 0.1) 0%, transparent 70%)',
                        pointerEvents: 'none'
                      }} />
                      <Palette size={32} style={{ color: '#20c997', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(32, 201, 151, 0.3))' }} />
                      <h3 
                        style={{
                          color: '#0f5132',
                          fontSize: '14px',
                          fontWeight: '700',
                          textAlign: 'center',
                          margin: '0',
                          textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
                          letterSpacing: '0.5px'
                        }}
                      >
                        Apariencia
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* TILE 4: PRODUCTOS - GLASSMORPHISM */}
                    <div
                      onClick={() => setShowProductDrawer(true)}
                      className="cursor-pointer transition-all duration-500 transform hover:scale-105 hover:rotate-1"
                      style={{
                        background: 'rgba(255, 218, 185, 0.25)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(255, 218, 185, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(255, 218, 185, 0.1) 0%, transparent 70%)',
                        pointerEvents: 'none'
                      }} />
                      <Plus size={32} style={{ color: '#fd7e14', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(253, 126, 20, 0.3))' }} />
                      <h3 
                        style={{
                          color: '#664d03',
                          fontSize: '14px',
                          fontWeight: '700',
                          textAlign: 'center',
                          margin: '0',
                          textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
                          letterSpacing: '0.5px'
                        }}
                      >
                        Productos
                      </h3>
                    </div>

                    {/* TILE 5: ESPACIO VACÍO PARA FUTURO */}
                    <div
                      className="cursor-not-allowed opacity-50"
                      style={{
                        background: 'rgba(240, 240, 240, 0.1)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        padding: '16px',
                        border: '1px dashed rgba(255, 255, 255, 0.2)',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative'
                      }}
                    >
                      <Plus size={32} style={{ color: '#ccc', marginBottom: '8px' }} />
                      <h3 
                        style={{
                          color: '#999',
                          fontSize: '12px',
                          fontWeight: '600',
                          textAlign: 'center',
                          margin: '0'
                        }}
                      >
                        PRÓXIMO
                      </h3>
                    </div>

                    {/* TILE 6: ESPACIO VACÍO ADICIONAL */}
                    <div
                      className="cursor-not-allowed opacity-50"
                      style={{
                        background: 'rgba(240, 240, 240, 0.1)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        padding: '16px',
                        border: '1px dashed rgba(255, 255, 255, 0.2)',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative'
                      }}
                    >
                      <Plus size={32} style={{ color: '#ccc', marginBottom: '8px' }} />
                      <h3 
                        style={{
                          color: '#999',
                          fontSize: '12px',
                          fontWeight: '600',
                          textAlign: 'center',
                          margin: '0'
                        }}
                      >
                        PRÓXIMO
                      </h3>
                    </div>
                  </div>
                </>
              )}
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
