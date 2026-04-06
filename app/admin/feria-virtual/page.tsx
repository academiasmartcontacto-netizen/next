'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Power, ArrowUp, ArrowDown, Package } from 'lucide-react'
import FeriaSectorModal from '@/components/feria/FeriaSectorModal'

interface FeriaSector {
  id: string
  slug: string
  titulo: string
  descripcion: string
  colorHex: string
  imagenBanner: string | null
  orden: number
  capacidad: number
  categoriaDefaultId: string | null
  activo: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminFeriaVirtualPage() {
  const [sectores, setSectores] = useState<FeriaSector[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSector, setSelectedSector] = useState<FeriaSector | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchSectores()
  }, [])

  const fetchSectores = async () => {
    console.log('📡 [FRONTEND] Cargando sectores desde API...')
    try {
      const response = await fetch('/api/admin/feria-sectores')
      if (response.ok) {
        const data = await response.json()
        console.log('📊 [FRONTEND] Sectores cargados:', {
          cantidad: data.length,
          sectores: data.map((s: any) => ({ id: s.id, titulo: s.titulo, slug: s.slug }))
        })
        setSectores(data)
      } else {
        console.error('❌ [FRONTEND] Error HTTP al cargar sectores:', response.status)
        alert('Error al cargar los sectores')
      }
    } catch (error) {
      console.error('❌ [FRONTEND] Error de red al cargar sectores:', error)
      alert('Error de conexión al cargar los sectores')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSector = () => {
    setSelectedSector(null)
    setIsModalOpen(true)
  }

  const handleEditSector = (sector: FeriaSector) => {
    setSelectedSector(sector)
    setIsModalOpen(true)
  }

  const handleSaveSector = async (sectorData: any) => {
    setIsSubmitting(true)
    
    console.log('💾 [FRONTEND] Procesando sector:', {
      isEditing: !!selectedSector?.id,
      sectorId: selectedSector?.id,
      sectorData: {
        titulo: sectorData.titulo,
        slug: sectorData.slug,
        colorHex: sectorData.colorHex,
        categoriaDefaultId: sectorData.categoriaDefaultId
      }
    })
    
    try {
      // SOLO actualizar si es un sector existente
      if (selectedSector?.id) {
        console.log('🔄 [FRONTEND] Actualizando sector existente')
        
        const response = await fetch(`/api/admin/feria-sectores/${selectedSector.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sectorData)
        })

        const responseData = await response.json()
        console.log('📨 [FRONTEND] Respuesta del servidor:', responseData)

        if (response.ok) {
          console.log('✅ [FRONTEND] Sector actualizado exitosamente')
          await fetchSectores()
          setIsModalOpen(false)
          setSelectedSector(null)
        } else {
          console.error('❌ [FRONTEND] Error del servidor:', responseData)
          alert(`Error al actualizar el sector: ${responseData.error || 'Error desconocido'}`)
        }
      } else {
        // Si es un sector nuevo, el modal ya lo creó en handleSubmit
        console.log('➕ [FRONTEND] Sector nuevo, el modal ya lo creó. Solo recargando.')
        await fetchSectores()
        setIsModalOpen(false)
        setSelectedSector(null)
      }
    } catch (error) {
      console.error('❌ [FRONTEND] Error en la petición:', error)
      alert('Error de conexión al guardar el sector')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSector = async (sector: FeriaSector) => {
    console.log('🗑️ [FRONTEND] Intentando eliminar sector:', {
      id: sector.id,
      titulo: sector.titulo,
      slug: sector.slug
    })
    
    if (!sector.id) {
      console.error('❌ [FRONTEND] El sector no tiene ID:', sector)
      alert('Error: El sector no tiene un ID válido')
      return
    }
    
    if (!confirm(`¿Estás seguro de eliminar el sector "${sector.titulo}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/feria-sectores/${sector.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        console.log('✅ [FRONTEND] Sector eliminado exitosamente')
        await fetchSectores()
      } else {
        const errorData = await response.json()
        console.error('❌ [FRONTEND] Error del servidor:', errorData)
        alert(`Error al eliminar el sector: ${errorData.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('❌ [FRONTEND] Error en la petición:', error)
      alert('Error de conexión al eliminar el sector')
    }
  }

  const handleToggleStatus = async (sector: FeriaSector) => {
    try {
      const response = await fetch(`/api/admin/feria-sectores/${sector.id}/toggle`, {
        method: 'PATCH'
      })

      if (response.ok) {
        await fetchSectores()
      } else {
        alert('Error al cambiar estado')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al cambiar estado')
    }
  }

  const handleReorder = async (sector: FeriaSector, direction: 'up' | 'down') => {
    try {
      const response = await fetch(`/api/admin/feria-sectores/${sector.id}/reorder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ direction })
      })

      if (response.ok) {
        await fetchSectores()
      } else {
        alert('Error al reordenar')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al reordenar')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando sectores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Feria Virtual</h1>
              <p className="text-sm text-gray-600 mt-1">
                Administra los sectores y puestos de la feria virtual
              </p>
            </div>
            <button
              onClick={handleCreateSector}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
            >
              <Plus size={20} />
              Nuevo Sector
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sectores.map((sector: any, index: number) => {
                  // Log para depurar cada sector en el renderizado
                  console.log(`🎨 [RENDER] Sector #${index}:`, {
                    id: sector.id,
                    titulo: sector.titulo,
                    slug: sector.slug,
                    tieneId: !!sector.id,
                    tipoDeId: typeof sector.id
                  })
                  
                  return (
                  <tr key={sector.id || `sector-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {index > 0 && (
                          <button
                            onClick={() => handleReorder(sector, 'up')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Subir"
                          >
                            <ArrowUp size={16} />
                          </button>
                        )}
                        {index < sectores.length - 1 && (
                          <button
                            onClick={() => handleReorder(sector, 'down')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Bajar"
                          >
                            <ArrowDown size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={sector.imagenBanner || '/api/placeholder/60x40?text=Sin+Banner'} 
                        alt={sector.titulo}
                        className="w-15 h-10 object-cover rounded bg-gray-100"
                        style={{ width: '60px', height: '40px' }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {sector.titulo}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sector.descripcion}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {sector.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: sector.colorHex }}
                        />
                        <span className="text-sm text-gray-600">
                          {sector.colorHex}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sector.capacidad} puestos
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sector.activo ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(sector)}
                          className={`p-2 rounded ${sector.activo ? 'text-gray-400 hover:text-gray-600' : 'text-green-600 hover:text-green-800'}`}
                          title={sector.activo ? 'Desactivar' : 'Activar'}
                        >
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => handleEditSector(sector)}
                          className="p-2 text-indigo-600 hover:text-indigo-800"
                          title="Gestionar Puestos"
                        >
                          <Package size={16} />
                        </button>
                        <button
                          onClick={() => handleEditSector(sector)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSector(sector)}
                          className="p-2 text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {sectores.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No hay sectores
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza creando tu primer sector para la feria virtual.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCreateSector}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  <Plus size={20} className="inline mr-2" />
                  Nuevo Sector
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <FeriaSectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sector={selectedSector}
        onSave={handleSaveSector}
      />
    </div>
  )
}
