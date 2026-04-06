'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Edit, Trash2, Store, MapPin, Box } from 'lucide-react'
import '@/styles/feria-virtual.css'

interface Bloque {
  id: string
  nombre: string
  orden: number
  capacidad: number
  activo: boolean
  puestos: Puesto[]
}

interface Puesto {
  id: string
  posicion: number
  usuarioId?: string
  tiendaNombre?: string
  tiendaSlug?: string
  tiendaLogo?: string
  estado: string
  ciudad: string
}

interface Sector {
  id: string
  titulo: string
  slug: string
  colorHex: string
}

const DEPARTMENTS = {
  'LPZ': 'La Paz',
  'ALT': 'El Alto', 
  'SCZ': 'Santa Cruz',
  'CBA': 'Cochabamba',
  'ORU': 'Oruro',
  'PTS': 'Potosí',
  'TJA': 'Tarija',
  'CHQ': 'Chuquisaca',
  'BEN': 'Beni',
  'PND': 'Pando'
}

export default function GestionPuestosPage() {
  const params = useParams()
  const router = useRouter()
  const sectorId = params.sectorId as string

  const [sector, setSector] = useState<Sector | null>(null)
  const [bloques, setBloques] = useState<Bloque[]>([])
  const [currentDept, setCurrentDept] = useState('LPZ')
  const [loading, setLoading] = useState(true)
  const [showDeptMenu, setShowDeptMenu] = useState(false)

  // Cargar datos del sector y bloques
  useEffect(() => {
    if (sectorId) {
      fetchSectorData()
    }
  }, [sectorId, currentDept])

  const fetchSectorData = async () => {
    try {
      setLoading(true)
      
      // Cargar sector
      const sectorResponse = await fetch(`/api/admin/feria-sectores/${sectorId}`)
      if (sectorResponse.ok) {
        const sectorData = await sectorResponse.json()
        setSector(sectorData)
      }

      // Cargar bloques con puestos
      const bloquesResponse = await fetch(`/api/admin/feria-bloques?sectorId=${sectorId}&ciudad=${currentDept}`)
      if (bloquesResponse.ok) {
        const bloquesData = await bloquesResponse.json()
        setBloques(bloquesData)
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeptChange = (deptCode: string) => {
    setCurrentDept(deptCode)
    setShowDeptMenu(false)
  }

  const handleCreateBloque = async () => {
    const nombre = prompt("Nombre del nuevo bloque:")
    if (!nombre) return

    try {
      const response = await fetch('/api/admin/feria-bloques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectorId,
          nombre,
          orden: bloques.length + 1,
          capacidad: 12
        })
      })

      if (response.ok) {
        fetchSectorData()
      } else {
        alert('Error al crear bloque')
      }
    } catch (error) {
      console.error('Error creando bloque:', error)
      alert('Error al crear bloque')
    }
  }

  const handleEditBloque = async (bloqueId: string, nombreActual: string) => {
    const nuevoNombre = prompt("Editar nombre del bloque:", nombreActual)
    if (!nuevoNombre || nuevoNombre === nombreActual) return

    try {
      const response = await fetch(`/api/admin/feria-bloques/${bloqueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre })
      })

      if (response.ok) {
        fetchSectorData()
      } else {
        alert('Error al editar bloque')
      }
    } catch (error) {
      console.error('Error editando bloque:', error)
      alert('Error al editar bloque')
    }
  }

  const handleDeleteBloque = async (bloqueId: string) => {
    if (!confirm("¿Eliminar este bloque? Se liberarán todas las tiendas asignadas a él.")) return

    try {
      const response = await fetch(`/api/admin/feria-bloques/${bloqueId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchSectorData()
      } else {
        alert('Error al eliminar bloque')
      }
    } catch (error) {
      console.error('Error eliminando bloque:', error)
      alert('Error al eliminar bloque')
    }
  }

  const handleAsignarTienda = async (bloqueId: string, posicion: number) => {
    const input = prompt("ASIGNAR TIENDA:\n\nIngresa el LINK o el SLUG de la tienda.\nEjemplo: 'tingo'")
    
    if (!input || input.trim() === '') return

    let slug = input.trim()
    if (slug.includes('/tienda/')) {
      slug = slug.split('/tienda/')[1].split('/')[0].split('?')[0]
    }

    try {
      const response = await fetch('/api/admin/feria-puestos/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bloqueId,
          posicion,
          ciudad: currentDept,
          tiendaSlug: slug
        })
      })

      if (response.ok) {
        fetchSectorData()
      } else {
        const error = await response.json()
        alert('Error: ' + error.message)
      }
    } catch (error) {
      console.error('Error asignando tienda:', error)
      alert('Error de conexión')
    }
  }

  const handleLiberarPuesto = async (puestoId: string) => {
    if (!confirm("¿Quitar esta tienda del puesto?")) return

    try {
      const response = await fetch(`/api/admin/feria-puestos/${puestoId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchSectorData()
      } else {
        alert('Error al liberar puesto')
      }
    } catch (error) {
      console.error('Error liberando puesto:', error)
      alert('Error al liberar puesto')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    )
  }

  if (!sector) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Sector no encontrado</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/feria-virtual')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Store className="w-6 h-6 mr-2 text-primary" />
                  Gestión Visual: {sector.titulo}
                </h1>
                <p className="text-sm text-gray-500">
                  Sector: <span style={{ color: sector.colorHex }}>{sector.slug}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Selector de Departamento */}
              <div className="relative">
                <button
                  onClick={() => setShowDeptMenu(!showDeptMenu)}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="font-medium">{DEPARTMENTS[currentDept as keyof typeof DEPARTMENTS]}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDeptMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    {Object.entries(DEPARTMENTS).map(([code, name]) => (
                      <button
                        key={code}
                        onClick={() => handleDeptChange(code)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                          currentDept === code ? 'bg-blue-50 text-blue-600' : ''
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón Nuevo Bloque */}
              <button
                onClick={handleCreateBloque}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nuevo Bloque
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta informativa */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Store className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-800">
              Haz clic en los espacios libres para asignar tiendas. Usa los botones de editar para modificar bloques.
            </span>
            <span className="ml-auto text-sm font-medium text-blue-600">
              Ciudad: {DEPARTMENTS[currentDept as keyof typeof DEPARTMENTS]}
            </span>
          </div>
        </div>
      </div>

      {/* Grid de Bloques */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {bloques.length === 0 ? (
          <div className="text-center py-12">
            <Box className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay bloques definidos
            </h3>
            <p className="text-gray-500 mb-4">
              Crea bloques para organizar los puestos de este sector.
            </p>
            <button
              onClick={handleCreateBloque}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Bloque
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {bloques.map((bloque) => (
              <div
                key={bloque.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                style={{ '--sector-color': sector.colorHex } as any}
              >
                {/* Header del Bloque */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Box className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{bloque.nombre}</span>
                      <button
                        onClick={() => handleEditBloque(bloque.id, bloque.nombre)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteBloque(bloque.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {bloque.puestos?.filter(p => p.estado === 'ocupado').length || 0} tiendas aquí
                  </p>
                </div>

                {/* Grid de Puestos */}
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: bloque.capacidad }, (_, i) => {
                      const posicion = i + 1
                      const puesto = bloque.puestos?.find(p => p.posicion === posicion)
                      const isOccupied = puesto && puesto.estado === 'ocupado'

                      return (
                        <div
                          key={i}
                          className={`relative aspect-square rounded-lg border-2 border-dashed transition-all ${
                            isOccupied
                              ? 'border-green-500 bg-white cursor-grab hover:shadow-md'
                              : 'border-gray-300 bg-gray-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50'
                          }`}
                          onClick={() => !isOccupied && handleAsignarTienda(bloque.id, posicion)}
                        >
                          {/* Número de posición */}
                          <span className="absolute top-1 left-1 text-xs font-bold text-white bg-black bg-opacity-50 px-1 rounded">
                            {posicion}
                          </span>

                          {isOccupied ? (
                            <div className="w-full h-full flex flex-col items-center justify-center p-1">
                              {/* Controles del puesto */}
                              <div className="absolute top-1 right-1 flex space-x-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleLiberarPuesto(puesto!.id)
                                  }}
                                  className="text-red-500 hover:text-red-700 bg-white rounded p-0.5 shadow-sm"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Logo de la tienda */}
                              <div className="w-full h-full flex flex-col items-center justify-center">
                                {puesto.tiendaLogo ? (
                                  <img
                                    src={puesto.tiendaLogo}
                                    alt={puesto.tiendaNombre}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                    }}
                                  />
                                ) : (
                                  <Store className="w-6 h-6 text-gray-400" />
                                )}
                                <div className="hidden">
                                  <Store className="w-6 h-6 text-gray-400" />
                                </div>
                                
                                {/* Nombre de la tienda */}
                                {puesto.tiendaNombre && (
                                  <p className="text-xs text-center text-gray-700 mt-1 truncate w-full">
                                    {puesto.tiendaNombre}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Plus className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
