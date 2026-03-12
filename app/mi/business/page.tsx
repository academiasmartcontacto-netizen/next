'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Store, ArrowLeft, Edit, Eye, ExternalLink, Settings, BarChart3, Users, Package } from 'lucide-react'

export default function BusinessPage() {
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
      
      if (!data.store) {
        // Si no tiene tienda, redirigir a crear
        router.push('/mi/crear-tienda')
        return
      }
      
      setUserStore(data.store)
    } catch (error) {
      console.error('Error checking store:', error)
      setError('Error al cargar tu tienda')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditStore = () => {
    router.push('/mi/tienda-editor')
  }

  const handleViewStore = () => {
    window.open(`/tienda/${userStore?.link}`, '_blank')
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

  if (!userStore) {
    return null // No renderizar nada, redirigirá automáticamente
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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {userStore.name}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Tu propia sucursal digital en Done!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleEditStore}
                className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Edit className="w-5 h-5 mr-2" />
                Editar Tienda
              </button>
              <button
                onClick={handleViewStore}
                className="flex items-center px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
              >
                <Eye className="w-5 h-5 mr-2" />
                Ver Tienda
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Store Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <ExternalLink className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">URL de tu Tienda</h3>
                <p className="text-sm text-gray-500">Dirección web única</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600 font-mono">
              donebolivia.com/tienda/{userStore.link}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Estado</h3>
                <p className="text-sm text-gray-500">Visibilidad actual</p>
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              userStore.isPublished 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {userStore.isPublished ? '🟢 Publicada' : '🟡 Borrador'}
            </span>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Productos</h3>
                <p className="text-sm text-gray-500">Artículos en venta</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              0
            </p>
            <p className="text-sm text-gray-500">
              <Link href="/mi/tienda-editor" className="text-blue-600 hover:underline">
                Agrega tus primeros productos →
              </Link>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Creada</h3>
                <p className="text-sm text-gray-500">Fecha de creación</p>
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(userStore.createdAt).toLocaleDateString('es-BO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Panel de Control Rápido
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={handleEditStore}
              className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-5 h-5 mr-3" />
              Editor de Tienda
            </button>
            
            <button
              onClick={handleViewStore}
              className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <Eye className="w-5 h-5 mr-3" />
              Ver Tienda Pública
            </button>
            
            <button
              onClick={() => router.push('/mi/publications')}
              className="flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              <Package className="w-5 h-5 mr-3" />
              Mis Publicaciones
            </button>
            
            <button
              onClick={() => router.push('/mi/favorites')}
              className="flex items-center justify-center px-6 py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              <Users className="w-5 h-5 mr-3" />
              Mis Favoritos
            </button>
          </div>
        </div>

        {/* Store Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Vista Previa de tu Tienda</h3>
          </div>
          <div className="p-6">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center">
                <Store className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium mb-4">
                  Vista previa de tu tienda
                </p>
                <button
                  onClick={handleViewStore}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Tienda Completa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
