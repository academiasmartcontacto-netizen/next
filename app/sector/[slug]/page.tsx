'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, MapPin, Store } from 'lucide-react'
import '@/styles/feria-virtual.css'

// Departamentos de Bolivia
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

interface Bloque {
  id: string
  nombre: string
  orden: number
  capacidad: number
  activo: boolean
  createdAt: string
  updatedAt: string
  puestos: Puesto[]
}

interface Puesto {
  id: string
  posicion: number
  usuarioId: string | null
  estado: string
  ciudad: string
  tiendaNombre: string | null
  tiendaSlug: string | null
  tiendaLogo: string | null
}

interface Sector {
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

export default function SectorDetallePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const slug = params.slug as string
  const dept = searchParams.get('dept') || 'LPZ'
  
  const [sector, setSector] = useState<Sector | null>(null)
  const [bloques, setBloques] = useState<Bloque[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSectorData()
  }, [slug, dept])

  const fetchSectorData = async () => {
    try {
      setLoading(true)
      
      // 1. Obtener datos del sector
      const sectorResponse = await fetch(`/api/admin/feria-sectores/${slug}`)
      if (!sectorResponse.ok) {
        throw new Error('Sector no encontrado')
      }
      const sectorData = await sectorResponse.json()
      setSector(sectorData)
      
      // 2. Obtener todos los bloques del sector
      const bloquesResponse = await fetch(`/api/admin/feria-bloques?sectorId=${sectorData.id}&ciudad=${dept}`)
      if (!bloquesResponse.ok) {
        throw new Error('Error al cargar bloques')
      }
      const bloquesData = await bloquesResponse.json()
      setBloques(bloquesData)
      
      console.log(`📋 [SECTOR DETALLE] ${bloquesData.length} bloques cargados para ${sectorData.titulo} en ${dept}`)
      
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVolver = () => {
    router.push(`/feria-virtual?dept=${dept}`)
  }

  if (loading) {
    return (
      <div className="feria-layout">
        <div className="feria-pro-card-container">
          <div className="feria-pro-card">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando sector...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!sector) {
    return (
      <div className="feria-layout">
        <div className="feria-pro-card-container">
          <div className="feria-pro-card">
            <div className="text-center py-12">
              <Store className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sector no encontrado
              </h3>
              <button
                onClick={handleVolver}
                className="btn btn-outline-dark rounded-pill px-4"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="feria-layout">
      {/* Header Contexto */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-2">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            <MapPin className="text-danger me-2" />
            {DEPARTMENTS[dept as keyof typeof DEPARTMENTS]}
          </h1>
          <p className="text-muted mb-0">
            Sector: <strong style={{ color: sector.colorHex }}>{sector.titulo}</strong>
          </p>
        </div>
        <button
          onClick={handleVolver}
          className="btn btn-outline-dark rounded-pill px-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Volver
        </button>
      </div>

      {/* GRID DE BLOQUES */}
      <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '24px' }}>
        
        {bloques.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No hay bloques definidos para este sector.</p>
          </div>
        ) : (
          bloques.map((bloque) => (
            <div key={bloque.id} className="sector-block" style={{ 
              '--sector-color': sector.colorHex,
              display: 'flex',
              flexDirection: 'column' 
            } as any}>
              
              {/* Header Bloque */}
              <div className="sector-header-split">
                <div className="split-text-col">
                  <h2 className="sector-title-pro">{bloque.nombre}</h2>
                  <p className="sector-desc-pro">{bloque.puestos.length} tiendas aquí</p>
                </div>
                <div className="split-image-col">
                  <div className="image-box">
                    {sector.imagenBanner ? (
                      <img 
                        src={sector.imagenBanner} 
                        alt={sector.titulo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(1.02) contrast(1.02)', mixBlendMode: 'multiply' }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        background: `linear-gradient(135deg, ${sector.colorHex} 0%, #ffffff 100%)`, 
                        opacity: 0.8 
                      }}></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid de Tiendas */}
              <div className="stores-inner-grid-wrapper">
                {Array.from({ length: bloque.capacidad }, (_, i) => {
                  const puesto = bloque.puestos.find(p => p.posicion === i + 1)
                  const tiendaNombre = puesto?.tiendaNombre
                  const tiendaLogo = puesto?.tiendaLogo
                  const tiendaUrl = puesto?.tiendaSlug ? `/tienda/${puesto.tiendaSlug}` : null
                  
                  return (
                    <div key={i} className="store-item">
                      {tiendaNombre ? (
                        <a href={tiendaUrl} className="store-item real" title={tiendaNombre} target="_blank">
                          <div className="store-logo-wrap">
                            {tiendaLogo ? (
                              <img src={tiendaLogo} alt={tiendaNombre} />
                            ) : (
                              <div className="store-placeholder">
                                <Store className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <span className="store-name">{tiendaNombre}</span>
                        </a>
                      ) : (
                        <div className="store-item empty">
                          <div className="store-placeholder">
                            <Store className="w-6 h-6" />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
