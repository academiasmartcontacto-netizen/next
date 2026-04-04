'use client'

import { useState, useEffect } from 'react'
import { X, Heart, Share2, ChevronLeft, ChevronRight, MapPin, Clock, Eye, User, Star, Shield, MessageCircle } from 'lucide-react'
import Image from 'next/image'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: any
  store: any
}

export default function ProductModal({ isOpen, onClose, product, store }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Resetear índice cuando cambia el producto
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0)
      setIsLoading(false)
    }
  }, [product])

  if (!isOpen || !product) return null

  // Obtener todas las imágenes del producto
  const allImages = product.allImages || []
  // Manejar diferentes estructuras de datos de imágenes
  const currentImage = (() => {
    if (allImages.length > 0) {
      const img = allImages[currentImageIndex]
      return img?.url || img
    }
    return product.image
  })()

  // Debug: Ver qué datos están llegando
  console.log('=== DEBUG PRODUCT MODAL ===')
  console.log('Product:', product)
  console.log('All Images:', allImages)
  console.log('Current Image Index:', currentImageIndex)
  console.log('Current Image:', currentImage)

  // Navegación de imágenes
  const nextImage = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
    }
  }

  const prevImage = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    }
  }

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(price)
  }

  // Manejar favoritos
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // TODO: Implementar llamada a API
  }

  // Compartir producto
  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `${product.name} - ${formatPrice(product.price)}`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error compartiendo:', error)
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('¡Enlace copiado!')
    }
  }

  // Contactar por WhatsApp
  const contactWhatsApp = () => {
    const message = `Hola, vi tu producto "${product.name}" en tu tienda de ${store.name}: ${window.location.href}`
    const whatsappUrl = `https://wa.me/${store.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                <p className="text-sm text-gray-500">Publicado por {store.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={shareProduct}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Compartir"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite ? 'bg-red-50 text-red-500' : 'hover:bg-gray-100'
                }`}
                title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)] overflow-y-auto">
            
            {/* Galería de imágenes */}
            <div className="lg:w-1/2 bg-gray-50">
              <div className="relative aspect-square lg:aspect-auto lg:h-full">
                {currentImage ? (
                  <>
                    <Image
                      src={currentImage}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      onError={(e) => {
                        console.error('Error cargando imagen:', currentImage)
                        // Intentar con la imagen principal si falla la actual
                        if (currentImage !== product.image) {
                          e.currentTarget.src = product.image
                        }
                      }}
                    />
                    
                    {/* Navegación de imágenes */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {allImages.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Image 
                          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E"
                          alt="Sin imagen"
                          width={48}
                          height={48}
                          className="opacity-50"
                        />
                      </div>
                      <p className="text-gray-500">Sin imagen disponible</p>
                    </div>
                  </div>
                )}

                {/* Miniaturas */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2">
                    {allImages.map((img: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-orange-500 scale-110' 
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={img.url || img}
                          alt={`Miniatura ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                          onError={(e) => {
                            console.error('Error cargando miniatura:', img.url || img)
                            // Ocultar miniatura si falla
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Información del producto */}
            <div className="lg:w-1/2 p-6 space-y-6">
              
              {/* Precio */}
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-orange-500">
                    {formatPrice(product.price)}
                  </span>
                  {product.onSale && product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {product.onSale && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <Shield className="w-4 h-4 mr-1" />
                      Oferta especial
                    </span>
                  </div>
                )}
              </div>

              {/* Metadatos */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Bolivia</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Publicado recientemente</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{product.visits || 0} vistas</span>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {product.description || 'Sin descripción disponible'}
                </div>
              </div>

              {/* Vendedor */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendedor</h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{store.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>5.0</span>
                      <span>•</span>
                      <span>Miembro desde 2024</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <button
                  onClick={contactWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contactar por WhatsApp
                </button>
                
                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors">
                  <Heart className="w-5 h-5" />
                  Agregar a favoritos
                </button>
              </div>

              {/* Consejos de seguridad */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-500" />
                  Consejos de seguridad
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Reúnete en lugares públicos y seguros</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Inspecciona el producto antes de pagar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>No hagas pagos por adelantado</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
