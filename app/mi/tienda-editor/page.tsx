'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Search, Plus, Edit2, Trash2, Eye, EyeOff, GripVertical, Home, Package, Phone, Info, 
  ChevronDown, ChevronUp, Filter, RotateCcw, Monitor, Smartphone, Menu, Layout, Store, Palette,
  MoreVertical, Copy
} from 'lucide-react'
import Link from 'next/link'
import ColorPickerNew from '@/components/editor/ColorPickerNew'
import LogoUploader from '@/components/editor/LogoUploader'

// Importar CSS específico para forzar estilos
import './tienda-editor.css'

// Componente Enterprise de gestión de secciones
function SeccionesDrawer({ onClose, store, updateStore }: { onClose: () => void, store: any, updateStore: (field: string, value: any) => void }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  // Secciones del sistema (fijas)
  const systemSections = [
    { id: 'inicio', name: 'Inicio', products: 0, visible: store.mostrarInicio ?? true, status: 'system', category: 'Página Principal' },
    { id: 'productos', name: 'Productos', products: 0, visible: store.mostrarProductos ?? true, status: 'system', category: 'Catálogo' },
    { id: 'contacto', name: 'Contacto', products: 0, visible: store.mostrarContacto ?? true, status: 'system', category: 'Información' },
    { id: 'acerca-de', name: 'Acerca de Nosotros', products: 0, visible: store.mostrarAcercaDe ?? false, status: 'system', category: 'Información' }
  ]
  
  // Secciones personalizadas (ejemplo)
  const [customSections, setCustomSections] = useState<any[]>([
  ])
  
  const allSections = [...systemSections, ...customSections]
  const filteredSections = allSections.filter(section => 
    section.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const visibleCount = allSections.filter(s => s.visible).length
  const hiddenCount = allSections.filter(s => !s.visible).length
  const customCount = customSections.length
  
  // Acciones de sección
  const toggleSectionVisibility = (sectionId: string) => {
    const systemSection = systemSections.find(s => s.id === sectionId)
    if (systemSection) {
      const fieldMap: Record<string, string> = {
        'inicio': 'mostrarInicio',
        'productos': 'mostrarProductos', 
        'contacto': 'mostrarContacto',
        'acerca-de': 'mostrarAcercaDe'
      }
      const field = fieldMap[sectionId]
      if (field) updateStore(field, !store[field])
    } else {
      setCustomSections(prev => prev.map(section => 
        section.id === sectionId ? { ...section, visible: !section.visible } : section
      ))
    }
  }
  
  const editSection = (sectionId: string) => {
    const section = customSections.find(s => s.id === sectionId)
    if (section) {
      const newName = prompt('Editar nombre de sección:', section.name)
      if (newName && newName.trim() && newName !== section.name) {
        setCustomSections(prev => prev.map(s => 
          s.id === sectionId ? { ...s, name: newName.trim() } : s
        ))
      }
    }
  }
  
  const deleteSection = (sectionId: string) => {
    const section = customSections.find(s => s.id === sectionId)
    if (section && confirm(`¿Eliminar sección "${section.name}"? Los productos volverán a Inicio.`)) {
      setCustomSections(prev => prev.filter(s => s.id !== sectionId))
    }
  }
  
  const duplicateSection = (sectionId: string) => {
    const section = [...systemSections, ...customSections].find(s => s.id === sectionId)
    if (section) {
      const newName = prompt('Duplicar sección:', `${section.name} (Copia)`)
      if (newName && newName.trim()) {
        const newSection = {
          id: newName.toLowerCase().replace(/\s+/g, '-'),
          name: newName.trim(),
          products: 0,
          visible: true,
          status: 'custom' as const,
          category: section.category
        }
        setCustomSections(prev => [...prev, newSection])
      }
    }
  }
  
  const toggleSelectAll = () => {
    if (selectedSections.length === filteredSections.length) {
      setSelectedSections([])
    } else {
      setSelectedSections(filteredSections.map(s => s.id))
    }
  }
  
  const bulkDelete = () => {
    if (selectedSections.length === 0) return
    if (confirm(`¿Eliminar ${selectedSections.length} secciones seleccionadas?`)) {
      setCustomSections(prev => prev.filter(s => !selectedSections.includes(s.id)))
      setSelectedSections([])
    }
  }
  
  const bulkToggleVisibility = () => {
    if (selectedSections.length === 0) return
    selectedSections.forEach(sectionId => {
      toggleSectionVisibility(sectionId)
    })
    setSelectedSections([])
  }
  
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' }}>
      {/* Header Enterprise */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
        color: 'white', 
        padding: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.2)', 
              color: 'white', 
              padding: '8px 12px', 
              cursor: 'pointer', 
              borderRadius: '6px', 
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
          >
            ← Volver
          </button>
          <div>
            <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>Gestión de Secciones</h2>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Administra las secciones de tu tienda</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              const name = prompt('Nombre de nueva sección:')
              if (name && name.trim()) {
                const newSection = {
                  id: name.toLowerCase().replace(/\s+/g, '-'),
                  name: name.trim(),
                  products: 0,
                  visible: true,
                  status: 'custom' as const,
                  category: 'Personalizada'
                }
                setCustomSections(prev => [...prev, newSection])
              }
            }}
            style={{
              background: '#10b981',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} /> Nueva Sección
          </button>
        </div>
      </div>
      
      {/* Filtros Enterprise */}
      <div style={{ 
        background: 'white', 
        padding: '16px 20px', 
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1, position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Buscar sección por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 14px 10px 44px', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              fontSize: '14px',
              background: '#f8fafc'
            }}
          />
        </div>
        
        {selectedSections.length > 0 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={bulkToggleVisibility}
              style={{
                padding: '8px 12px',
                background: '#3b82f6',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Toggle Visibilidad
            </button>
            <button
              onClick={bulkDelete}
              style={{
                padding: '8px 12px',
                background: '#ef4444',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Eliminar Seleccionadas
            </button>
          </div>
        )}
      </div>
      
      {/* Tabla Enterprise */}
      <div style={{ flex: 1, overflow: 'auto', background: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', width: '50%' }}>
                <input
                  type="checkbox"
                  checked={selectedSections.length === filteredSections.length && filteredSections.length > 0}
                  onChange={toggleSelectAll}
                  style={{ marginRight: '8px' }}
                />
                Sección
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', width: '25%' }}>Estado</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', width: '25%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSections.map((section, index) => (
              <tr 
                key={section.id}
                style={{ 
                  borderBottom: '1px solid #f1f5f9',
                  background: index % 2 === 0 ? 'white' : '#f8fafc',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f8fafc'}
              >
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(section.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSections(prev => [...prev, section.id])
                        } else {
                          setSelectedSections(prev => prev.filter(id => id !== section.id))
                        }
                      }}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
                        {section.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <button
                    onClick={() => toggleSectionVisibility(section.id)}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: section.visible ? '#dcfce7' : '#f1f5f9',
                      color: section.visible ? '#166534' : '#64748b',
                      transition: 'all 0.2s'
                    }}
                  >
                    {section.visible ? '✓ Visible' : '○ Oculto'}
                  </button>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === section.id ? null : section.id)}
                      style={{
                        padding: '8px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <MoreVertical size={16} color="#64748b" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {activeDropdown === section.id && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: '0',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        minWidth: '180px',
                        marginTop: '4px'
                      }}>
                        <button
                          onClick={() => {
                            toggleSectionVisibility(section.id)
                            setActiveDropdown(null)
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            fontSize: '13px',
                            color: '#374151',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          {section.visible ? <EyeOff size={16} color="#64748b" /> : <Eye size={16} color="#64748b" />}
                          {section.visible ? 'Ocultar sección' : 'Mostrar sección'}
                        </button>
                        
                        {section.status === 'custom' && (
                          <>
                            <button
                              onClick={() => {
                                editSection(section.id)
                                setActiveDropdown(null)
                              }}
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                border: 'none',
                                background: 'none',
                                textAlign: 'left',
                                fontSize: '13px',
                                color: '#374151',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                              <Edit2 size={16} color="#64748b" />
                              Editar sección
                            </button>
                            
                            <button
                              onClick={() => {
                                duplicateSection(section.id)
                                setActiveDropdown(null)
                              }}
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                border: 'none',
                                background: 'none',
                                textAlign: 'left',
                                fontSize: '13px',
                                color: '#374151',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                              <Copy size={16} color="#64748b" />
                              Duplicar sección
                            </button>
                            
                            <div style={{ height: '1px', background: '#e5e7eb', margin: '4px 0' }}></div>
                            
                            <button
                              onClick={() => {
                                deleteSection(section.id)
                                setActiveDropdown(null)
                              }}
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                border: 'none',
                                background: 'none',
                                textAlign: 'left',
                                fontSize: '13px',
                                color: '#dc2626',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                              <Trash2 size={16} color="#dc2626" />
                              Eliminar sección
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredSections.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            color: '#94a3b8' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📂</div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No se encontraron secciones</div>
            <div style={{ fontSize: '14px' }}>Intenta con otra búsqueda o crea una nueva sección</div>
          </div>
        )}
      </div>
      
      {/* Footer Enterprise - Eliminado para optimizar espacio */}
    </div>
  )
}

function NavbarDrawer({ onClose, store, updateStore }: { onClose: () => void, store: any, updateStore: (field: string, value: any) => void }) {
  return (
    <div style={{ padding: '16px', color: '#333' }}>
      <button onClick={onClose} style={{ marginBottom: '24px', color: '#333', background: '#f0f0f0', border: '1px solid #ccc', padding: '8px 16px', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>
        &larr; Volver a Opciones
      </button>
      <h2 style={{color: 'black', marginBottom: '16px'}}>Editar Barra de Navegación</h2>
      
      <div className="control-group" style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Logo de la Tienda</label>
        <LogoUploader
          currentLogo={store.logo}
          onLogoChange={(logoUrl) => updateStore('logo', logoUrl)}
          storeId={store.id}
        />
      </div>
      
      <div className="control-group">
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Color de Fondo</label>
        <ColorPickerNew
          currentColor={store.navbarColor}
          onColorChange={(color: string) => updateStore('navbarColor', color)}
        />
      </div>
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
  const [isSeccionesDrawerOpen, setIsSeccionesDrawerOpen] = useState(false)
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
              tamano_texto: 'normal',
              navbarColor: data.store.navbarColor,
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

  useEffect(() => {
    if (autoSaveStatus === 'saving') {
      const debounceTimer = setTimeout(() => {
        handleSave();
      }, 1000); // 1-second debounce

      return () => clearTimeout(debounceTimer);
    }
  }, [store, autoSaveStatus]);

  const handleSave = async () => {
    setAutoSaveStatus('saving')
    try {
      const response = await fetch(`/api/stores/${store.link}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: store.id, ...store }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la tienda');
      }

      const result = await response.json();
      setAutoSaveStatus('saved');
      console.log('Tienda guardada:', result);

    } catch (error) {
      console.error('Fallo al guardar:', error);
      setAutoSaveStatus('error');
    }
  }

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? '' : section)
  }

  const updateStore = (field: string, value: any) => {
    setStore((prev: any) => ({ ...prev, [field]: value }))
    setAutoSaveStatus('saving')

    // Real-time communication with iframe
    if (iframeRef.current) {
      if (field === 'navbarColor') {
        iframeRef.current.contentWindow?.postMessage(
          { type: 'UPDATE_NAVBAR_COLOR', color: value },
          '*'
        )
      } else if (field === 'deviceMode') {
        iframeRef.current.contentWindow?.postMessage(
          { type: 'UPDATE_DEVICE_MODE', mode: value },
          '*'
        )
      } else if (field === 'logo') {
        iframeRef.current.contentWindow?.postMessage(
          { type: 'UPDATE_LOGO', logo: value },
          '*'
        )
      }
    }
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
                onClick={() => {
                  setDeviceMode('desktop')
                  updateStore('deviceMode', 'desktop')
                }}
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
                onClick={() => {
                  setDeviceMode('mobile')
                  updateStore('deviceMode', 'mobile')
                }}
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
                <NavbarDrawer onClose={() => setIsNavbarDrawerOpen(false)} store={store} updateStore={updateStore} />
              ) : isSeccionesDrawerOpen ? (
                <SeccionesDrawer onClose={() => setIsSeccionesDrawerOpen(false)} store={store} updateStore={updateStore} />
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

                    {/* TILE 2: SECCIONES - GLASSMORPHISM */}
                    <div
                      onClick={() => setIsSeccionesDrawerOpen(true)}
                      className="cursor-pointer transition-all duration-500 transform hover:scale-105 hover:rotate-1"
                      style={{
                        background: 'rgba(144, 238, 144, 0.25)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(144, 238, 144, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
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
                        background: 'radial-gradient(circle, rgba(144, 238, 144, 0.1) 0%, transparent 70%)',
                        pointerEvents: 'none'
                      }} />
                      <Layout size={32} style={{ color: '#198754', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(25, 135, 84, 0.3))' }} />
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
                        Secciones
                      </h3>
                    </div>

                    {/* TILE 3: IDENTIDAD - GLASSMORPHISM */}
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

                    {/* TILE 4: APARIENCIA - GLASSMORPHISM */}
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
                    {/* TILE 5: PRODUCTOS - GLASSMORPHISM */}
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

                    {/* TILE 6: ESPACIO VACÍO PARA FUTURO */}
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

                    {/* TILE 7: ESPACIO VACÍO ADICIONAL */}
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
