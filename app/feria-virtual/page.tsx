'use client'

import { useState, useEffect } from 'react'
import { MapPin, ChevronDown, Store, Plus } from 'lucide-react'
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
  tiendas: Tienda[]
}

interface Tienda {
  id: string
  nombre: string | null
  logo: string | null
  url: string | null
  ocupado: boolean
}

export default function FeriaVirtualPage() {
  const [currentDept, setCurrentDept] = useState('LPZ')
  const [showDeptMenu, setShowDeptMenu] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [sectores, setSectores] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar sectores desde la API
  useEffect(() => {
    fetchSectores()
  }, [])

  // Recargar datos cuando cambia el departamento
  useEffect(() => {
    fetchSectores()
  }, [currentDept])

  const fetchSectores = async () => {
    try {
      setLoading(true)
      
      // 1. Obtener sectores
      const sectoresResponse = await fetch('/api/admin/feria-sectores')
      if (!sectoresResponse.ok) {
        throw new Error('Error al cargar sectores')
      }
      const sectoresData = await sectoresResponse.json()
      
      // 2. Para cada sector, obtener sus puestos ocupados en la ciudad actual
      const sectoresConTiendas = await Promise.all(
        sectoresData
          .filter((sector: Sector) => sector.activo)
          .map(async (sector: Sector) => {
            // Obtener bloques y puestos del sector
            const bloquesResponse = await fetch(`/api/admin/feria-bloques?sectorId=${sector.id}&ciudad=${currentDept}`)
            let tiendas: Tienda[] = Array(sector.capacidad).fill(null).map((_, i) => ({
              id: `${sector.slug}-${i}`,
              nombre: null,
              logo: null,
              url: null,
              ocupado: false
            }))
            
            if (bloquesResponse.ok) {
              const bloquesData = await bloquesResponse.json()
              
              // Mapear puestos ocupados a las posiciones del primer bloque
              bloquesData.forEach((bloque: any) => {
                if (bloque.orden === 1) { // Solo primer bloque como en el PHP
                  bloque.puestos.forEach((puesto: any) => {
                    const posicion = puesto.posicion - 1 // Convertir a 0-based
                    if (posicion >= 0 && posicion < tiendas.length) {
                      tiendas[posicion] = {
                        id: puesto.id,
                        nombre: puesto.tiendaNombre || null,
                        logo: puesto.tiendaLogo || null,
                        url: puesto.tiendaSlug ? `/tienda/${puesto.tiendaSlug}` : null,
                        ocupado: true
                      }
                    }
                  })
                }
              })
            }
            
            return {
              ...sector,
              tiendas
            }
          })
      )
      
      setSectores(sectoresConTiendas)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!e.target.closest('.pro-dept-wrapper')) {
        setShowDeptMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleDeptChange = (deptCode: string) => {
    setCurrentDept(deptCode)
    setShowDeptMenu(false)
  }

  const handleSlotClick = (sector: Sector, slotIndex: number) => {
    const tienda = sector.tiendas[slotIndex]
    if (tienda && tienda.ocupado && tienda.url) {
      // Navegar a la tienda
      window.open(tienda.url, '_blank')
    } else {
      // Abrir modal para ocupar espacio
      setSelectedSector(sector)
      setSelectedSlot(slotIndex)
      setShowModal(true)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSector(null)
    setSelectedSlot(null)
  }

  return (
    <div className="feria-layout">
      {/* Tarjeta Central Pro */}
      <div className="feria-pro-card-container">
        <div className="feria-pro-card">
          <h1 className="pro-card-title">Feria Virtual Done!</h1>
          <p className="pro-card-desc">Explora las mejores tiendas de Bolivia en un solo lugar.</p>
          
          <div className="pro-unified-bar">
            <div className="pro-dept-wrapper">
              <div 
                className="pro-dept-trigger"
                onClick={() => setShowDeptMenu(!showDeptMenu)}
              >
                <MapPin className="pro-dept-icon" />
                <span>{DEPARTMENTS[currentDept as keyof typeof DEPARTMENTS]}</span>
                <ChevronDown className="pro-chevron" />
              </div>
              <div className={`dept-menu ${showDeptMenu ? 'show-menu' : ''}`}>
                {Object.entries(DEPARTMENTS).map(([code, name]) => (
                  <a
                    key={code}
                    href="#"
                    className="dept-item"
                    onClick={(e: any) => {
                      e.preventDefault()
                      handleDeptChange(code)
                    }}
                  >
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid de Sectores */}
      <div className="bento-grid">
        {sectores.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Store className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay sectores disponibles
            </h3>
            <p className="text-gray-500">
              Los administradores están configurando la feria virtual.
            </p>
          </div>
        ) : (
          sectores.map((sector) => (
            <div key={sector.id} className="sector-block" style={{ '--sector-color': sector.colorHex } as any}>
              <div className="sector-header-split">
                <div className="split-text-col">
                  <h2 className="sector-title-pro">{sector.titulo}</h2>
                  <p className="sector-desc-pro">{sector.descripcion}</p>
                </div>
                <div className="split-image-col">
                  <div className="image-box">
                    {sector.imagenBanner ? (
                      <img src={sector.imagenBanner} alt={sector.titulo} />
                    ) : (
                      <div className="image-placeholder" style={{ 
                        backgroundColor: sector.colorHex, 
                        opacity: 0.2, 
                        width: '100%', 
                        height: '100%' 
                      }}></div>
                    )}
                    <a href={`/sector/${sector.slug}?dept=${currentDept}`} className="view-all-pill" title="Ver todo">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9V3h6"></path><path d="M3 3l7 7"></path><path d="M21 9V3h-6"></path><path d="M21 3l-7 7"></path>
                        <path d="M21 15v6h-6"></path><path d="M21 21l-7-7"></path><path d="M3 15v6h6"></path><path d="M3 21l7-7"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="stores-inner-grid">
                {sector.tiendas.map((tienda: Tienda, index: number) => (
                  <div
                    key={index}
                    className={`store-item ${tienda?.ocupado ? 'real' : 'empty'}`}
                    onClick={() => handleSlotClick(sector, index)}
                    title={tienda?.ocupado ? tienda.nombre || 'Tienda' : 'Espacio Disponible'}
                  >
                    {tienda?.ocupado ? (
                      <div className="store-logo-wrap">
                        {tienda.logo ? (
                          <img src={tienda.logo} alt={tienda.nombre || 'Tienda'} className="store-img fade-in-fast" />
                        ) : (
                          <Store style={{ fontSize: '48px', color: '#e5e5e5' }} />
                        )}
                      </div>
                    ) : (
                      <span className="empty-text">LIBRE</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para ocupar espacio */}
      {showModal && (
        <div className="feria-modal-overlay active" onClick={closeModal}>
          <div className="feria-modal-content" onClick={(e: any) => e.stopPropagation()}>
            <button className="feria-modal-close" onClick={closeModal}>&times;</button>
            
            <div className="modal-state" style={{ display: 'block' }}>
              <div className="modal-icon-wrap orange">
                <Store />
              </div>
              <h3>¡Ocupa este espacio!</h3>
              <p>El espacio #{selectedSlot! + 1} en {selectedSector?.titulo} está disponible.</p>
              <p>Para ocupar este puesto, primero necesitas crear tu tienda virtual.</p>
              <div className="modal-actions">
                <a href="/mi/crear-tienda" className="btn-modal primary">
                  <Plus size={16} style={{ marginRight: '8px' }} />
                  Crear Tienda Ahora
                </a>
                <button onClick={closeModal} className="btn-modal secondary">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .feria-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        
        .feria-modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        
        .feria-modal-content {
          background: white;
          border-radius: 20px;
          padding: 32px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          position: relative;
        }
        
        .feria-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        
        .modal-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        
        .modal-icon-wrap.orange {
          background: rgba(255, 107, 53, 0.1);
          color: var(--accent-orange);
        }
        
        .modal-state h3 {
          margin: 0 0 12px;
          color: #1e293b;
        }
        
        .modal-state p {
          margin: 0 0 24px;
          color: #64748b;
        }
        
        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        
        .btn-modal {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .btn-modal.primary {
          background: var(--accent-orange);
          color: white;
        }
        
        .btn-modal.primary:hover {
          background: #e55a2b;
        }
        
        .btn-modal.secondary {
          background: #f1f5f9;
          color: #64748b;
        }
        
        .btn-modal.secondary:hover {
          background: #e2e8f0;
        }
      `}</style>
    </div>
  )
}
