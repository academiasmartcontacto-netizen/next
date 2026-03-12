'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Store, ShoppingBag, ArrowLeft, Plus, Edit, Eye } from 'lucide-react'

export default function MiPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userStore, setUserStore] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    checkUserStore()
  }, [])

  const checkUserStore = async () => {
    try {
      const response = await fetch('/api/stores?user-store=true')
      const data = await response.json()
      
      if (data.store) {
        setUserStore(data.store)
      } else {
        setUserStore(null)
      }
    } catch (error) {
      console.error('Error checking store:', error)
      setError('Error al verificar tu tienda')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStoreClick = () => {
    if (userStore) {
      // Si tiene tienda, ir al business page (tienda existente)
      router.push('/mi/business')
    } else {
      // Si no tiene tienda, ir a crear tienda
      router.push('/mi/crear-tienda')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error
            </h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Store className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Done!</span>
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {userStore ? (
          // ✅ CASO 1: USUARIO TIENE TIENDA
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">¡Tu Tienda Está Lista!</h1>
                  <p className="text-green-100 mt-2">
                    Administra tu tienda virtual y reacha a miles de clientes
                  </p>
                </div>
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Store className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Store Info */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Store Card */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <Store className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{userStore.name}</h2>
                      <p className="text-gray-500 text-sm">Tu tienda virtual</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">URL:</span>
                      <span className="font-mono text-sm text-blue-600">donebolivia.com/tienda/{userStore.link}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        userStore.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {userStore.isPublished ? 'Publicada' : 'Borrador'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Creada:</span>
                      <span className="text-gray-900">
                        {new Date(userStore.createdAt).toLocaleDateString('es-BO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Card */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push('/mi/tienda-editor')}
                      className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Tienda
                    </button>
                    
                    <button
                      onClick={() => window.open(`/tienda/${userStore.link}`, '_blank')}
                      className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Tienda
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Go to Store Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleStoreClick}
                className="inline-flex items-center px-8 py-4 bg-orange-600 text-white text-lg font-bold rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Store className="w-6 h-6 mr-3" />
                Ir a Mi Tienda
              </button>
            </div>
          </div>
        ) : (
          // ❌ CASO 2: USUARIO NO TIENE TIENDA
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-8 py-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Crea tu Tienda Virtual</h1>
                <p className="text-orange-100 mt-2">
                  Tu propia sucursal digital en Done! Vende tus productos y servicios 24/7
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Tu propia sucursal digital
                  </h2>
                  <p className="text-gray-600 text-lg mb-6">
                    Crea tu propia página web dentro de Done! para mostrar tus productos y servicios en un solo lugar. Proyecta una imagen profesional, comparte información clave de tu negocio y genera confianza en tus clientes.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 inline-block">
                    <span className="text-blue-800 font-semibold text-sm">✨ Sin costo por lanzamiento</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <button
                  onClick={handleStoreClick}
                  className="inline-flex items-center px-8 py-4 bg-orange-600 text-white text-lg font-bold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <ShoppingBag className="w-6 h-6 mr-3" />
                  Crear mi Tienda Oficial
                </button>
              </div>

              {/* Features */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Diseño Profesional</h3>
                  <p className="text-gray-600 text-sm">Plantillas modernas y personalizables</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Visibilidad 24/7</h3>
                  <p className="text-gray-600 text-sm">Tu tienda siempre online</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Fácil Administración</h3>
                  <p className="text-gray-600 text-sm">Panel de control intuitivo</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
