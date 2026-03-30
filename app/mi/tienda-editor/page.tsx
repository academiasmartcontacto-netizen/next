'use client'

import { useState, useEffect } from 'react'
import { Eye, Monitor, Smartphone, X, Plus } from 'lucide-react'
import Link from 'next/link'
import ProductosDrawer from '@/components/editor/ProductosDrawer'
import InventarioDrawer from '@/components/editor/InventarioDrawer'
import SeccionesDrawer from '@/components/editor/drawers/SeccionesDrawer'
import LogoUploader from '@/components/editor/LogoUploader'
import ColorPickerNew from '@/components/editor/ColorPickerNew'
import ContactanosDrawer from '@/components/editor/drawers/ContactanosDrawer'
import EditorTiles from './components/EditorTiles'
import { useEditorData } from './hooks/useEditorData'

// Importar CSS especifico para forzar estilos
import './tienda-editor.css'
import '../../../styles/design-tokens.css'

export default function TiendaEditorPage() {
  const [userStore, setUserStore] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Obtener la tienda del usuario logueado
  useEffect(() => {
    const fetchUserStore = async () => {
      try {
        const response = await fetch('/api/stores?user-store=true')
        const data = await response.json()
        
        if (data.store) {
          setUserStore(data.store)
        } else {
          // Redirigir a crear tienda si no tiene
          window.location.href = '/mi/crear-tienda'
          return
        }
      } catch (error) {
        console.error('Error fetching user store:', error)
        window.location.href = '/mi/crear-tienda'
        return
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserStore()
  }, [])

  // Usar el link de la tienda del usuario
  const { store, updateStore, autoSaveStatus, iframeRef } = useEditorData(userStore?.link || '')
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop')
  const [activeAccordion, setActiveAccordion] = useState('identidad')
  const [isNavbarDrawerOpen, setIsNavbarDrawerOpen] = useState(false)
  const [isSeccionesDrawerOpen, setIsSeccionesDrawerOpen] = useState(false)
  const [isProductosDrawerOpen, setIsProductosDrawerOpen] = useState(false)
  const [isInventarioDrawerOpen, setIsInventarioDrawerOpen] = useState(false)
  const [isContactanosDrawerOpen, setIsContactanosDrawerOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [showNewSectionForm, setShowNewSectionForm] = useState(false)
  const [showNewProductForm, setShowNewProductForm] = useState(false)

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? '' : section)
  }

  return (
    <div className="flex h-screen" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden'
    }}>
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>
              Cargando tu tienda...
            </p>
          </div>
        </div>
      )}

      {/* Editor Content */}
      {!isLoading && (
        <>
          {/* SYMBALOO-STYLE SIDEBAR */}
          <aside 
            className="w-[520px] flex flex-col" 
            style={{
              background: '#ffffff',
              boxShadow: '0 0 20px rgba(0,0,0,0.1)'
            }}
          >
        {/* Header Principal */}
        <div 
          className="flex items-center justify-between px-6 py-2"
          style={{
            background: isNavbarDrawerOpen ? '#22226B' : '#22226B'
          }}
        >
          <div className="flex items-center gap-3">
            <div>
              <h2 
                className="text-base font-bold"
                style={{
                  color: '#ffffff',
                  fontWeight: '800',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  margin: '0'
                }}
              >
                {isNavbarDrawerOpen ? 'Barra de Navegación' : isSeccionesDrawerOpen ? 'Secciones' : isInventarioDrawerOpen ? 'Gestión de Inventario' : 'Administrador'}
              </h2>
            </div>
            {isSeccionesDrawerOpen && (
              <button
                onClick={() => setShowNewSectionForm(true)}
                className="p-2 transition-all duration-300 flex items-center justify-center"
                style={{
                  color: '#ffffff',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                  minHeight: '32px',
                  minWidth: '32px'
                }}
                title="Nueva Sección"
              >
                <Plus size={16} strokeWidth={2} />
              </button>
            )}
            {isInventarioDrawerOpen && (
              <button
                onClick={() => {
                  // Abrir ProductosDrawer para agregar nuevo producto
                  setIsProductosDrawerOpen(true)
                  setEditingProductId(null)
                }}
                className="p-2 transition-all duration-300 flex items-center justify-center"
                style={{
                  color: '#ffffff',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                  minHeight: '32px',
                  minWidth: '32px'
                }}
                title="Nuevo Producto"
              >
                <Plus size={16} strokeWidth={2} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isNavbarDrawerOpen || isSeccionesDrawerOpen || isInventarioDrawerOpen ? (
              <button
                onClick={() => {
                  if (isNavbarDrawerOpen) setIsNavbarDrawerOpen(false)
                  else if (isSeccionesDrawerOpen) setIsSeccionesDrawerOpen(false)
                  else if (isInventarioDrawerOpen) setIsInventarioDrawerOpen(false)
                }}
                className="p-2 transition-all duration-300 flex items-center justify-center"
                style={{
                  color: '#22226B',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)',
                  minHeight: '32px',
                  minWidth: '32px'
                }}
                title="Cerrar"
              >
                <X size={16} strokeWidth={2} />
              </button>
            ) : (
              <>
                <Link 
                    href={store?.link ? `/tienda/${store.link}` : '#'}
                    target={store?.link ? '_blank' : '_self'}
                    onClick={(e) => {
                      if (!store?.link || store.error) {
                        e.preventDefault()
                      }
                    }}
                    className="p-2 transition-all duration-300 flex items-center justify-center"
                    style={{
                      color: store?.link ? '#ffffff' : 'rgba(255,255,255,0.4)',
                      background: store?.link ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      cursor: store?.link ? 'pointer' : 'not-allowed',
                      border: store?.link ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      boxShadow: store?.link ? '0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)' : '0 4px 15px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.2)',
                      minHeight: '32px',
                      minWidth: '32px'
                    }}
                    title={store?.error || (store?.link ? 'Preview' : 'Cargando...')}
                  >
                    <Eye size={16} strokeWidth={2} />
                  </Link>
                  <button
                    onClick={() => {
                      setDeviceMode('desktop')
                      updateStore('deviceMode', 'desktop')
                    }}
                    className="p-2 transition-all duration-300 flex items-center justify-center"
                    style={{
                      color: deviceMode === 'desktop' ? '#22226B' : '#ffffff',
                      background: deviceMode === 'desktop' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                      border: deviceMode === 'desktop' ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      boxShadow: deviceMode === 'desktop' ? '0 4px 15px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)' : '0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                      minHeight: '32px',
                      minWidth: '32px'
                    }}
                    title="Desktop"
                  >
                    <Monitor size={16} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => {
                      setDeviceMode('mobile')
                      updateStore('deviceMode', 'mobile')
                    }}
                    className="p-2 transition-all duration-300 flex items-center justify-center"
                    style={{
                      color: deviceMode === 'mobile' ? '#22226B' : '#ffffff',
                      background: deviceMode === 'mobile' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                      border: deviceMode === 'mobile' ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      boxShadow: deviceMode === 'mobile' ? '0 4px 15px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)' : '0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                      minHeight: '32px',
                      minWidth: '32px'
                    }}
                    title="Mobile"
                  >
                    <Smartphone size={16} strokeWidth={2} />
                  </button>
                </>
            )}
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
                <Link 
                  href="/mi/crear-tienda"
                  className="inline-block px-6 py-3 rounded-lg text-white font-bold"
                  style={{ background: '#ff6b6b', textDecoration: 'none' }}
                >
                  Crear Tienda
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {isNavbarDrawerOpen ? (
                <div className="px-6 py-6 space-y-4">
                  {/* Logo Section */}
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Logo
                  </h3>
                  
                  <LogoUploader
                    currentLogo={store.logo}
                    onLogoChange={(logoUrl) => updateStore('logo', logoUrl)}
                    storeId={store.id}
                  />

                  {/* Color Section */}
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Color de Fondo
                  </h3>
                  
                  <ColorPickerNew
                    currentColor={store.navbarColor || '#1e3a8a'}
                    onColorChange={(color: string) => updateStore('navbarColor', color)}
                  />
                </div>
              ) : isSeccionesDrawerOpen ? (
                <SeccionesDrawer 
                  onClose={() => setIsSeccionesDrawerOpen(false)} 
                  store={store} 
                  updateStore={updateStore}
                  onNewSection={() => setShowNewSectionForm(true)}
                  showNewSectionForm={showNewSectionForm}
                  setShowNewSectionForm={setShowNewSectionForm}
                />
              ) : isProductosDrawerOpen ? (
                <ProductosDrawer 
                  onClose={() => {
                    setIsProductosDrawerOpen(false)
                    setEditingProductId(null)
                    setIsInventarioDrawerOpen(true) // Volver al inventario después de editar
                  }} 
                  store={store} 
                  updateStore={updateStore}
                  editingProductId={editingProductId || undefined}
                />
              ) : isInventarioDrawerOpen ? (
                <InventarioDrawer 
                  onClose={() => setIsInventarioDrawerOpen(false)} 
                  store={store} 
                  updateStore={updateStore}
                  onOpenProductos={() => setIsProductosDrawerOpen(true)}
                  onEditProducto={(productId: string) => {
                    setEditingProductId(productId)
                    setIsProductosDrawerOpen(true)
                    setIsInventarioDrawerOpen(false)
                  }}
                  onNewProduct={() => setShowNewProductForm(true)}
                  showNewProductForm={showNewProductForm}
                  setShowNewProductForm={setShowNewProductForm}
                />
              ) : isContactanosDrawerOpen ? (
                <ContactanosDrawer onClose={() => setIsContactanosDrawerOpen(false)} store={store} updateStore={updateStore} />
              ) : (
                <EditorTiles 
                  onOpenNavbar={() => setIsNavbarDrawerOpen(true)}
                  onOpenSecciones={() => setIsSeccionesDrawerOpen(true)}
                  onOpenIdentidad={() => toggleAccordion('identidad')}
                  onOpenApariencia={() => toggleAccordion('apariencia')}
                  onOpenProductos={() => setIsProductosDrawerOpen(true)}
                  onOpenInventario={() => setIsInventarioDrawerOpen(true)}
                  onOpenContactanos={() => setIsContactanosDrawerOpen(true)}
                />
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
        <div className="flex-1 p-6 flex items-center justify-center">
          <iframe
            ref={iframeRef}
            src={`/tienda/${store.link}`}
            className="rounded-lg border-2 border-white bg-white"
            style={{ 
              width: deviceMode === 'mobile' ? '375px' : '100%',
              height: deviceMode === 'mobile' ? '667px' : '100%',
              maxWidth: '100%'
            }}
            title="Store Preview"
          />
        </div>
      )}
        </>
      )}
    </div>
  )
}
