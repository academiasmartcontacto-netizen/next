'use client'

import { useState } from 'react'
import { Eye, Monitor, Smartphone } from 'lucide-react'
import Link from 'next/link'
import ProductosDrawer from '@/components/editor/ProductosDrawer'
import InventarioDrawer from '@/components/editor/InventarioDrawer'
import SeccionesDrawer from '@/components/editor/drawers/SeccionesDrawer'
import NavbarDrawer from '@/components/editor/drawers/NavbarDrawer'
import ContactanosDrawer from '@/components/editor/drawers/ContactanosDrawer'
import EditorTiles from './components/EditorTiles'
import { useEditorData } from './hooks/useEditorData'

// Importar CSS específico para forzar estilos
import './tienda-editor.css'

export default function TiendaEditorPage() {
  const { store, updateStore, autoSaveStatus, iframeRef } = useEditorData('benedeto')
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop')
  const [activeAccordion, setActiveAccordion] = useState('identidad')
  const [isNavbarDrawerOpen, setIsNavbarDrawerOpen] = useState(false)
  const [isSeccionesDrawerOpen, setIsSeccionesDrawerOpen] = useState(false)
  const [isProductosDrawerOpen, setIsProductosDrawerOpen] = useState(false)
  const [isInventarioDrawerOpen, setIsInventarioDrawerOpen] = useState(false)
  const [isContactanosDrawerOpen, setIsContactanosDrawerOpen] = useState(false)

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? '' : section)
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
            background: '#22226B'
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
                  color: store?.link ? '#ffffff' : 'rgba(255,255,255,0.4)',
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
                onClick={() => {
                  setDeviceMode('desktop')
                  updateStore('deviceMode', 'desktop')
                }}
                className="p-3 transition-all duration-300 flex items-center justify-center"
                style={{
                  color: deviceMode === 'desktop' ? '#22226B' : '#ffffff',
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
                onClick={() => {
                  setDeviceMode('mobile')
                  updateStore('deviceMode', 'mobile')
                }}
                className="p-3 transition-all duration-300 flex items-center justify-center"
                style={{
                  color: deviceMode === 'mobile' ? '#22226B' : '#ffffff',
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
                <NavbarDrawer onClose={() => setIsNavbarDrawerOpen(false)} store={store} updateStore={updateStore} />
              ) : isSeccionesDrawerOpen ? (
                <SeccionesDrawer onClose={() => setIsSeccionesDrawerOpen(false)} store={store} updateStore={updateStore} />
              ) : isProductosDrawerOpen ? (
                <ProductosDrawer onClose={() => setIsProductosDrawerOpen(false)} store={store} updateStore={updateStore} />
              ) : isInventarioDrawerOpen ? (
                <InventarioDrawer onClose={() => setIsInventarioDrawerOpen(false)} store={store} updateStore={updateStore} />
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
    </div>
  )
}
