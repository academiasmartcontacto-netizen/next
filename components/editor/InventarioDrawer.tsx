'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, Package, Search, Filter, MoreVertical, AlertCircle } from 'lucide-react'

interface InventarioDrawerProps {
  onClose: () => void
  store: any
  updateStore: (field: string, value: any) => void
  onNewProduct: () => void
  showNewProductForm: boolean
  setShowNewProductForm: (show: boolean) => void
}

export default function InventarioDrawer({ 
  onClose, 
  store, 
  updateStore, 
  onNewProduct, 
  showNewProductForm, 
  setShowNewProductForm,
  onOpenProductos, 
  onEditProducto 
}: InventarioDrawerProps & { onOpenProductos?: () => void, onEditProducto?: (productId: string) => void }) {
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('todos')
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [editingProductName, setEditingProductName] = useState('')
  const [editingProductDescription, setEditingProductDescription] = useState('')
  const [editingProductPrice, setEditingProductPrice] = useState('')
  const [editingProductCategory, setEditingProductCategory] = useState('')
  const [editingProductImage, setEditingProductImage] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // Toggle dropdown (solo uno activo a la vez)
  const toggleDropdown = (productId: string) => {
    setActiveDropdown(activeDropdown === productId ? null : productId)
  }

  // Cargar items del inventario
  const loadInventory = async () => {
    if (!store?.id) return
    
    try {
      setLoading(true)
      // Usar la misma API que la tienda pública que sí funciona
      const response = await fetch(`/api/stores/${store.link}/products`)
      if (response.ok) {
        const data = await response.json()
        console.log('=== PRODUCTOS RECIBIDOS (API TIENDA) ===')
        console.log('Data completa:', data)
        console.log('Productos:', data.products)
        
        if (data.products && data.products.length > 0) {
          data.products.forEach((product: any, index: number) => {
            console.log(`Producto ${index + 1}:`, {
              id: product.id,
              name: product.name,
              image: product.image,
              images: product.images
            })
          })
        }
        
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
  const toggleItemSelection = (productId: string) => {
    setSelectedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
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
  const toggleItemVisibility = (productId: string) => {
    setInventoryItems(prev => prev.map(item => 
      item.id === productId ? { ...item, visible: !item.visible } : item
    ))
  }

  // Editar item
  const editItem = (productId: string) => {
    console.log('=== INICIO EDICIÓN COMPLETA ===')
    console.log('1. ProductId recibido:', productId)
    console.log('2. Estado actual inventoryItems:', inventoryItems)
    
    const item = inventoryItems.find(i => i.id === productId)
    console.log('3. Item encontrado:', item)
    
    if (item) {
      console.log('4. Configurando estados de edición COMPLETA...')
      console.log('   - setEditingProductId:', productId)
      
      // Configurar TODOS los campos del producto para edición
      setEditingProductId(productId)
      setEditingProductName(item.name || '')
      setEditingProductDescription(item.description || '')
      setEditingProductPrice(item.price ? item.price.toString() : '0')
      setEditingProductCategory(item.category || 'general')
      setEditingProductImage(item.image || '')
      setActiveDropdown(null)
      
      console.log('5. ✅ Estados de edición COMPLETA configurados')
    } else {
      console.log('❌ Item NO encontrado para el ID:', productId)
    }
    console.log('=== FIN EDICIÓN COMPLETA ===')
  }

  // Guardar edición de producto
  const saveProductEdit = async () => {
    console.log('=== INICIO GUARDADO EDICIÓN ===')
    console.log('1. Estado inicial:')
    console.log('   - editingProductId:', editingProductId)
    console.log('   - editingProductName:', editingProductName)
    console.log('   - store.id:', store?.id)
    
    if (!editingProductId || !editingProductName.trim()) {
      console.log('❌ VALIDACIÓN FALLIDA - Retornando temprano')
      return
    }
    
    try {
      console.log('2. Iniciando setLoading(true)')
      setLoading(true)
      
      // 1. Llamar al API REAL para actualizar en la base de datos
      console.log('3. Llamando API REAL para actualizar producto...')
      const response = await fetch(`/api/products/${editingProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editingProductName.trim(),
          storeId: store.id 
        })
      })
      
      console.log('   - Response status:', response.status)
      console.log('   - Response ok:', response.ok)
      
      if (response.ok) {
        const data = await response.json()
        console.log('   - ✅ Producto actualizado en BD:', data.product)
        
        // 2. Actualizar estado local con el resultado real
        setInventoryItems(prev => prev.map(item => 
          item.id === editingProductId ? data.product : item
        ))
        
        // 3. Comunicar cambio a tienda pública
        console.log('4. Enviando mensaje a tienda pública...')
        if (typeof window !== 'undefined' && window.parent) {
          const message = {
            type: 'UPDATE_PRODUCT_NAME',
            productId: editingProductId,
            productName: editingProductName.trim()
          }
          console.log('   - Mensaje:', message)
          window.parent.postMessage(message, '*')
          console.log('   - ✅ Mensaje enviado')
        } else {
          console.log('   - ❌ No se puede enviar mensaje (window.parent no disponible)')
        }
        
        console.log('5. ✅ Producto guardado en base de datos')
        
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('   - ❌ Error del API:', errorData)
        throw new Error(errorData.error || 'Error al actualizar producto')
      }
      
      console.log('6. Limpiando estado de edición...')
      setEditingProductId(null)
      setEditingProductName('')
      console.log('   - ✅ Edición limpiada')
      
    } catch (error: any) {
      console.error('❌ ERROR GENERAL en saveProductEdit:', error)
      alert(`Error al editar producto: ${error.message || error}`)
    } finally {
      console.log('7. Finalizando setLoading(false)')
      setLoading(false)
      console.log('=== FIN GUARDADO EDICIÓN ===')
    }
  }

  // Cancelar edición
  const cancelProductEdit = () => {
    setEditingProductId(null)
    setEditingProductName('')
  }

  // Eliminar item
  const deleteItem = async (productId: string) => {
    const item = inventoryItems.find(i => i.id === productId)
    if (item && confirm(`¿Eliminar "${item.name}" del inventario?`)) {
      try {
        console.log('=== ELIMINANDO PRODUCTO ===')
        console.log('Item ID:', productId)
        console.log('Item completo:', item)
        
        // Eliminar de la base de datos usando query parameter
        const response = await fetch(`/api/products?id=${productId}`, {
          method: 'DELETE'
        })
        
        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)
        
        if (response.ok) {
          const result = await response.json()
          console.log('Response data:', result)
          
          // Eliminar del estado local solo si la API tuvo éxito
          setInventoryItems(prev => prev.filter(i => i.id !== productId))
          setSelectedItems(prev => prev.filter(id => id !== productId))
          console.log('Producto eliminado correctamente:', item.name)
        } else {
          const errorData = await response.json()
          console.error('Error response:', errorData)
          console.error('Status text:', response.statusText)
          alert(`Error al eliminar producto: ${errorData.error || response.statusText}`)
        }
      } catch (error: any) {
        console.error('Error de conexión al eliminar producto:', error)
        alert(`Error de conexión: ${error.message}`)
      }
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

  // Función para convertir a title case proper
  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Obtener categorías únicas
  const categories = ['todos', ...Array.from(new Set(inventoryItems.map(item => item.category).filter(Boolean)))]

  return (
    <div className="px-6 py-6 space-y-4">
      {/* Filtros */}
      <div className="flex justify-end">
        <div className="flex gap-4">
          {/* Buscador */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* Filtro por categoría */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="py-2 pl-4 pr-8 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'todos' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>
        </div>
        
        {selectedItems.length > 0 && (
          <div className="flex gap-4">
            <button
              onClick={bulkToggleVisibility}
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-blue-500"
            >
              Toggle Visibilidad
            </button>
            <button
              onClick={bulkDelete}
              className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-red-500"
            >
              Eliminar ({selectedItems.length})
            </button>
          </div>
        )}
      </div>
      
      {/* Tabla de Inventario */}
      <div style={{ flex: 1, overflow: 'visible', background: 'white', borderRadius: '8px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#64748b' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
              <div>Cargando inventario...</div>
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ background: '#e2e8f0', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#1e293b', textTransform: 'capitalize', width: '5%', verticalAlign: 'middle' }}>
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={toggleSelectAll}
                    style={{ width: '16px', height: '16px' }}
                  />
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#1e293b', textTransform: 'capitalize', width: '65%', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Imagen de encabezado alineada con las imágenes de filas */}
                    <div style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '6px', 
                      overflow: 'hidden',
                      background: '#e2e8f0',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <div style={{ 
                        fontSize: '20px', 
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%'
                      }}>
                        📦
                      </div>
                    </div>
                    <span>Productos</span>
                  </div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#1e293b', textTransform: 'capitalize', width: '30%', verticalAlign: 'middle' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr 
                  key={`${item.id}-${index}`} // Clave única combinando ID y índice
                  style={{ 
                    borderBottom: '1px solid #f1f5f9',
                    background: editingProductId === item.id ? '#fef3c7' : (index % 2 === 0 ? 'white' : '#f8fafc'),
                    transition: 'all 0.2s'
                  }}
                >
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      style={{ width: '16px', height: '16px' }}
                    />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {editingProductId === item.id ? (
                        <>
                          {console.log('=== RENDERIZANDO INPUT EDICIÓN ===')}
                          {console.log('   - Item ID:', item.id)}
                          {console.log('   - EditingProductId:', editingProductId)}
                          {console.log('   - Son iguales:', item.id === editingProductId)}
                          {console.log('   - EditingProductName:', editingProductName)}
                          <input
                            type="text"
                            value={editingProductName}
                            onChange={(e) => {
                              console.log('=== CAMBIO EN INPUT ===')
                              console.log('   - Nuevo valor:', e.target.value)
                              setEditingProductName(e.target.value)
                            }}
                            placeholder="Nombre del producto..."
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
                              console.log('=== TECLA PRESIONADA ===')
                              console.log('   - Key:', e.key)
                              if (e.key === 'Enter') {
                                console.log('   - Presionado ENTER - Guardando...')
                                saveProductEdit()
                              } else if (e.key === 'Escape') {
                                console.log('   - Presionado ESCAPE - Cancelando...')
                                cancelProductEdit()
                              }
                            }}
                          />
                        </>
                      ) : (
                        <>
                          {/* Imagen simple del producto */}
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '6px', 
                            overflow: 'hidden',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover' 
                                }}
                                onError={(e) => {
                                  console.log('Error loading image:', item.image);
                                  const currentTarget = e.currentTarget;
                                  const nextElement = currentTarget.nextElementSibling as HTMLElement;
                                  if (nextElement) {
                                    currentTarget.style.display = 'none';
                                    nextElement.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : (
                              <div style={{ 
                                fontSize: '18px', 
                                color: '#94a3b8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%'
                              }}>
                                📦
                              </div>
                            )}
                            {/* Placeholder oculto que se muestra si la imagen falla */}
                            <div style={{ 
                              fontSize: '18px', 
                              color: '#94a3b8',
                              display: 'none',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                              height: '100%',
                              position: 'absolute',
                              top: '0',
                              left: '0'
                            }}>
                              📦
                            </div>
                          </div>
                          <div style={{ 
                            fontWeight: '600', 
                            color: '#1e293b', 
                            fontSize: '14px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '400px',
                            minWidth: '200px'
                          }}>
                            {toTitleCase(item.name)}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    {editingProductId === item.id ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => {
                            console.log('=== BOTÓN GUARDAR CLICKEADO ===')
                            saveProductEdit()
                          }}
                          disabled={!editingProductName.trim() || loading}
                          style={{
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: editingProductName.trim() && !loading ? 'pointer' : 'not-allowed',
                            background: editingProductName.trim() && !loading ? '#10b981' : '#e5e7eb',
                            color: editingProductName.trim() && !loading ? 'white' : '#9ca3af',
                            transition: 'all 0.2s'
                          }}
                        >
                          {loading ? '...' : '✓'}
                        </button>
                        <button
                          onClick={() => {
                            console.log('=== BOTÓN CANCELAR CLICKEADO ===')
                            cancelProductEdit()
                          }}
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
                          onClick={() => toggleDropdown(item.id)}
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
                          aria-expanded={activeDropdown === item.id}
                          aria-haspopup="true"
                        >
                          <MoreVertical size={16} color="#64748b" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeDropdown === item.id && (
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
                                if (onEditProducto) {
                                  onEditProducto(item.id)
                                  setActiveDropdown(null)
                                }
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
                    )}
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
