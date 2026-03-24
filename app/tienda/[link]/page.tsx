'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import StoreFooter from '@/components/layout/store-footer'
import LogoAdaptive from '@/components/editor/LogoAdaptive'

export default function TiendaPublicPage() {
  const params = useParams()
  const router = useRouter()
  const storeLink = params.link as string
  
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customSections, setCustomSections] = useState<any[]>([])

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        console.log('=== TIENDA PÚBLICA - CARGANDO STORE ===')
        // Obtener datos de la tienda por su link
        const storeResponse = await fetch(`/api/stores/${storeLink}`)
        if (!storeResponse.ok) {
          throw new Error('Tienda no encontrada')
        }
        
        const storeData = await storeResponse.json()
        console.log('Store recibido en tienda pública:', storeData.store)
        console.log('mostrarAcercaDe en tienda pública:', storeData.store?.mostrarAcercaDe)
        console.log('store.mostrarAcercaDe !== false:', storeData.store?.mostrarAcercaDe !== false)
        
        setStore(storeData.store)
        
        // Cargar secciones personalizadas
        if (storeData.store?.id) {
          const sectionsResponse = await fetch(`/api/store-navigation-sections?storeId=${storeData.store.id}`)
          if (sectionsResponse.ok) {
            const sectionsData = await sectionsResponse.json()
            const sections = sectionsData.sections || []
            setCustomSections(sections.filter((section: any) => section.isVisible))
          }
        }
        
      } catch (err: any) {
        setError(err.message || 'Error al cargar la tienda')
      } finally {
        setLoading(false)
      }
    }

    if (storeLink) {
      fetchStoreData()
    }
  }, [storeLink])

  const [navbarColor, setNavbarColor] = useState(store?.navbarColor || store?.colorPrimario || '#1a73e8');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [currentLogo, setCurrentLogo] = useState(store?.logo || null);
  const [activeSection, setActiveSection] = useState('productos');

  // Toggle Sections (SPA Feel) - Replicando lógica de D:/FUNCIONAL
  const showSection = (sectionId: string, menuElement: HTMLElement | null) => {
    // Esta función ahora maneja todas las secciones incluyendo personalizadas
    setActiveSection(sectionId);
    
    // Ocultar todas las secciones primero
    const allSections = document.querySelectorAll('.products-section');
    allSections.forEach(section => {
      section.style.display = 'none';
    });

    // Mostrar la sección solicitada solo si está permitida
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      // Verificar si la sección debe mostrarse según la visibilidad
      let shouldShow = true;
      
      if (sectionId === 'acerca' && store.mostrarAcercaDe === false) {
        shouldShow = false;
      } else if (sectionId === 'contacto' && store.mostrarContacto === false) {
        shouldShow = false;
      } else if (sectionId === 'inicio' && store.mostrarInicio === false) {
        shouldShow = false;
      }
      
      if (shouldShow) {
        targetSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (store) {
      setNavbarColor(store.navbarColor || store.colorPrimario || '#1a73e8');
      setCurrentLogo(store.logo || null);
    }
  }, [store]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'UPDATE_NAVBAR_COLOR') {
        setNavbarColor(event.data.color);
      } else if (event.data.type === 'UPDATE_DEVICE_MODE') {
        setDeviceMode(event.data.mode);
      } else if (event.data.type === 'UPDATE_LOGO') {
        setCurrentLogo(event.data.logo);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (loading && !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tienda...</p>
        </div>
      </div>
    )
  }

  if (error || (!loading && !store)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Tienda no encontrada</h2>
          <p className="text-gray-600 mb-6">
            {error || 'La tienda que buscas no existe o ha sido eliminada.'}
          </p>
          <Link 
            href="/" 
            className="block w-full bg-orange-600 text-white text-center py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${deviceMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''}`}>
      {/* Navbar de la tienda */}
      <header 
        className={`sticky top-0 z-50 border-b store-navbar`}
        style={{
          backgroundColor: navbarColor,
          borderColor: 'rgba(0,0,0,0.1)',
          height: '64px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container mx-auto px-4" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              {currentLogo && (
                <LogoAdaptive
                  logoUrl={currentLogo}
                  storeName={store.nombre}
                />
              )}
              {store.mostrarNombre && (
                <h1 className="text-xl font-bold text-white">
                  {store.nombre}
                </h1>
              )}
            </div>
            
            <nav className={`${deviceMode === 'mobile' ? 'flex' : 'hidden md:flex'} items-center space-x-6`}>
              {store.mostrarInicio !== false && (
                <a 
                  href="#productos" 
                  className={`${deviceMode === 'mobile' ? 'text-sm px-2' : ''} text-white hover:text-gray-200 transition-colors ${activeSection === 'productos' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); showSection('productos', e.currentTarget); }}
                >
                  Inicio
                </a>
              )}
              {store.mostrarContacto !== false && (
                <a 
                  href="#contacto" 
                  className={`${deviceMode === 'mobile' ? 'text-sm px-2' : ''} text-white hover:text-gray-200 transition-colors ${activeSection === 'contacto' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); showSection('contacto', e.currentTarget); }}
                >
                  Contacto
                </a>
              )}
              {store.mostrarAcercaDe !== false && (
                <a 
                  href="#acerca" 
                  className={`${deviceMode === 'mobile' ? 'text-sm px-2' : ''} text-white hover:text-gray-200 transition-colors ${activeSection === 'acerca' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); showSection('acerca', e.currentTarget); }}
                >
                  Acerca de Nosotros
                </a>
              )}
              
              {/* Secciones personalizadas */}
              {customSections.map((section: any) => (
                <a 
                  key={section.id}
                  href={`#${section.slug}`}
                  className={`${deviceMode === 'mobile' ? 'text-sm px-2' : ''} text-white hover:text-gray-200 transition-colors ${activeSection === section.slug ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); showSection(section.slug, e.currentTarget); }}
                >
                  {section.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido de la tienda */}
      <main className="flex-1">
        {/* Sección Productos */}
        <section id="productos" className="products-section" style={{display: 'block'}}>
          <div className="flex-1 flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {store.nombre}
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Bienvenido a nuestra tienda. Estamos trabajando para traerte los mejores productos muy pronto.
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN ACERCA DE NOSOTROS (Rediseño PRO) */}
        {store.mostrarAcercaDe !== false && (
          <section id="acerca" className="products-section">
          <div className="about-pro-container max-w-6xl mx-auto px-4 py-16">
            <div className="about-header text-center mb-12">
              <h2 className="contact-title text-3xl font-bold text-gray-900 mb-4">Acerca de Nosotros</h2>
            </div>
            
            <div className="about-grid grid lg:grid-cols-1 gap-8">
              {/* Columna Texto (Centrada y única) */}
              <div className="about-text-column">
                <div className="about-description-text text-gray-700 leading-relaxed text-lg">
                  {store.descripcion || "Bienvenido a nuestra tienda. Somos un equipo apasionado por ofrecer productos de calidad que superen las expectativas de nuestros clientes. Trabajamos cada día con el compromiso de brindar soluciones confiables y accesibles; nuestra prioridad es que cada persona que confía en nosotros reciba excelencia en cada detalle."}
                </div>
              </div>
            </div>
            
            {/* Fila de Valores (Value Props) */}
            <div className="about-values-row grid md:grid-cols-3 gap-8 mt-12">
              <div className="value-item text-center">
                <div className="value-icon w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-shield-alt text-orange-600 text-xl"></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Calidad Garantizada</h4>
                <p className="text-gray-600">Ofrecemos productos que cumplen con los más altos estándares de calidad.</p>
              </div>
              <div className="value-item text-center">
                <div className="value-icon w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lock text-orange-600 text-xl"></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Compra Segura</h4>
                <p className="text-gray-600">Tu confianza es lo más importante para nosotros.</p>
              </div>
              <div className="value-item text-center">
                <div className="value-icon w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-shipping-fast text-orange-600 text-xl"></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Entrega Eficiente</h4>
                <p className="text-gray-600">Nos esforzamos por procesar tus pedidos con la mayor rapidez.</p>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* SECCIÓN CONTACTO CORPORATE (Estilo The7 Company) */}
        {store.mostrarContacto !== false && (
          <section id="contacto" className="products-section" style={{display: 'block'}}>
          <div className="contact-corporate-container max-w-6xl mx-auto px-4 py-16">
            <div className="contact-corporate-header text-center mb-12">
              <h2 className="contact-title text-3xl font-bold text-gray-900 mb-4">Contáctanos</h2>
              <p className="contact-subtitle text-gray-600 text-lg">Estamos aquí para ayudarte. Ponte en contacto con nosotros por cualquiera de estos medios.</p>
            </div>
            
            <div className="contact-info-cards grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Llámanos (WhatsApp) */}
              {store.whatsapp && (
                <div className="info-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="info-icon-wrapper w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-phone-alt text-green-600"></i>
                  </div>
                  <h3 className="info-title text-lg font-semibold text-gray-900 mb-2">Llámanos</h3>
                  <p className="info-text text-gray-600 text-sm mb-3">Estamos disponibles para atenderte.</p>
                  <a 
                    href={`https://wa.me/591${store.whatsapp}`} 
                    target="_blank" 
                    className="info-link big-black-link text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {store.whatsapp}
                  </a>
                </div>
              )}
              
              {/* Card 2: Correo */}
              {store.email_contacto && (
                <div className="info-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="info-icon-wrapper w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-envelope text-blue-600"></i>
                  </div>
                  <h3 className="info-title text-lg font-semibold text-gray-900 mb-2">Correo</h3>
                  <p className="info-text text-gray-600 text-sm mb-3">Escríbenos para consultas detalladas.</p>
                  <a 
                    href={`mailto:${store.email_contacto}`} 
                    className="info-link big-black-link text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {store.email_contacto}
                  </a>
                </div>
              )}
              
              {/* Card 3: Ubicación */}
              {(store.direccion || store.google_maps_url) && (
                <div className="info-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="info-icon-wrapper w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-map-marker-alt text-red-600"></i>
                  </div>
                  <h3 className="info-title text-lg font-semibold text-gray-900 mb-2">Ubicación</h3>
                  <p className="info-text text-gray-600 text-sm mb-3">
                    {store.direccion || 'Dirección disponible en mapa'}
                  </p>
                  {store.google_maps_url && (
                    <a 
                      href={store.google_maps_url} 
                      target="_blank" 
                      className="info-link big-black-link text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Ver en Google Maps
                    </a>
                  )}
                </div>
              )}
              
              {/* Card 4: Redes Sociales */}
              {(store.facebook_url || store.instagram_url || store.tiktok_url || store.telegram_user || store.youtube_url) && (
                <div className="info-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="info-icon-wrapper w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-share-alt text-purple-600"></i>
                  </div>
                  <h3 className="info-title text-lg font-semibold text-gray-900 mb-2">Síguenos</h3>
                  <p className="info-text text-gray-600 text-sm mb-3">Nuestras redes sociales.</p>
                  
                  <div className="social-links-row flex justify-center space-x-2">
                    {store.facebook_url && (
                      <a 
                        href={store.facebook_url} 
                        target="_blank" 
                        className="social-icon-btn facebook w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors" 
                        title="Facebook"
                      >
                        <i className="fab fa-facebook-f text-xs"></i>
                      </a>
                    )}
                    {store.instagram_url && (
                      <a 
                        href={store.instagram_url} 
                        target="_blank" 
                        className="social-icon-btn instagram w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors" 
                        title="Instagram"
                      >
                        <i className="fab fa-instagram text-xs"></i>
                      </a>
                    )}
                    {store.tiktok_url && (
                      <a 
                        href={store.tiktok_url} 
                        target="_blank" 
                        className="social-icon-btn tiktok w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors" 
                        title="TikTok"
                      >
                        <i className="fab fa-tiktok text-xs"></i>
                      </a>
                    )}
                    {store.telegram_user && (
                      <a 
                        href={`https://t.me/${store.telegram_user}`} 
                        target="_blank" 
                        className="social-icon-btn telegram w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors" 
                        title="Telegram"
                      >
                        <i className="fab fa-telegram-plane text-xs"></i>
                      </a>
                    )}
                    {store.youtube_url && (
                      <a 
                        href={store.youtube_url} 
                        target="_blank" 
                        className="social-icon-btn youtube w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors" 
                        title="YouTube"
                      >
                        <i className="fab fa-youtube text-xs"></i>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* Secciones personalizadas */}
        {customSections.map((section: any) => (
          <section key={section.id} id={section.slug} className="products-section" style={{display: 'none'}}>
            <div className="max-w-6xl mx-auto px-4 py-16">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">{section.name}</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <p className="text-gray-600 text-lg">
                    Esta es una sección personalizada: <strong>{section.name}</strong>
                  </p>
                  <p className="text-gray-500 mt-4">
                    El contenido de esta sección se puede personalizar desde el editor de tiendas.
                  </p>
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-700 text-sm">
                      Slug: {section.slug} | ID: {section.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Footer de D:/FUNCIONAL */}
      <StoreFooter />
    </div>
  )
}
