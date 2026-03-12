'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Mic, User, Box, Heart, Store, LogOut, Home as HomeIcon, UserPlus, LogIn, Menu, X, MapPin, Star } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<{nombre: string; email: string; foto_perfil: null} | null>(null)
  const recognitionRef = useRef(null)
  const userMenuRef = useRef(null)

  // Mock de categorías
  const categories = [
    { id: 1, name: 'Vehículos', icon: '🚗', slug: 'vehiculos' },
    { id: 2, name: 'Inmuebles', icon: '🏠', slug: 'inmuebles' },
    { id: 3, name: 'Electrónica', icon: '📱', slug: 'electronica' },
    { id: 4, name: 'Prendas', icon: '👕', slug: 'prendas' },
    { id: 5, name: 'Servicios', icon: '🔧', slug: 'servicios' },
    { id: 6, name: 'Animales', icon: '🐕', slug: 'animales' },
    { id: 7, name: 'Hogar', icon: '🏡', slug: 'hogar' },
    { id: 8, name: 'Trabajo', icon: '💼', slug: 'trabajo' }
  ]

  // Mock de usuario actual
  const mockUser = {
    nombre: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    foto_perfil: null
  }

  useEffect(() => {
    checkVoiceSupport()
    setCurrentUser(mockUser)
    setIsLoggedIn(true)
    
    // Cerrar menús al hacer clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const checkVoiceSupport = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'es-BO'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      setShowVoiceSearch(true)
    }
  }

  const startVoiceSearch = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
      } else {
        recognitionRef.current.start()
      }
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Lógica de búsqueda
    console.log('Buscando:', searchQuery)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER - REPLICA EXACTA DE D:/FUNCIONAL */}
      <header className="yx-topbar" style={{ 
        background: '#ff6b1a', 
        padding: '0.8rem 0', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
      }}>
        <div className="container-fluid" style={{ padding: '0 1rem' }}>
          <div className="d-flex align-items-center justify-content-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Brand Home */}
            <Link href="/" className="brand-home" style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              textDecoration: 'none' 
            }}>
              <img 
                src="/assets/img/doneback.svg" 
                alt="Done!" 
                className="brand-logo"
                style={{ 
                  height: '32px', 
                  width: 'auto',
                  '@media (min-width: 992px)': { height: '40px' }
                }} 
              />
            </Link>

            {/* Desktop Navigation - ALINEADO PERFECTAMENTE */}
            <div className="d-flex align-items-center gap-3 desktop-nav" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              flex: 1,
              justifyContent: 'flex-end'
            }}>
              {/* Botón Feria Virtual - Rainbow */}
              <Link 
                href="/feria" 
                className="rainbow-btn"
                style={{
                  position: 'relative',
                  background: '#fff !important',
                  color: '#000 !important',
                  fontWeight: '600 !important',
                  fontSize: '15px',
                  borderRadius: '.65rem',
                  padding: '0 1rem',
                  border: 'none',
                  zIndex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box',
                  height: '40px',
                  lineHeight: '1'
                }}
              >
                <span>Feria Virtual</span>
              </Link>

              {/* Botón Publicar anuncio */}
              <Link 
                href="/products/add_product" 
                className="btn-top btn-publish"
                style={{
                  background: '#FFFFFF !important',
                  color: '#000000 !important',
                  border: 'none !important',
                  borderRadius: '8px !important',
                  padding: '0 20px !important',
                  fontSize: '15px !important',
                  fontWeight: '600 !important',
                  transition: 'all 0.2s ease !important',
                  textDecoration: 'none !important',
                  display: 'inline-flex !important',
                  alignItems: 'center !important',
                  gap: '8px !important',
                  whiteSpace: 'nowrap !important',
                  height: '40px !important',
                  boxSizing: 'border-box !important',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08) !important'
                }}
              >
                Publicar anuncio
              </Link>

              {/* Menú de usuario */}
              {isLoggedIn ? (
                <div className="user-menu-dropdown" ref={userMenuRef}>
                  <button 
                    className="user-menu-trigger"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    style={{
                      background: 'white',
                      border: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      padding: '.42rem .95rem',
                      borderRadius: '.65rem',
                      transition: 'background 0.2s',
                      textDecoration: 'none',
                      height: '40px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {currentUser?.foto_perfil ? (
                      <img 
                        src={`/uploads/perfiles/${currentUser.foto_perfil}`}
                        alt="Foto de perfil"
                        style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          objectFit: 'cover' 
                        }}
                      />
                    ) : (
                      <User size={24} style={{ color: '#ff6b1a' }} />
                    )}
                    <span className="user-name" style={{ 
                      color: '#000 !important', 
                      fontWeight: '600', 
                      fontSize: '1rem',
                      display: 'block'
                    }}>
                      {currentUser?.nombre?.split(' ')[0]}
                    </span>
                    <div className="dropdown-arrow" style={{ 
                      color: '#000 !important', 
                      fontSize: '12px',
                      transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}>
                      ▼
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div 
                    className={`user-dropdown-menu ${userMenuOpen ? 'show' : ''}`}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 0.5rem)',
                      right: '0',
                      background: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      minWidth: '280px',
                      opacity: userMenuOpen ? '1' : '0',
                      visibility: userMenuOpen ? 'visible' : 'hidden',
                      transform: userMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
                      transition: 'all 0.3s ease',
                      zIndex: 1000
                    }}
                  >
                    {/* Header del dropdown */}
                    <div style={{
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: 'linear-gradient(135deg, #ff6a00 0%, #ff8533 100%)',
                      borderRadius: '8px 8px 0 0',
                      color: '#fff'
                    }}>
                      {currentUser?.foto_perfil ? (
                        <img 
                          src={`/uploads/perfiles/${currentUser.foto_perfil}`}
                          alt="Foto de perfil"
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #ff6a00'
                          }}
                        />
                      ) : (
                        <User size={40} style={{ color: '#fff' }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontWeight: '600', 
                          fontSize: '1rem', 
                          marginBottom: '0.25rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {currentUser?.nombre}
                        </div>
                        <div style={{ 
                          fontSize: '0.85rem', 
                          opacity: '0.9',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {currentUser?.email}
                        </div>
                      </div>
                    </div>

                    <div style={{ height: '1px', background: '#e0e0e0', margin: '0.5rem 0' }} />

                    {/* Items del menú */}
                    <Link href="/mi/perfil" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.875rem 1.25rem',
                      color: '#333',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      fontSize: '0.95rem'
                    }}>
                      <User size={20} style={{ color: '#666' }} />
                      <span>Mi perfil</span>
                    </Link>

                    <Link href="/mi/publicaciones" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.875rem 1.25rem',
                      color: '#333',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      fontSize: '0.95rem'
                    }}>
                      <Box size={20} style={{ color: '#666' }} />
                      <span>Mis publicaciones</span>
                    </Link>

                    <Link href="/favorites" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.875rem 1.25rem',
                      color: '#333',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      fontSize: '0.95rem'
                    }}>
                      <Heart size={20} style={{ color: '#666' }} />
                      <span>Mis favoritos</span>
                    </Link>

                    <Link href="/mi/business" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.875rem 1.25rem',
                      color: '#333',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      fontSize: '0.95rem'
                    }}>
                      <Store size={20} style={{ color: '#666' }} />
                      <span>Mi tienda</span>
                    </Link>

                    <div style={{ height: '1px', background: '#e0e0e0', margin: '0.5rem 0' }} />

                    <button
                      onClick={async () => {
                        try {
                          console.log('🚨 LOGOUT DEBUG: INICIANDO LOGOUT DESDE app/page.tsx')
                          console.log('🔍 FRONTEND DEBUG: Current URL:', window.location.href)
                          console.log('🔍 FRONTEND DEBUG: Cookies disponibles:', document.cookie)
                          console.log('🔍 FRONTEND DEBUG: Estado actual del usuario:', isLoggedIn ? 'LOGUEADO' : 'NO LOGUEADO')
                          
                          const response = await fetch('/api/auth/logout', { method: 'POST' })
                          console.log('🔍 FRONTEND DEBUG: Response logout:', response.status)
                          
                          if (response.ok) {
                            console.log('🚨 LOGOUT DEBUG: API RESPONDIO OK, LIMPIANDO ESTADO')
                            
                            // Forzar limpieza completa del estado
                            localStorage.clear()
                            sessionStorage.clear()
                            setIsLoggedIn(false)
                            setCurrentUser(null)
                            
                            console.log('🚨 LOGOUT DEBUG: ESTADO LIMPIADO, REDIRIGIENDO A LOGIN')
                            
                            // Forzar recarga completa para limpiar todo el estado
                            window.location.href = '/login'
                          } else {
                            console.error('🚨 LOGOUT DEBUG: ERROR EN API LOGOUT:', response.statusText)
                            router.push('/login')
                          }
                        } catch (error) {
                          console.error('🚨 LOGOUT DEBUG: ERROR GENERAL EN LOGOUT:', error)
                          router.push('/login')
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.875rem 1.25rem',
                        color: '#dc3545',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        fontSize: '0.95rem',
                        borderTop: '1px solid #e0e0e0',
                        marginTop: '0.5rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut size={20} style={{ color: '#dc3545' }} />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link 
                    href="/register" 
                    className="btn-top"
                    style={{
                      background: '#FFFFFF !important',
                      color: '#000000 !important',
                      border: 'none !important',
                      borderRadius: '8px !important',
                      padding: '0 20px !important',
                      fontSize: '15px !important',
                      fontWeight: '600 !important',
                      transition: 'all 0.2s ease !important',
                      textDecoration: 'none !important',
                      display: 'inline-flex !important',
                      alignItems: 'center !important',
                      gap: '8px !important',
                      whiteSpace: 'nowrap !important',
                      height: '40px !important',
                      boxSizing: 'border-box !important',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08) !important'
                    }}
                  >
                    Registrarse
                  </Link>
                  <Link 
                    href="/login" 
                    className="btn-top"
                    style={{
                      background: '#FFFFFF !important',
                      color: '#000000 !important',
                      border: 'none !important',
                      borderRadius: '8px !important',
                      padding: '0 20px !important',
                      fontSize: '15px !important',
                      fontWeight: '600 !important',
                      transition: 'all 0.2s ease !important',
                      textDecoration: 'none !important',
                      display: 'inline-flex !important',
                      alignItems: 'center !important',
                      gap: '8px !important',
                      whiteSpace: 'nowrap !important',
                      height: '40px !important',
                      boxSizing: 'border-box !important',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08) !important'
                    }}
                  >
                    Iniciar Sesión
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - REPLICA EXACTA */}
      <main className="yx-wrap" style={{ padding: '1.5rem 0', minHeight: 'calc(100vh - 200px)' }}>
        {/* Logo Hero */}
        <div className="text-center my-3">
          <img 
            src="/assets/img/done.png" 
            alt="Done!" 
            className="yx-hero-logo"
            style={{ 
              maxWidth: '109px', 
              margin: '0 auto 0.8rem', 
              display: 'block', 
              height: 'auto',
              '@media (min-width: 576px)': { maxWidth: '153px' },
              '@media (min-width: 768px)': { maxWidth: '174px', marginBottom: '0.45rem' },
              '@media (min-width: 992px)': { maxWidth: '230px' }
            }} 
          />
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="yx-search" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          margin: '0 auto 1.5rem', 
          maxWidth: '820px', 
          padding: '0 1rem',
          '@media (min-width: 768px)': { marginBottom: '1.8rem' }
        }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              id="searchInput"
              type="text"
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pill"
              placeholder="Buscar en Done!"
              style={{
                width: '100%',
                border: '2px solid #ff6b1a',
                borderRadius: '9999px',
                padding: '1rem 1.25rem',
                fontSize: '1.05rem',
                outline: 'none',
                paddingRight: '50px'
              }}
            />
            
            {/* Botón de búsqueda por voz */}
            {showVoiceSearch && (
              <button
                type="button"
                onClick={startVoiceSearch}
                className={`voice-search-btn ${isListening ? 'listening' : ''}`}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: isListening ? '#ff6b1a' : '#999',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  zIndex: 10,
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: isListening ? 'rgba(255, 107, 26, 0.1)' : 'transparent'
                }}
                title="Buscar por voz"
              >
                <Mic size={20} />
                <span className="voice-ripple" style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '2px solid #ff6b1a',
                  opacity: isListening ? 0.8 : 0,
                  pointerEvents: 'none',
                  animation: isListening ? 'ripple-effect 1.5s infinite' : 'none'
                }}></span>
              </button>
            )}
          </div>
        </form>

        {/* Categories Grid */}
        <section className="yx-cats" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '22px',
          maxWidth: '950px',
          margin: '0 auto 2rem auto',
          padding: '0 1rem',
          '@media (max-width: 991px)': { gridTemplateColumns: 'repeat(2, 1fr)' }
        }}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/category?id=${category.id}`}
              className={`yx-card yx-card--caption yx-card--bg-gray yx-card--${category.slug}`}
              style={{
                border: '1px solid #ffc19c',
                borderRadius: '10px',
                padding: '28px 18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                background: '#fff',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="cap-thumb" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                height: '60px'
              }}>
                <span>{category.icon}</span>
              </div>
              <div className="cap-label" style={{
                fontWeight: '600',
                textAlign: 'center'
              }}>
                {category.name}
              </div>
            </Link>
          ))}
        </section>
      </main>

      {/* CSS INLINE PARA ESTILOS EXACTOS */}
      <style jsx>{`
        @keyframes ripple-effect {
          0% {
            width: 100%;
            height: 100%;
            opacity: 0.8;
          }
          100% {
            width: 180%;
            height: 180%;
            opacity: 0;
          }
        }

        .rainbow-btn::before {
          content: "";
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          background: linear-gradient(
            90deg,
            #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000
          );
          background-size: 400% 400%;
          z-index: -2;
          border-radius: .75rem;
          animation: rainbow-border 6s ease infinite;
        }

        .rainbow-btn::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #fff; 
          z-index: -1;
          border-radius: .65rem;
        }

        @keyframes rainbow-border {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @media (max-width: 768px) {
          .hamburger-btn {
            display: block !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .user-name {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
