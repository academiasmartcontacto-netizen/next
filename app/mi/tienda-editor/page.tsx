'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Store, Eye, Monitor, Smartphone, Plus, X, ChevronDown, 
  ChevronUp, Upload, Palette, Type, Layout, Settings,
  Facebook, Instagram, Youtube, MapPin,
  Save, Search, Filter, Grid, List, Edit, Trash2
} from 'lucide-react'
import { mockStores, mockProducts } from '@/lib/mock/data'
import Link from 'next/link'

// Importar CSS específico para forzar estilos
import './tienda-editor.css'

export default function TiendaEditorPage() {
  const [store, setStore] = useState<any>({ ...mockStores[0], 
    mostrar_nombre: true,
    mostrar_logo: true,
    color_primario: '#1a73e8',
    navbar_style: 'blanco',
    estilo_fondo: 'blanco',
    estilo_bordes: 'suave',
    estilo_tarjetas: 'borde',
    estilo_fotos: 'cuadrado',
    grid_density: 'auto',
    tipografia: 'system',
    tamano_texto: 'normal'
  })
  const [products, setProducts] = useState<any[]>(mockProducts.slice(0, 10))
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
              href={`/tienda/${store.slug}`}
              target="_blank"
              className="p-2 transition-all duration-300"
              style={{
                color: '#ff6b6b',
                background: 'transparent',
                borderRadius: '15px'
              }}
              title="Preview"
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
                color: deviceMode === 'mobile' ? '#ffffff' : '#45b7d1',
                background: deviceMode === 'mobile' ? '#45b7d1' : 'transparent',
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
                className="text-sm font-bold text-center"
                style={{
                  color: '#ffffff',
                  fontWeight: '800',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  margin: '0'
                }}
              >
                IDENTITY
              </h3>
              <p 
                className="text-xs text-center"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: '600',
                  marginTop: '4px'
                }}
              >
                Brand & Design
              </p>
            </div>

            {/* TILE 2: PRODUCTS */}
            <div
              onClick={() => toggleAccordion('productos')}
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
              <Grid size={32} style={{ color: '#ffffff', marginBottom: '8px' }} />
              <h3 
                className="text-sm font-bold text-center"
                style={{
                  color: '#ffffff',
                  fontWeight: '800',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  margin: '0'
                }}
              >
                PRODUCTS
              </h3>
              <p 
                className="text-xs text-center"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: '600',
                  marginTop: '4px'
                }}
              >
                Catalog Items
              </p>
            </div>

            {/* TILE 3: CONTACT */}
            <div
              className="cursor-pointer transition-all duration-300 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #45b7d1 0%, #2196f3 100%)',
                borderRadius: '15px',
                padding: '16px',
                border: '3px solid #ffffff',
                boxShadow: '0 8px 25px rgba(69,183,209,0.3)',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Settings size={32} style={{ color: '#ffffff', marginBottom: '8px' }} />
              <h3 
                className="text-sm font-bold text-center"
                style={{
                  color: '#ffffff',
                  fontWeight: '800',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  margin: '0'
                }}
              >
                CONTACT
              </h3>
              <p 
                className="text-xs text-center"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: '600',
                  marginTop: '4px'
                }}
              >
                Channels
              </p>
            </div>

            {/* TILE 4: DESIGN */}
            <div
              className="cursor-pointer transition-all duration-300 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)',
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
              <Palette size={32} style={{ color: '#ffffff', marginBottom: '8px' }} />
              <h3 
                className="text-sm font-bold text-center"
                style={{
                  color: '#ffffff',
                  fontWeight: '800',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  margin: '0'
                }}
              >
                DESIGN
              </h3>
              <p 
                className="text-xs text-center"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: '600',
                  marginTop: '4px'
                }}
              >
                Styling
              </p>
            </div>

            {/* TILE 5: SECTIONS */}
            <div
              className="cursor-pointer transition-all duration-300 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #a8e6cf 0%, #7fcdbb 100%)',
                borderRadius: '15px',
                padding: '16px',
                border: '3px solid #ffffff',
                boxShadow: '0 8px 25px rgba(168,230,207,0.3)',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Layout size={32} style={{ color: '#ffffff', marginBottom: '8px' }} />
              <h3 
                className="text-sm font-bold text-center"
                style={{
                  color: '#ffffff',
                  fontWeight: '800',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  margin: '0'
                }}
              >
                SECTIONS
              </h3>
              <p 
                className="text-xs text-center"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: '600',
                  marginTop: '4px'
                }}
              >
                Pages
              </p>
            </div>

            {/* TILE 6: ADD NEW */}
            <div
              onClick={() => openProductDrawer()}
              className="cursor-pointer transition-all duration-300 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                borderRadius: '15px',
                padding: '16px',
                border: '3px solid #ffffff',
                boxShadow: '0 8px 25px rgba(255,154,158,0.3)',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Plus size={32} style={{ color: '#ffffff', marginBottom: '8px' }} />
              <h3 
                className="text-sm font-bold text-center"
                style={{
                  color: '#ffffff',
                  fontWeight: '800',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  margin: '0'
                }}
              >
                ADD
              </h3>
              <p 
                className="text-xs text-center"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: '600',
                  marginTop: '4px'
                }}
              >
                New Item
              </p>
            </div>
          </div>

          {/* EXPANDED CONTENT - SYMBALOO STYLE */}
          {activeAccordion && (
            <div 
              className="mt-4 p-4"
              style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                border: '3px solid #feca57',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              {activeAccordion === 'identidad' && (
                <div className="space-y-4">
                  <h3 
                    className="text-lg font-bold text-center"
                    style={{
                      color: '#ff6b6b',
                      fontWeight: '800',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    IDENTITY CONFIGURATION
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label 
                        className="text-sm font-bold block mb-2"
                        style={{ color: '#ff6b6b', fontWeight: '700' }}
                      >
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={store.nombre}
                        onChange={(e) => updateStore('nombre', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl transition-all duration-300"
                        style={{
                          background: '#fff5f5',
                          border: '2px solid #ff6b6b',
                          color: '#ff6b6b',
                          fontWeight: '600',
                          outline: 'none'
                        }}
                        placeholder="Enter store name..."
                      />
                    </div>
                    <div>
                      <label 
                        className="text-sm font-bold block mb-2"
                        style={{ color: '#4ecdc4', fontWeight: '700' }}
                      >
                        Brand Color
                      </label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-12 h-12 rounded-xl"
                          style={{ 
                            backgroundColor: store.color_primario || '#ff6b6b',
                            border: '2px solid #4ecdc4'
                          }}
                        />
                        <input
                          type="color"
                          value={store.color_primario || '#ff6b6b'}
                          onChange={(e) => updateStore('color_primario', e.target.value)}
                          className="h-12 w-20 rounded-xl cursor-pointer"
                          style={{
                            background: '#f0ffff',
                            border: '2px solid #4ecdc4'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeAccordion === 'productos' && (
                <div className="space-y-4">
                  <h3 
                    className="text-lg font-bold text-center"
                    style={{
                      color: '#4ecdc4',
                      fontWeight: '800',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    PRODUCTS MANAGEMENT
                  </h3>
                  <button
                    onClick={() => openProductDrawer()}
                    className="w-full py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                    style={{
                      background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '700',
                      border: '3px solid #ffffff',
                      boxShadow: '0 8px 25px rgba(78,205,196,0.3)'
                    }}
                  >
                    <Plus size={20} />
                    ADD NEW PRODUCT
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Symbaloo Style */}
        <div 
          className="px-6 py-4"
          style={{
            borderTop: '3px solid #feca57',
            background: 'linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p 
                className="text-sm font-bold"
                style={{ 
                  color: '#ffffff',
                  fontWeight: '800',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                POWERED BY
              </p>
              <p 
                className="text-lg font-black"
                style={{ 
                  color: '#ffffff',
                  fontWeight: '900',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '2px'
                }}
              >
                DONE!
              </p>
            </div>
            <div className="text-right">
              <p 
                className="text-sm font-bold"
                style={{ 
                  color: '#ffffff',
                  fontWeight: '800',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                SYMBALOO EDITION
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* CANVAS SYMBALOO STYLE */}
      <main 
        className="flex-1 relative"
        style={{
          background: 'linear-gradient(135deg, #a8e6cf 0%, #7fcdbb 100%)',
          borderLeft: '3px solid #feca57'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div 
            className={`overflow-hidden transition-all duration-500 ${
              deviceMode === 'desktop' ? 'w-full h-full' : 'w-[480px] h-full max-h-full'
            }`}
            style={{
              background: '#ffffff',
              border: '3px solid #ff6b6b',
              borderRadius: '25px',
              boxShadow: '0 20px 60px rgba(255,107,107,0.3)'
            }}
          >
            <div className="absolute top-6 right-6 z-10">
              <div 
                className="px-6 py-3 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #feca57 0%, #ff6b6b 100%)',
                  border: '3px solid #ffffff'
                }}
              >
                <p 
                  className="text-sm font-black"
                  style={{ 
                    color: '#ffffff',
                    fontWeight: '900',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  {deviceMode === 'desktop' ? '🖥️ DESKTOP' : '📱 MOBILE'}
                </p>
              </div>
            </div>
            <iframe
              ref={iframeRef}
              src={`/tienda/${store.slug}?editor_mode=1`}
              className={`w-full h-full border-0 rounded-2xl ${
                deviceMode === 'desktop' ? '' : 'max-w-full mx-auto'
              }`}
              style={{ background: '#ffffff' }}
              title="Store Preview"
            />
          </div>
        </div>
      </main>

      {/* DRAWERS DISEÑO ORIGINAL */}
      {showProductDrawer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
          <div className="bg-white w-[480px] h-full border-l border-[#dee2e6]">
            <div className="flex items-center justify-between p-4 border-b border-[#dee2e6]">
              <div>
                <h3 className="text-lg font-semibold text-[#2C3E50]">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <p className="text-xs text-[#6c757d]">Completa los detalles del producto</p>
              </div>
              <button
                onClick={closeProductDrawer}
                className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors duration-300"
              >
                <X size={16} className="text-[#6c757d]" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto h-full">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#2C3E50] block mb-2">Título</label>
                    <input
                      type="text"
                      defaultValue={editingProduct?.titulo || ''}
                      className="w-full px-3 py-2 bg-white border border-[#dee2e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b1a] focus:border-transparent transition-all duration-300 text-[#2C3E50]"
                      placeholder="Nombre del producto"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-[#2C3E50] block mb-2">Precio</label>
                    <input
                      type="number"
                      defaultValue={editingProduct?.precio || ''}
                      className="w-full px-3 py-2 bg-white border border-[#dee2e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b1a] focus:border-transparent transition-all duration-300 text-[#2C3E50]"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-[#2C3E50] block mb-2">Descripción</label>
                  <textarea
                    defaultValue={editingProduct?.descripcion || ''}
                    rows={4}
                    className="w-full px-3 py-2 bg-white border border-[#dee2e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b1a] focus:border-transparent transition-all duration-300 text-[#2C3E50] resize-none"
                    placeholder="Describe tu producto..."
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium text-[#2C3E50] block mb-2">Imágenes</label>
                  <div className="border-2 border-dashed border-[#dee2e6] rounded-lg p-6 text-center hover:border-[#ff6b1a] hover:bg-[#fff3e0] transition-all duration-300 cursor-pointer">
                    <Upload size={24} className="mx-auto text-[#6c757d] mb-2" />
                    <p className="text-xs text-[#6c757d]">Arrastra imágenes aquí</p>
                    <p className="text-xs text-[#6c757d] mt-1">PNG, JPG hasta 10MB • Máximo 5 imágenes</p>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-[#dee2e6] bg-white">
              <div className="flex gap-2">
                <button
                  onClick={closeProductDrawer}
                  className="flex-1 px-4 py-2 bg-[#f8f9fa] text-[#6c757d] rounded-lg hover:bg-[#e9ecef] transition-all duration-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={closeProductDrawer}
                  className="flex-1 px-4 py-2 bg-[#ff6b1a] text-white rounded-lg hover:bg-[#e85e00] transition-all duration-300 font-medium"
                >
                  Guardar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Drawer diseño original */}
      {showInventoryDrawer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
          <div className="bg-white w-[480px] h-full border-l border-[#dee2e6]">
            <div className="flex items-center justify-between p-4 border-b border-[#dee2e6]">
              <div>
                <h3 className="text-lg font-semibold text-[#2C3E50]">Inventario</h3>
                <p className="text-xs text-[#6c757d]">Gestiona tus productos</p>
              </div>
              <button
                onClick={() => setShowInventoryDrawer(false)}
                className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors duration-300"
              >
                <X size={16} className="text-[#6c757d]" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6c757d]" />
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-2 bg-white border border-[#dee2e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b1a] focus:border-transparent transition-all duration-300 text-[#2C3E50]"
                  placeholder="Buscar productos..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <select className="px-3 py-2 bg-white border border-[#dee2e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b1a] focus:border-transparent transition-all duration-300 text-[#2C3E50]">
                  <option>Todas las secciones</option>
                </select>
                <select className="px-3 py-2 bg-white border border-[#dee2e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b1a] focus:border-transparent transition-all duration-300 text-[#2C3E50]">
                  <option>Más Recientes</option>
                </select>
              </div>
              
              <div className="space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="p-3 bg-white border border-[#dee2e6] rounded-lg hover:border-[#ff6b1a] transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-[#2C3E50]">{product.titulo}</h4>
                        <p className="text-xs text-[#6c757d]">Bs. {product.precio}</p>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1 text-[#ff6b1a] hover:bg-[#fff3e0] rounded transition-colors duration-300">
                          <Edit size={14} />
                        </button>
                        <button className="p-1 text-[#dc3545] hover:bg-[#f8d7da] rounded transition-colors duration-300">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feria Drawer diseño original */}
      {showFeriaDrawer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
          <div className="bg-white w-[480px] h-full border-l border-[#dee2e6]">
            <div className="flex items-center justify-between p-4 border-b border-[#dee2e6]">
              <div>
                <h3 className="text-lg font-semibold text-[#2C3E50]">Feria Virtual</h3>
                <p className="text-xs text-[#6c757d]">Tu espacio en el marketplace</p>
              </div>
              <button
                onClick={() => setShowFeriaDrawer(false)}
                className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors duration-300"
              >
                <X size={16} className="text-[#6c757d]" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-[#2C3E50] block mb-2">Icono de Feria</label>
                <div className="flex justify-center">
                  <div className="w-24 h-24 border-2 border-dashed border-[#dee2e6] rounded-lg p-6 text-center hover:border-[#ff6b1a] hover:bg-[#fff3e0] transition-all duration-300 cursor-pointer">
                    {store.logo_url ? (
                      <img src={store.logo_url} alt="Icono" className="w-12 h-12 mx-auto object-contain" />
                    ) : (
                      <div>
                        <Upload size={24} className="mx-auto text-[#6c757d] mb-1" />
                        <p className="text-xs text-[#6c757d]">Subir icono</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#2C3E50] block mb-2">Ciudad</label>
                  <select className="w-full px-3 py-2 bg-white border border-[#dee2e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b1a] focus:border-transparent transition-all duration-300 text-[#2C3E50]">
                    <option>Santa Cruz</option>
                    <option>La Paz</option>
                    <option>Cochabamba</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-[#2C3E50] block mb-2">Sector</label>
                  <select className="w-full px-3 py-2 bg-white border border-[#dee2e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b1a] focus:border-transparent transition-all duration-300 text-[#2C3E50]">
                    <option>Tecnología</option>
                    <option>Moda</option>
                    <option>Hogar</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-[#2C3E50] block mb-2">Selecciona tu Puesto</label>
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: 12 }, (_, i) => (
                    <button
                      key={i}
                      className={`aspect-square border text-xs font-medium transition-all duration-300 hover:scale-105 ${
                        i === 2 ? 'border-[#28a745] bg-[#d4edda] text-[#155724]' : 
                        i === 5 ? 'border-[#dee2e6] bg-[#f8f9fa] text-[#6c757d]' : 
                        'border-[#dee2e6] bg-white hover:border-[#ff6b1a] hover:bg-[#fff3e0] text-[#2C3E50]'
                      }`}
                    >
                      {i === 2 ? 'Tu' : i === 5 ? 'Ocup' : i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sections Drawer diseño original */}
      {showSectionsDrawer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
          <div className="bg-white w-[480px] h-full border-l border-[#dee2e6]">
            <div className="flex items-center justify-between p-4 border-b border-[#dee2e6]">
              <div>
                <h3 className="text-lg font-semibold text-[#2C3E50]">Secciones</h3>
                <p className="text-xs text-[#6c757d]">Organiza tu contenido</p>
              </div>
              <button
                onClick={() => setShowSectionsDrawer(false)}
                className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors duration-300"
              >
                <X size={16} className="text-[#6c757d]" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-[#2C3E50] block mb-2">Crear Nueva Sección</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-white border border-[#dee2e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b1a] focus:border-transparent transition-all duration-300 text-[#2C3E50]"
                    placeholder="Ej: Zapatos, Ofertas..."
                  />
                  <button className="p-2 bg-[#ff6b1a] text-white rounded-lg hover:bg-[#e85e00] transition-all duration-300">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-[#2C3E50] block mb-2">Secciones Activas</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white border border-[#dee2e6] rounded-lg hover:border-[#ff6b1a] transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#fff3e0] flex items-center justify-center rounded-lg">
                        <Layout size={14} className="text-[#ff6b1a]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#2C3E50]">Inicio</h4>
                        <p className="text-xs text-[#6c757d]">Página principal</p>
                      </div>
                    </div>
                    <button className="p-1 text-[#dc3545] hover:bg-[#f8d7da] rounded transition-colors duration-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white border border-[#dee2e6] rounded-lg hover:border-[#ff6b1a] transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#d4edda] flex items-center justify-center rounded-lg">
                        <Grid size={14} className="text-[#28a745]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#2C3E50]">Novedades</h4>
                        <p className="text-xs text-[#6c757d]">Productos nuevos</p>
                      </div>
                    </div>
                    <button className="p-1 text-[#dc3545] hover:bg-[#f8d7da] rounded transition-colors duration-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
