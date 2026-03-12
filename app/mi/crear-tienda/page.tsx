'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Store, ArrowLeft, Check } from 'lucide-react'

export default function CrearTiendaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [existingStore, setExistingStore] = useState<any>(null)
  
  // Contexto de feria desde URL
  const feriaContext = {
    sector: searchParams.get('sector') || '',
    city: searchParams.get('city') || '',
    position: searchParams.get('pos') || ''
  }
  
  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    whatsapp: ''
  })

  // Verificar si ya tiene tienda
  useEffect(() => {
    checkExistingStore()
  }, [])

  const checkExistingStore = async () => {
    try {
      const response = await fetch('/api/stores?user-store=true')
      const data = await response.json()
      
      if (data.store) {
        setExistingStore(data.store)
        
        // Si tiene tienda y viene de feria, mostrar mudanza
        if (feriaContext.sector && feriaContext.city) {
          // Mostrar modal de mudanza
        } else {
          // Redirigir al editor si ya tiene tienda y no viene de feria
          setTimeout(() => {
            router.push('/mi/tienda-editor')
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Error checking store:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          feria_sector: feriaContext.sector,
          feria_city: feriaContext.city,
          feria_pos: feriaContext.position
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (feriaContext.sector && feriaContext.city) {
          setSuccess('¡Tienda creada y puesto asignado! Redirigiendo a la feria...')
          setTimeout(() => {
            router.push(`/feria?dept=${feriaContext.city}&success=created_and_assigned`)
          }, 2000)
        } else {
          setSuccess('¡Tienda creada exitosamente! Redirigiendo al editor...')
          setTimeout(() => {
            router.push('/mi/tienda-editor?success=created')
          }, 2000)
        }
      } else {
        setError(data.error || 'Error al crear la tienda')
      }
    } catch (error) {
      setError('Error del sistema. Intenta más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generar slug desde nombre (como el PHP)
    if (name === 'nombre') {
      // Solo autocompletar si el usuario no ha editado el slug manualmente
      const slugInput = document.getElementById('slug') as HTMLInputElement
      if (slugInput && (!slugInput.value || slugInput.dataset.manual !== 'true')) {
        const normalized = value
          .toLowerCase()
          .replace(/[áàäâ]/g, 'a')
          .replace(/[éèëê]/g, 'e')
          .replace(/[íìïî]/g, 'i')
          .replace(/[óòöô]/g, 'o')
          .replace(/[úùüû]/g, 'u')
          .replace(/ñ/g, 'n')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
        
        setFormData(prev => ({
          ...prev,
          slug: normalized
        }))
      }
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Marcar como editado manualmente (como el PHP)
    const slugInput = e.target
    slugInput.dataset.manual = 'true'
    
    setFormData(prev => ({
      ...prev,
      slug: e.target.value
    }))
  }

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir números
    const value = e.target.value.replace(/[^0-9]/g, '')
    setFormData(prev => ({
      ...prev,
      whatsapp: value
    }))
  }

  // Si ya tiene tienda y viene de feria, mostrar pantalla de mudanza
  if (existingStore && feriaContext.sector && feriaContext.city) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Asigna tu Puesto en la Feria
              </h1>
              
              <div className="flex items-center justify-center gap-6 mb-6">
                {/* Tu Tienda */}
                <div className="p-4 border rounded-lg bg-white shadow-sm flex flex-col items-center" style={{minWidth: '160px'}}>
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <Store className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="font-bold text-gray-900 mb-1 text-center">{existingStore.name}</div>
                  <small className="text-gray-500">Tu Tienda Actual</small>
                </div>

                {/* Flecha */}
                <div className="text-2xl text-blue-600">→</div>

                {/* Destino */}
                <div className="p-4 border rounded-lg bg-blue-50 shadow-sm" style={{minWidth: '150px'}}>
                  <div className="font-bold text-blue-600 mb-1">Sector {feriaContext.sector}</div>
                  <small className="text-gray-600">{feriaContext.city}</small>
                </div>
              </div>

              <p className="text-gray-600 mb-6 mx-auto" style={{maxWidth: '500px'}}>
                Al confirmar, tu tienda aparecerá visible en este puesto de la feria inmediatamente.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <input type="hidden" name="feria_sector" value={feriaContext.sector} />
              <input type="hidden" name="feria_city" value={feriaContext.city} />
              <input type="hidden" name="feria_pos" value={feriaContext.position} />
              
              <div className="flex justify-center gap-4">
                <Link 
                  href="/feria" 
                  className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-lg font-semibold hover:border-gray-400 transition-colors"
                >
                  Cancelar
                </Link>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Procesando...' : '✅ Confirmar y Ocupar Puesto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Si ya tiene tienda y no viene de feria, mostrar redirección
  if (existingStore && !feriaContext.sector) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Ya tienes una tienda!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu tienda <strong>{existingStore.name}</strong> está lista para ser editada.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Redirigiendo automáticamente al editor...</strong>
              </p>
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  // Determinar el título según contexto
  const getPageTitle = () => {
    if (feriaContext.sector && feriaContext.city) {
      return `Reserva tu Puesto en ${feriaContext.sector}`
    }
    return 'Crea tu Tienda Virtual'
  }

  const getSubmitButtonText = () => {
    if (feriaContext.sector && feriaContext.city) {
      return 'Crear y Ocupar Puesto'
    }
    return 'Crear Tienda'
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

      {/* Alerta de contexto de feria */}
      {feriaContext.sector && feriaContext.city && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
            <Store className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <small className="text-blue-800 font-semibold uppercase">Ubicación Seleccionada</small>
              <div className="font-bold text-gray-900">Sector {feriaContext.sector} - {feriaContext.city}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">{getPageTitle()}</h1>
            <p className="text-blue-100 mt-2">
              {feriaContext.sector && feriaContext.city 
                ? 'Completa los datos para crear tu tienda y ocupar tu puesto seleccionado.'
                : 'Configura tu tienda virtual y empieza a vender online'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Hidden fields for feria context */}
            <input type="hidden" name="feria_sector" value={feriaContext.sector} />
            <input type="hidden" name="feria_city" value={feriaContext.city} />
            <input type="hidden" name="feria_pos" value={feriaContext.position} />

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <span className="text-red-800 text-sm">❌ {error}</span>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <span className="text-green-800 text-sm">✅ {success}</span>
              </div>
            )}

            {/* TARJETA 1: DATOS DE LA TIENDA */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Datos de la Tienda</h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Nombre de tu Tienda (Ej: Tecnología Bolivia)"
                  />
                  {error && error.includes('nombre') && (
                    <div className="text-red-600 text-sm mt-2">❌ Debes ingresar el nombre de tu tienda</div>
                  )}
                </div>
              </div>
            </div>

            {/* TARJETA 2: URL */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Dirección Web (Link)</h2>
              <div className="space-y-4">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <span className="bg-gray-50 text-gray-600 text-sm font-medium px-4 py-3 border-r border-gray-300 whitespace-nowrap">
                    donebolivia.com/tienda/
                  </span>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    required
                    className="flex-1 px-4 py-3 border-0 focus:outline-none text-lg"
                    placeholder="mi-tienda"
                  />
                </div>
                <div className="text-gray-500 text-sm">
                  Esta será tu dirección única para compartir en redes sociales.
                </div>
                {error && error.includes('slug') && (
                  <div className="text-red-600 text-sm mt-2">❌ Debes ingresar una dirección web para tu tienda</div>
                )}
              </div>
            </div>

            {/* TARJETA 3: CONTACTO */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Contacto Directo</h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleWhatsappChange}
                    required
                    maxLength={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Número de WhatsApp para ventas (Ej: 70123456)"
                  />
                  {error && error.includes('whatsapp') && (
                    <div className="text-red-600 text-sm mt-2">❌ Debes ingresar tu número de WhatsApp</div>
                  )}
                </div>
              </div>
            </div>

            {/* BOTONES */}
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="/" 
                className="bg-white text-gray-600 border-2 border-gray-300 rounded-lg font-semibold text-center py-3 hover:border-gray-400 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-orange-600 text-white rounded-lg font-semibold text-center py-3 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creando tienda...
                  </div>
                ) : (
                  getSubmitButtonText()
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
