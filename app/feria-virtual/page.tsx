'use client'

import { useState, useEffect } from 'react'
import { MapPin, ChevronDown, Store, Plus } from 'lucide-react'
import '@/styles/feria-virtual.css'

// Datos de ejemplo - vendrán de la API
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

// Sectores predefinidos (8 categorías Symbaloo)
const SECTORES = [
  {
    id: 'tech',
    titulo: 'Celulares',
    slug: 'tech',
    descripcion: 'Las mejores tiendas y marcas',
    colorHex: '#FF6B35',
    imagenBanner: null,
    capacidad: 12,
    tiendas: Array(12).fill(null).map((_, i) => ({
      id: `tech-${i}`,
      nombre: null,
      logo: null,
      url: null,
      ocupado: false
    }))
  },
  {
    id: 'fashion',
    titulo: 'Ropa',
    slug: 'fashion', 
    descripcion: 'Moda Nacional y Americana',
    colorHex: '#FF6B35',
    imagenBanner: null,
    capacidad: 12,
    tiendas: Array(12).fill(null).map((_, i) => ({
      id: `fashion-${i}`,
      nombre: null,
      logo: null,
      url: null,
      ocupado: false
    }))
  },
  {
    id: 'home',
    titulo: 'Muebles',
    slug: 'home',
    descripcion: 'Hogar, Camas y Roperos',
    colorHex: '#FF6B35',
    imagenBanner: null,
    capacidad: 12,
    tiendas: Array(12).fill(null).map((_, i) => ({
      id: `home-${i}`,
      nombre: null,
      logo: null,
      url: null,
      ocupado: false
    }))
  },
  {
    id: 'toys',
    titulo: 'Juguetes',
    slug: 'toys',
    descripcion: 'Niños y Coleccionables',
    colorHex: '#FF6B35',
    imagenBanner: null,
    capacidad: 12,
    tiendas: Array(12).fill(null).map((_, i) => ({
      id: `toys-${i}`,
      nombre: null,
      logo: null,
      url: null,
      ocupado: false
    }))
  },
  {
    id: 'tools',
    titulo: 'Herramientas',
    slug: 'tools',
    descripcion: 'Ferretería y Construcción',
    colorHex: '#FF6B35',
    imagenBanner: null,
    capacidad: 12,
    tiendas: Array(12).fill(null).map((_, i) => ({
      id: `tools-${i}`,
      nombre: null,
      logo: null,
      url: null,
      ocupado: false
    }))
  },
  {
    id: 'auto',
    titulo: 'Vehículos',
    slug: 'auto',
    descripcion: 'Autopartes y Accesorios',
    colorHex: '#FF6B35',
    imagenBanner: null,
    capacidad: 12,
    tiendas: Array(12).fill(null).map((_, i) => ({
      id: `auto-${i}`,
      nombre: null,
      logo: null,
      url: null,
      ocupado: false
    }))
  },
  {
    id: 'electro',
    titulo: 'Electrodomésticos',
    slug: 'electro',
    descripcion: 'Línea Blanca y TV',
    colorHex: '#FF6B35',
    imagenBanner: null,
    capacidad: 12,
    tiendas: Array(12).fill(null).map((_, i) => ({
      id: `electro-${i}`,
      nombre: null,
      logo: null,
      url: null,
      ocupado: false
    }))
  },
  {
    id: 'realestate',
    titulo: 'Inmuebles',
    slug: 'realestate',
    descripcion: 'Terrenos y Casas',
    colorHex: '#FF6B35',
    imagenBanner: null,
    capacidad: 12,
    tiendas: Array(12).fill(null).map((_, i) => ({
      id: `realestate-${i}`,
      nombre: null,
      logo: null,
      url: null,
      ocupado: false
    }))
  }
]

export default function FeriaVirtualPage() {
  const [currentDept, setCurrentDept] = useState('LPZ')
  const [showDeptMenu, setShowDeptMenu] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedSector, setSelectedSector] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.pro-dept-wrapper')) {
        setShowDeptMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleDeptChange = (deptCode) => {
    setCurrentDept(deptCode)
    setShowDeptMenu(false)
  }

  const handleSlotClick = (sector, slotIndex) => {
    const tienda = sector.tiendas[slotIndex]
    if (tienda && tienda.ocupado) {
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
                <span>{DEPARTMENTS[currentDept]}</span>
                <ChevronDown className="pro-chevron" />
              </div>
              <div className={`dept-menu ${showDeptMenu ? 'show-menu' : ''}`}>
                {Object.entries(DEPARTMENTS).map(([code, name]) => (
                  <a
                    key={code}
                    href="#"
                    className="dept-item"
                    onClick={(e) => {
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
        {SECTORES.map((sector) => (
          <div key={sector.id} className="sector-block" style={{ '--sector-color': sector.colorHex }}>
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
              {sector.tiendas.map((tienda, index) => (
                <div
                  key={index}
                  className={`store-item ${tienda?.ocupado ? 'real' : 'empty'}`}
                  onClick={() => handleSlotClick(sector, index)}
                  title={tienda?.ocupado ? tienda.nombre : 'Espacio Disponible'}
                >
                  {tienda?.ocupado ? (
                    <div className="store-logo-wrap">
                      {tienda.logo ? (
                        <img src={tienda.logo} alt={tienda.nombre} className="store-img fade-in-fast" />
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
        ))}
      </div>

      {/* Modal para ocupar espacio */}
      {showModal && (
        <div className="feria-modal-overlay active" onClick={closeModal}>
          <div className="feria-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="feria-modal-close" onClick={closeModal}>&times;</button>
            
            <div className="modal-state" style={{ display: 'block' }}>
              <div className="modal-icon-wrap orange">
                <Store />
              </div>
              <h3>¡Ocupa este espacio!</h3>
              <p>El espacio #{selectedSlot + 1} en {selectedSector?.titulo} está disponible.</p>
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
