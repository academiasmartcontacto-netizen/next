'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ShoppingBag, MapPin, Phone, Mail, Facebook, Instagram, 
  Youtube, ExternalLink, Heart, Share2, MessageCircle,
  Package, Clock, Star, ChevronLeft, Image, Store
} from 'lucide-react'
import Link from 'next/link'

export default function TiendaPublicPage() {
  const params = useParams()
  const router = useRouter()
  const storeLink = params.link as string
  
  const [store, setStore] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
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
        
        // Obtener productos de la tienda
        const productsResponse = await fetch(`/api/stores/${storeLink}/products`)
        const productsData = await productsResponse.json()
        
        setStore(storeData.store)
        setProducts(productsData.products || [])
        
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

  // Valores por defecto para tienda vacía (como el PHP)
  const storeDescription = store.description || "Bienvenido a nuestra tienda. Somos un equipo apasionado por ofrecer productos de calidad que superen las expectativas de nuestros clientes. Trabajamos cada día con el compromiso de brindar soluciones confiables y accesibles; nuestra prioridad es que cada persona que confía en nosotros reciba excelencia en cada detalle."

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la tienda */}
      <header 
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: store.colorPrimario || '#1a73e8',
          borderColor: 'rgba(0,0,0,0.1)'
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {store.logo ? (
                <img 
                  src={store.logo} 
                  alt={store.name}
                  className="h-10 w-auto object-contain"
                  style={{ maxHeight: '40px' }}
                />
              ) : (
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h1 
                  className="text-xl font-bold"
                  style={{ color: '#ffffff' }}
                >
                  {store.name}
                </h1>
                {store.slogan && (
                  <p 
                    className="text-sm opacity-90"
                    style={{ color: '#ffffff' }}
                  >
                    {store.slogan}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigator.share?.({ 
                  title: store.name,
                  url: window.location.href 
                })}
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                style={{ color: '#ffffff' }}
                title="Compartir tienda"
              >
                <Share2 size={20} />
              </button>
              <Link 
                href="/"
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                style={{ color: '#ffffff' }}
                title="Volver a Done!"
              >
                <ChevronLeft size={20} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Banner placeholder si no hay imagen */}
      <div className="relative h-64 md:h-96">
        {store.bannerImage ? (
          <img 
            src={store.bannerImage} 
            alt="Banner de la tienda"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
            <Image className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center px-4">El banner principal de tu tienda se mostrará aquí.</p>
            <p className="text-gray-500 text-sm text-center px-4 mt-2">Sube una imagen desde el editor para activarlo.</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {storeDescription}
          </h2>
        </div>
      </div>

      {/* Información de contacto */}
      {store.phone && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Información de contacto</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium">{store.phone}</p>
                </div>
              </div>
              {store.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{store.email}</p>
                  </div>
                </div>
              )}
              {store.address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-medium">{store.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Redes sociales */}
      {store.socialMedia && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Síguenos en redes sociales</h3>
            <div className="flex space-x-4">
              {store.socialMedia.facebook && (
                <a 
                  href={store.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Facebook size={20} />
                </a>
              )}
              {store.socialMedia.instagram && (
                <a 
                  href={store.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <Instagram size={20} />
                </a>
              )}
              {store.socialMedia.youtube && (
                <a 
                  href={store.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Productos - ESTADO VACÍO COMO PHP */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Nuestros productos</h2>
        
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay productos publicados aún.
            </h3>
            <p className="text-gray-600">
              Pronto agregaremos productos a nuestra tienda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {product.image && (
                  <div className="aspect-square relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.onSale && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        OFERTA
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-orange-600">
                            ${product.price}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-orange-600">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    
                    {product.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">
                          {product.rating}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        // Lógica para contactar con el vendedor
                        window.open(`https://wa.me/591${store.phone?.replace(/\D/g, '')}?text=Hola! Estoy interesado en: ${product.name}`, '_blank')
                      }}
                      className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contactar
                    </button>
                    
                    <button
                      onClick={() => {
                        // Lógica para agregar a favoritos
                        console.log('Agregar a favoritos:', product.id)
                      }}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">{store.name}</h3>
            <p className="text-gray-400 mb-4">
              Gracias por visitar nuestra tienda
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-400">
              <span>© {new Date().getFullYear()} {store.name}</span>
              <span>•</span>
              <span>Hecho con ❤️ en Done!</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
