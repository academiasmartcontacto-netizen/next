'use client'

import { useState, useEffect } from 'react'
import { Plus, Eye, EyeOff, Edit2, Trash2, MoreVertical } from 'lucide-react'

interface SeccionesDrawerProps {
  onClose: () => void
  store: any
  updateStore: (field: string, value: any) => void
}

export default function SeccionesDrawer({ onClose, store, updateStore }: SeccionesDrawerProps) {
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [customSections, setCustomSections] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // Secciones del sistema (fijas)
  const systemSections = [
    { id: 'inicio', name: 'Inicio', products: 0, visible: store.mostrarInicio ?? true, status: 'system', category: 'Página Principal' },
    { id: 'contacto', name: 'Contacto', products: 0, visible: store.mostrarContacto ?? true, status: 'system', category: 'Información' },
    { id: 'acerca-de', name: 'Acerca de Nosotros', products: 0, visible: store.mostrarAcercaDe ?? true, status: 'system', category: 'Información' }
  ]
  
  // Cargar secciones personalizadas desde el API
  const loadCustomSections = async () => {
    if (!store?.id) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/store-navigation-sections?storeId=${store.id}`)
      if (response.ok) {
        const data = await response.json()
        const sections = data.sections || []
        
        setCustomSections(sections.map((section: any) => ({
          id: section.slug, // Para navegación y UI
          dbId: section.id, // Para API calls
          name: section.name,
          visible: section.isVisible,
          status: 'custom' as const,
          category: 'Personalizada'
        })))
      }
    } catch (error) {
      console.error('Error al cargar secciones personalizadas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Crear nueva sección personalizada
  const createCustomSection = async (name: string) => {
    if (!store?.id) return
    
    try {
      setLoading(true)
      const slug = name.toLowerCase().replace(/\s+/g, '-')
      
      const response = await fetch('/api/store-navigation-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: store.id,
          name: name.trim(),
          slug: slug,
          isVisible: true
        })
      })

      if (response.ok) {
        const data = await response.json()
        const newSection = data.section
        
        setCustomSections(prev => [...prev, {
          id: newSection.slug,
          dbId: newSection.id,
          name: newSection.name,
          visible: newSection.isVisible,
          status: 'custom' as const,
          category: 'Personalizada'
        }])
      } else {
        throw new Error('Error al crear sección')
      }
    } catch (error) {
      console.error('Error al crear sección:', error)
      alert('Error al crear sección. Por favor intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Eliminar sección personalizada
  const deleteCustomSection = async (sectionId: string) => {
    if (!store?.id) return
    
    try {
      const section = customSections.find(s => s.id === sectionId)
      const dbId = section?.dbId
      
      if (!dbId) {
        throw new Error('ID de base de datos no encontrado para la sección')
      }
      
      setLoading(true)
      const response = await fetch(`/api/store-navigation-sections/${dbId}?storeId=${store.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCustomSections(prev => prev.filter(s => s.id !== sectionId))
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar sección')
      }
    } catch (error) {
      console.error('Error al eliminar sección:', error)
      alert('Error al eliminar sección. Por favor intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Actualizar visibilidad de sección personalizada
  const updateSectionVisibility = async (sectionId: string, isVisible: boolean) => {
    if (!store?.id) return
    
    try {
      setLoading(true)
      const localSection = customSections.find(s => s.id === sectionId)
      
      if (localSection && localSection.dbId) {
        const response = await fetch(`/api/store-navigation-sections/${localSection.dbId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            isVisible,
            storeId: store.id 
          })
        })

        if (response.ok) {
          setCustomSections(prev => 
            prev.map(s => 
              s.id === sectionId 
                ? { ...s, visible: isVisible }
                : s
            )
          )
        } else {
          throw new Error('Error al actualizar visibilidad')
        }
      } else {
        throw new Error('Sección no encontrada o sin ID de base de datos')
      }
    } catch (error) {
      console.error('Error al actualizar visibilidad:', error)
      alert(`Error al actualizar visibilidad: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // Cargar secciones al montar el componente
  useEffect(() => {
    loadCustomSections()
  }, [store?.id])
  
  const allSections = [...systemSections, ...customSections]
  
  const toggleSectionVisibility = (sectionId: string) => {
    const systemSection = systemSections.find(s => s.id === sectionId)
    
    if (systemSection) {
      const fieldMap: Record<string, string> = {
        'inicio': 'mostrarInicio',
        'contacto': 'mostrarContacto',
        'acerca-de': 'mostrarAcercaDe'
      }
      const field = fieldMap[sectionId]
      const currentValue = store[field] !== undefined ? store[field] : true
      updateStore(field, !currentValue)
    } else {
      const section = customSections.find(s => s.id === sectionId)
      if (section) {
        updateSectionVisibility(sectionId, !section.visible)
      }
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
      deleteCustomSection(sectionId)
    }
  }
  
  const toggleSelectAll = () => {
    if (selectedSections.length === allSections.length) {
      setSelectedSections([])
    } else {
      setSelectedSections(allSections.map(s => s.id))
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
              const name = prompt('Nombre de la nueva sección:')
              if (name && name.trim()) {
                createCustomSection(name.trim())
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
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
          Gestión de Secciones
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
                  checked={selectedSections.length === allSections.length && allSections.length > 0}
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
            {allSections.map((section, index) => (
              <tr 
                key={section.id}
                style={{ 
                  borderBottom: '1px solid #f1f5f9',
                  background: index % 2 === 0 ? 'white' : '#f8fafc',
                  transition: 'all 0.2s'
                }}
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
                            gap: '10px'
                          }}
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
                                gap: '10px'
                              }}
                            >
                              <Edit2 size={16} color="#64748b" />
                              Editar sección
                            </button>
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
                                gap: '10px'
                              }}
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
      </div>
    </div>
  )
}
