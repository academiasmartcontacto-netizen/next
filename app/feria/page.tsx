'use client'

import { useState, useEffect } from 'react'
import { MapPin, Search, Mic, Store, ChevronDown, ExternalLink, UserPlus, Plus } from 'lucide-react'
import { mockFeriaSectors, mockFeriaStands, mockDepartments } from '@/lib/mock/data'
import Link from 'next/link'

export default function FeriaPage() {
  const [currentDept, setCurrentDept] = useState('LPZ')
  const [showDeptMenu, setShowDeptMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalState, setModalState] = useState<'guest' | 'user' | 'owner'>('guest')
  const [selectedSector, setSelectedSector] = useState('')
  const [selectedPosition, setSelectedPosition] = useState(0)

  useEffect(() => {
    checkVoiceSupport()
    // Load saved department from cookie (simulated)
    const savedDept = localStorage.getItem('done_dept') || 'LPZ'
    setCurrentDept(savedDept)
  }, [])

  const checkVoiceSupport = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setShowVoiceSearch(true)
    }
  }

  const currentDeptName = mockDepartments.find(d => d.code === currentDept)?.name || 'La Paz'

  const startVoiceSearch = () => {
    if (!showVoiceSearch) return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'es-BO'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setSearchQuery(transcript)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleDeptChange = (deptCode: string) => {
    setCurrentDept(deptCode)
    localStorage.setItem('done_dept', deptCode)
    setShowDeptMenu(false)
  }

  const handleEmptySlotClick = (sectorSlug: string, position: number) => {
    setSelectedSector(sectorSlug)
    setSelectedPosition(position)
    setModalState('guest') // Simulate guest user
    setShowModal(true)
  }

  const getSectorStores = (sectorSlug: string) => {
    return mockFeriaStands.filter(stand => stand.sector === sectorSlug)
  }

  const getStoreAtPosition = (sectorSlug: string, position: number) => {
    const stores = getSectorStores(sectorSlug)
    return stores.find(store => store.position === position)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .feria-layout {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .feria-pro-card-container {
          margin-bottom: 40px;
        }
        
        .feria-pro-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .pro-card-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 10px;
          text-align: center;
        }
        
        .pro-card-desc {
          font-size: 1.1rem;
          color: #666;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .pro-unified-bar {
          display: flex;
          align-items: center;
          gap: 20px;
          background: #f8f9fa;
          padding: 15px 20px;
          border-radius: 15px;
          border: 1px solid #e9ecef;
        }
        
        .pro-dept-wrapper {
          position: relative;
        }
        
        .pro-dept-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          padding: 10px 15px;
          border-radius: 10px;
          border: 1px solid #ddd;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .pro-dept-trigger:hover {
          border-color: #007AFF;
          box-shadow: 0 2px 8px rgba(0,122,255,0.2);
        }
        
        .pro-dept-icon {
          color: #007AFF;
          font-size: 16px;
        }
        
        .pro-chevron {
          color: #666;
          font-size: 12px;
          transition: transform 0.3s ease;
        }
        
        .dept-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 1px solid #e9ecef;
          z-index: 1000;
          min-width: 200px;
          margin-top: 5px;
        }
        
        .dept-item {
          display: block;
          padding: 12px 15px;
          color: #333;
          text-decoration: none;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.2s ease;
        }
        
        .dept-item:hover {
          background: #f8f9fa;
          color: #007AFF;
        }
        
        .dept-item:last-child {
          border-bottom: none;
        }
        
        .pro-divider {
          width: 1px;
          height: 30px;
          background: #ddd;
        }
        
        .pro-search-wrapper {
          flex: 1;
          position: relative;
        }
        
        .pro-search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          font-size: 16px;
        }
        
        .pro-search-input {
          width: 100%;
          padding: 10px 15px 10px 45px;
          border: 1px solid #ddd;
          border-radius: 10px;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        
        .pro-search-input:focus {
          outline: none;
          border-color: #007AFF;
          box-shadow: 0 2px 8px rgba(0,122,255,0.2);
        }
        
        .voice-search-btn {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #666;
          font-size: 16px;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .voice-search-btn:hover {
          color: #007AFF;
          background: rgba(0,122,255,0.1);
        }
        
        .voice-search-btn.listening {
          color: #007AFF;
          background: rgba(0,122,255,0.1);
        }
        
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
        }
        
        .sector-block {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .sector-block:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.12);
        }
        
        .sector-header-split {
          display: flex;
          height: 120px;
        }
        
        .split-text-col {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .sector-title-pro {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 5px;
        }
        
        .sector-desc-pro {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.4;
        }
        
        .split-image-col {
          width: 150px;
          position: relative;
        }
        
        .image-box {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .image-placeholder {
          width: 100%;
          height: 100%;
        }
        
        .view-all-pill {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 20px;
          padding: 6px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #333;
          font-size: 12px;
          transition: all 0.3s ease;
        }
        
        .view-all-pill:hover {
          background: white;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .stores-inner-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          background: #f5f5f5;
          padding: 2px;
        }
        
        .store-item {
          aspect-ratio: 1;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .store-item.real {
          cursor: pointer;
        }
        
        .store-item.real:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10;
        }
        
        .store-item.empty {
          cursor: default;
          background: #fafafa;
          border: 2px dashed #ddd;
        }
        
        .store-item.empty:hover {
          background: #f0f8ff;
          border-color: #007AFF;
        }
        
        .store-logo-wrap {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }
        
        .store-logo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 4px;
        }
        
        .empty-text {
          font-size: 10px;
          font-weight: 600;
          color: #999;
          text-align: center;
        }
        
        .feria-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        
        .feria-modal-content {
          background: white;
          border-radius: 20px;
          padding: 30px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          position: relative;
        }
        
        .feria-modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        
        .modal-icon-wrap {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 24px;
        }
        
        .modal-icon-wrap {
          background: #f0f8ff;
          color: #007AFF;
        }
        
        .modal-icon-wrap.orange {
          background: #fff5f0;
          color: #ff6b1a;
        }
        
        .modal-icon-wrap.green {
          background: #f0fff4;
          color: #34c759;
        }
        
        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 25px;
        }
        
        .btn-modal {
          flex: 1;
          padding: 12px 20px;
          border-radius: 10px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .btn-modal.primary {
          background: #007AFF;
          color: white;
        }
        
        .btn-modal.primary:hover {
          background: #0056b3;
          transform: translateY(-1px);
        }
        
        .btn-modal.secondary {
          background: #f8f9fa;
          color: #666;
          border: 1px solid #ddd;
        }
        
        .btn-modal.secondary:hover {
          background: #e9ecef;
        }
      `}</style>

      <div className="feria-layout">
        {/* Tarjeta Central PRO */}
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
                  <span>{currentDeptName}</span>
                  <ChevronDown 
                    className="pro-chevron"
                    style={{ transform: showDeptMenu ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </div>
                {showDeptMenu && (
                  <div className="dept-menu">
                    {mockDepartments.map(dept => (
                      <a
                        key={dept.code}
                        href="#"
                        className="dept-item"
                        onClick={(e) => {
                          e.preventDefault()
                          handleDeptChange(dept.code)
                        }}
                      >
                        {dept.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="pro-divider"></div>
              <form className="pro-search-wrapper" style={{ position: 'relative' }}>
                <Search className="pro-search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar tienda..."
                  className="pro-search-input"
                />
                {showVoiceSearch && (
                  <button
                    type="button"
                    onClick={startVoiceSearch}
                    className={`voice-search-btn ${isListening ? 'listening' : ''}`}
                    title="Buscar por voz"
                  >
                    <Mic />
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="bento-grid">
          {mockFeriaSectors.map((sector) => (
            <div 
              key={sector.slug} 
              className="sector-block"
              style={{ '--sector-color': sector.color } as any}
            >
              <div className="sector-header-split">
                <div className="split-text-col">
                  <h2 className="sector-title-pro">{sector.title}</h2>
                  <p className="sector-desc-pro">{sector.desc}</p>
                </div>
                <div className="split-image-col">
                  <div className="image-box">
                    <img 
                      src={sector.image} 
                      alt={sector.title}
                      loading="lazy"
                      width="300" 
                      height="300"
                    />
                    <Link 
                      href={`/sector/${sector.slug}?dept=${currentDept}`}
                      className="view-all-pill" 
                      title="Ver todo"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="stores-inner-grid">
                {Array.from({ length: sector.capacity }, (_, i) => {
                  const store = getStoreAtPosition(sector.slug, i + 1)
                  return (
                    <div key={i} className="store-item">
                      {store ? (
                        <Link href={store.tienda.url} className="store-item real" title={store.tienda.nombre}>
                          <div className="store-logo-wrap">
                            <img 
                              src={store.tienda.logo} 
                              alt={store.tienda.nombre}
                              loading="lazy"
                              width="50" 
                              height="50"
                            />
                          </div>
                        </Link>
                      ) : (
                        <div 
                          className="store-item empty" 
                          title="Espacio Disponible"
                          onClick={() => handleEmptySlotClick(sector.slug, i + 1)}
                        >
                          <span className="empty-text">LIBRE</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="feria-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="feria-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="feria-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            
            {modalState === 'guest' && (
              <div id="modal-guest">
                <div className="modal-icon-wrap">
                  <UserPlus />
                </div>
                <h3>Únete a la Feria Virtual</h3>
                <p>Para ocupar este puesto y mostrar tu marca aquí, primero necesitas crear una cuenta.</p>
                <div className="modal-actions">
                  <Link href="/register" className="btn-modal primary">Crear Cuenta</Link>
                  <Link href="/login" className="btn-modal secondary">Ya tengo cuenta</Link>
                </div>
              </div>
            )}
            
            {modalState === 'user' && (
              <div id="modal-user">
                <div className="modal-icon-wrap orange">
                  <Store />
                </div>
                <h3>¡Casi listo!</h3>
                <p>Ya tienes cuenta, pero necesitas <strong>Crear tu Tienda Virtual</strong>.</p>
                <div className="modal-actions">
                  <Link href="/mi/crear-tienda" className="btn-modal primary">Crear Tienda Ahora</Link>
                  <button onClick={() => setShowModal(false)} className="btn-modal secondary">Cancelar</button>
                </div>
              </div>
            )}
            
            {modalState === 'owner' && (
              <div id="modal-owner">
                <div className="modal-icon-wrap green">
                  <MapPin />
                </div>
                <h3>Ocupar este puesto</h3>
                <p>¿Quieres asignar tu tienda <strong>Mi Tienda</strong> a este lugar en {mockFeriaSectors.find(s => s.slug === selectedSector)?.title}?</p>
                <form>
                  <div className="modal-actions">
                    <button type="submit" className="btn-modal primary">✅ Confirmar y Ocupar</button>
                    <button type="button" onClick={() => setShowModal(false)} className="btn-modal secondary">Cancelar</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
