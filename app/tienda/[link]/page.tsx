'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import StoreFooter from '@/components/layout/store-footer'

export default function TiendaPublicPage() {
  const params = useParams()
  const router = useRouter()
  const storeLink = params.link as string
  
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // Obtener datos de la tienda por su link
        const storeResponse = await fetch(`/api/stores/${storeLink}`)
        if (!storeResponse.ok) {
          throw new Error('Tienda no encontrada')
        }
        
        const storeData = await storeResponse.json()
        setStore(storeData.store)
        
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

  useEffect(() => {
    if (store) {
      setNavbarColor(store.navbarColor || store.colorPrimario || '#1a73e8');
    }
  }, [store]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'UPDATE_NAVBAR_COLOR') {
        setNavbarColor(event.data.color);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar de la tienda */}
      <header 
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: navbarColor,
          borderColor: 'rgba(0,0,0,0.1)'
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {store.mostrarLogo && store.logo && (
                <img 
                  src={store.logo} 
                  alt={store.nombre}
                  className="h-10 w-auto rounded"
                />
              )}
              {store.mostrarNombre && (
                <h1 className="text-xl font-bold text-white">
                  {store.nombre}
                </h1>
              )}
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#inicio" className="text-white hover:text-gray-200 transition-colors">
                Inicio
              </a>
              <a href="#productos" className="text-white hover:text-gray-200 transition-colors">
                Productos
              </a>
              <a href="#contacto" className="text-white hover:text-gray-200 transition-colors">
                Contacto
              </a>
              <a href="#acerca" className="text-white hover:text-gray-200 transition-colors">
                Acerca de
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido vacío */}
      <div className="flex-1 flex items-center justify-center">
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

      {/* Footer de D:/FUNCIONAL */}
      <StoreFooter />
    </div>
  )
}
