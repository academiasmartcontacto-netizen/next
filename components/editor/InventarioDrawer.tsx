'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, Package, Search, Filter, MoreVertical, AlertCircle } from 'lucide-react'

interface InventarioDrawerProps {
  onClose: () => void
  store: any
  updateStore: (field: string, value: any) => void
}

export default function InventarioDrawer({ onClose, store, updateStore }: InventarioDrawerProps) {
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('todos')

  // Cargar items del inventario
  const loadInventory = async () => {
    if (!store?.id) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/products?storeId=${store.id}`)
      if (response.ok) {
        const data = await response.json()
        setInventoryItems(data.products || [])
      }
    } catch (error) {
      console.error('Error al cargar inventario:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [store?.id])

  // Toggle selección de items
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  // Toggle selección todos
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(item => item.id))
    }
  }

  // Toggle visibilidad de item
  const toggleItemVisibility = (itemId: string) => {
    setInventoryItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, visible: !item.visible } : item
    ))
  }

  // Editar item
  const editItem = (itemId: string) => {
    const item = inventoryItems.find(i => i.id === itemId)
    if (item) {
      const newName = prompt('Editar nombre del producto:', item.name)
      if (newName && newName.trim() && newName !== item.name) {
        setInventoryItems(prev => prev.map(i => 
          i.id === itemId ? { ...i, name: newName.trim() } : i
        ))
      }
    }
  }

  // Eliminar item
  const deleteItem = (itemId: string) => {
    const item = inventoryItems.find(i => i.id === itemId)
    if (item && confirm(`¿Eliminar "${item.name}" del inventario?`)) {
      setInventoryItems(prev => prev.filter(i => i.id !== itemId))
      setSelectedItems(prev => prev.filter(id => id !== itemId))
    }
  }

  // Eliminación masiva
  const bulkDelete = () => {
    if (selectedItems.length === 0) return
    if (confirm(`¿Eliminar ${selectedItems.length} productos seleccionados del inventario?`)) {
      setInventoryItems(prev => prev.filter(item => !selectedItems.includes(item.id)))
      setSelectedItems([])
    }
  }

  // Toggle visibilidad masiva
  const bulkToggleVisibility = () => {
    if (selectedItems.length === 0) return
    setInventoryItems(prev => prev.map(item => 
      selectedItems.includes(item.id) ? { ...item, visible: !item.visible } : item
    ))
    setSelectedItems([])
  }

  // Filtrar items
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'todos' || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Obtener categorías únicas
  const categories = ['todos', ...Array.from(new Set(inventoryItems.map(item => item.category).filter(Boolean)))]

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' }}>
      {/* Header */}
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
            <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>Gestión de Inventario</h2>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              {inventoryItems.length} productos en inventario
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              const name = prompt('Nombre del nuevo producto:')
              if (name && name.trim()) {
                // Aquí iría la lógica para crear producto
                console.log('Crear producto:', name)
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
            <Plus size={16} /> Nuevo Producto
          </button>
        </div>
      </div>
      
      {/* Filtros */}
      <div style={{ 
        background: 'white', 
        padding: '16px 20px', 
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          {/* Buscador */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          
          {/* Filtro por categoría */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
              background: 'white'
            }}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'todos' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>
        </div>
        
        {selectedItems.length > 0 && (
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
              Eliminar ({selectedItems.length})
            </button>
          </div>
        )}
      </div>
      
      {/* Tabla de Inventario */}
      <div style={{ flex: 1, overflow: 'visible', background: 'white' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#64748b' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
              <div>Cargando inventario...</div>
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={toggleSelectAll}
                    style={{ marginRight: '8px' }}
                  />
                  Producto
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr 
                  key={item.id}
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
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <div style={{ 
                        fontWeight: '600', 
                        color: '#1e293b', 
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '300px'
                      }}>
                        {item.name}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
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
                      {activeDropdown === item.id && (
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
                              toggleItemVisibility(item.id)
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
                            {item.visible ? <EyeOff size={16} color="#64748b" /> : <Eye size={16} color="#64748b" />}
                            {item.visible ? 'Ocultar' : 'Mostrar'}
                          </button>
                          
                          <button
                            onClick={() => {
                              editItem(item.id)
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
                            Editar
                          </button>
                          
                          <div style={{ height: '1px', background: '#e5e7eb', margin: '4px 0' }}></div>
                          
                          <button
                            onClick={() => {
                              deleteItem(item.id)
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
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {filteredItems.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            color: '#94a3b8' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📦</div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              {searchTerm || filterCategory !== 'todos' ? 'No se encontraron productos' : 'No hay productos en el inventario'}
            </div>
            <div style={{ fontSize: '14px' }}>
              {searchTerm || filterCategory !== 'todos' 
                ? 'Intenta con otra búsqueda o filtro' 
                : 'Agrega tu primer producto al inventario'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
