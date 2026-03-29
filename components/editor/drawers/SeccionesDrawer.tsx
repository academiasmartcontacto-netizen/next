'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Eye, EyeOff, Edit2, Trash2, MoreVertical, X } from 'lucide-react'

interface SeccionesDrawerProps {
  onClose: () => void
  store: any
  updateStore: (field: string, value: any) => void
  onNewSection: () => void
  showNewSectionForm: boolean
  setShowNewSectionForm: (show: boolean) => void
}

export default function SeccionesDrawer({ onClose, store, updateStore, onNewSection, showNewSectionForm, setShowNewSectionForm }: SeccionesDrawerProps) {
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [customSections, setCustomSections] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editingSectionName, setEditingSectionName] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  
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
    if (!store?.id || !name.trim()) return
    
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
        
        // Reset form
        setNewSectionName('')
        setShowNewSectionForm(false)
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

  // Manejar creación desde inline form
  const handleNewSectionSubmit = () => {
    if (newSectionName.trim()) {
      createCustomSection(newSectionName.trim())
    }
  }

  // Cancelar nueva sección
  const handleNewSectionCancel = () => {
    setNewSectionName('')
    setShowNewSectionForm(false)
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
            sectionId: localSection.dbId,
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
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Error al actualizar visibilidad')
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

  // Click outside y escape key para cerrar dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null)
      }
    }

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [activeDropdown])
  
  const allSections = [...systemSections, ...customSections]
  
  // Toggle dropdown (solo uno activo a la vez)
  const toggleDropdown = (sectionId: string) => {
    setActiveDropdown(activeDropdown === sectionId ? null : sectionId)
  }
  
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
  
  // Editar sección personalizada
  const editSection = (sectionId: string) => {
    const section = customSections.find(s => s.id === sectionId)
    if (section) {
      setEditingSectionId(sectionId)
      setEditingSectionName(section.name)
      setActiveDropdown(null)
    }
  }

  // Guardar edición de sección
  const saveSectionEdit = async () => {
    if (!editingSectionId || !editingSectionName.trim()) return
    
    const section = customSections.find(s => s.id === editingSectionId)
    if (!section || !section.dbId) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/store-navigation-sections/${section.dbId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sectionId: section.dbId,
          name: editingSectionName.trim(),
          storeId: store.id 
        })
      })

      if (response.ok) {
        setCustomSections(prev => prev.map(s => 
          s.id === editingSectionId ? { ...s, name: editingSectionName.trim() } : s
        ))
        setEditingSectionId(null)
        setEditingSectionName('')
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al actualizar sección')
      }
    } catch (error) {
      console.error('Error al editar sección:', error)
      alert(`Error al editar sección: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // Cancelar edición
  const cancelSectionEdit = () => {
    setEditingSectionId(null)
    setEditingSectionName('')
  }
  
  const deleteSection = (sectionId: string) => {
    const section = customSections.find(s => s.id === sectionId)
    if (section && confirm(`¿Eliminar sección "${section.name}"? Los productos volverán a Inicio.`)) {
      deleteCustomSection(sectionId)
    }
  }
  
  const toggleSelectAll = () => {
    const sections = [...systemSections, ...customSections]
    if (selectedSections.length === sections.length) {
      setSelectedSections([])
    } else {
      setSelectedSections(sections.map((s: any) => s.id))
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
    <div className="px-6 py-6 space-y-4">
      {/* Filtros */}
      {selectedSections.length > 0 && (
        <div className="flex gap-2 justify-end">
          <button
            onClick={bulkToggleVisibility}
            style={{
              padding: '6px 12px',
              background: '#3b82f6',
              border: 'none',
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Toggle Visibilidad
          </button>
          <button
            onClick={bulkDelete}
            style={{
              padding: '6px 12px',
              background: '#ef4444',
              border: 'none',
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Eliminar Seleccionadas
          </button>
        </div>
      )}

      {/* Tabla */}
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'visible' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1e293b', textTransform: 'uppercase', width: '50%' }}>
                <input
                  type="checkbox"
                  checked={selectedSections.length === (systemSections.length + customSections.length) && (systemSections.length + customSections.length) > 0}
                  onChange={toggleSelectAll}
                  style={{ marginRight: '8px', width: '16px', height: '16px' }}
                />
                Sección
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#1e293b', textTransform: 'uppercase', width: '25%' }}>Estado</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#1e293b', textTransform: 'uppercase', width: '25%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Fila para nueva sección */}
            {showNewSectionForm && (
              <tr style={{ 
                borderBottom: '1px solid #f1f5f9',
                background: '#f0fdf4' // Verde claro para indicar modo edición
              }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="text"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                      placeholder="Nombre de la nueva sección..."
                      autoFocus
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '2px solid #10b981',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        backgroundColor: 'white',
                        outline: 'none'
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleNewSectionSubmit()
                        } else if (e.key === 'Escape') {
                          handleNewSectionCancel()
                        }
                      }}
                    />
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: '#dcfce7',
                    color: '#166534'
                  }}>
                    ✓ Visible
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={handleNewSectionSubmit}
                      disabled={!newSectionName.trim() || loading}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: newSectionName.trim() && !loading ? 'pointer' : 'not-allowed',
                        background: newSectionName.trim() && !loading ? '#10b981' : '#e5e7eb',
                        color: newSectionName.trim() && !loading ? 'white' : '#9ca3af',
                        transition: 'all 0.2s'
                      }}
                    >
                      {loading ? '...' : '✓'}
                    </button>
                    <button
                      onClick={handleNewSectionCancel}
                      disabled={loading}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        background: loading ? '#e5e7eb' : '#ef4444',
                        color: loading ? '#9ca3af' : 'white',
                        transition: 'all 0.2s'
                      }}
                    >
                      ✗
                    </button>
                  </div>
                </td>
              </tr>
            )}
            
            {[...systemSections, ...customSections].map((section: any, index: number) => (
              <tr 
                key={section.id}
                style={{ 
                  borderBottom: '1px solid #f1f5f9',
                  background: editingSectionId === section.id ? '#fef3c7' : (index % 2 === 0 ? 'white' : '#f8fafc'),
                  transition: 'all 0.2s'
                }}
              >
                <td style={{ padding: '16px 16px 20px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {editingSectionId === section.id ? (
                      <>
                        <input
                          type="text"
                          value={editingSectionName}
                          onChange={(e) => setEditingSectionName(e.target.value)}
                          placeholder="Nombre de la sección..."
                          autoFocus
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '2px solid #f59e0b',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            backgroundColor: 'white',
                            outline: 'none'
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveSectionEdit()
                            } else if (e.key === 'Escape') {
                              cancelSectionEdit()
                            }
                          }}
                        />
                      </>
                    ) : (
                      <>
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
                        <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                          <div style={{ 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            color: '#1e293b',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            position: 'relative',
                            zIndex: 2
                          }}>
                            {section.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                            {section.category} • {section.products} productos
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  {editingSectionId === section.id ? (
                    <span style={{ 
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: '#dcfce7',
                      color: '#166534'
                    }}>
                      ✓ Visible
                    </span>
                  ) : (
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
                  )}
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  {editingSectionId === section.id ? (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={saveSectionEdit}
                        disabled={!editingSectionName.trim() || loading}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: editingSectionName.trim() && !loading ? 'pointer' : 'not-allowed',
                          background: editingSectionName.trim() && !loading ? '#10b981' : '#e5e7eb',
                          color: editingSectionName.trim() && !loading ? 'white' : '#9ca3af',
                          transition: 'all 0.2s'
                        }}
                      >
                        {loading ? '...' : '✓'}
                      </button>
                      <button
                        onClick={cancelSectionEdit}
                        disabled={loading}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          background: loading ? '#e5e7eb' : '#ef4444',
                          color: loading ? '#9ca3af' : 'white',
                          transition: 'all 0.2s'
                        }}
                      >
                        ✗
                      </button>
                    </div>
                  ) : (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <button
                        onClick={() => toggleDropdown(section.id)}
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
                        aria-expanded={activeDropdown === section.id}
                        aria-haspopup="true"
                      >
                        <MoreVertical size={16} color="#64748b" />
                      </button>
                      
                      {activeDropdown === section.id && (
                        <div ref={dropdownRef}
                          style={{
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
