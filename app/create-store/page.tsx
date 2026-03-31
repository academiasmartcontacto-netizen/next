'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Store, 
  Globe, 
  Phone, 
  CheckCircle2,
  AlertCircle,
  Link2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MinimalButton } from '@/components/ui/minimal-button'
import { MinimalInput } from '@/components/ui/minimal-input'
import Navbar from '@/components/layout/navbar'

const storeSchema = z.object({
  storeName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  phone: z.string().regex(/^[67]\d{7}$/, { message: "El celular debe comenzar con 6 o 7 y tener 8 dígitos" }),
  storeLink: z.string()
    .min(3, { message: "El link debe tener al menos 3 caracteres" })
    .max(30, { message: "El link no puede exceder 30 caracteres" })
    .regex(/^[a-z0-9-]+$/, { message: "Solo letras minúsculas, números y guiones" }),
})

type StoreFormValues = z.infer<typeof storeSchema>

export default function CreateStorePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    mode: 'onChange'
  })

  const storeName = watch('storeName')
  const storeLink = watch('storeLink')

  // Auto-generate store link from store name
  useEffect(() => {
    if (storeName && !storeLink) {
      const generatedLink = storeName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 30)
      setValue('storeLink', generatedLink)
    }
  }, [storeName, storeLink, setValue])

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        
        // Check if user already has a store
        const storeResponse = await fetch('/api/stores/user-store')
        if (storeResponse.ok) {
          const storeData = await storeResponse.json()
          if (storeData.store) {
            // User already has a store, redirect to edit
            router.push('/mi/tienda-editor')
            return
          }
        }
      } else if (response.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: StoreFormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Check if store link is available
      const checkResponse = await fetch(`/api/stores/check-link?link=${data.storeLink}`)
      if (!checkResponse.ok) {
        throw new Error('El link de tienda ya está en uso')
      }

      // Create store
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.storeName,
          phone: data.phone,
          link: data.storeLink,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear tienda')
      }

      setSubmitSuccess(true)
      
      // Redirect to edit-store after 2 seconds
      setTimeout(() => {
        router.push('/mi/tienda-editor')
      }, 2000)
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error al crear tienda')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center max-w-md w-full">
          <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Debes iniciar sesión para crear una tienda</p>
          <MinimalButton asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </MinimalButton>
        </div>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Tienda Creada!</h2>
          <p className="text-gray-600 mb-6">
            Tu tienda ha sido creada exitosamente. Redirigiendo al editor...
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Crear Tu Tienda</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Crea tu tienda online en segundos. Compite con Wix, Site123 y más.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Store Name */}
              <MinimalInput
                id="storeName"
                label="Nombre de la Tienda"
                placeholder="Mi Tienda Increíble"
                required
                error={errors.storeName?.message}
                {...register('storeName')}
              />

              {/* Phone */}
              <MinimalInput
                id="phone"
                label="Celular de Contacto"
                type="tel"
                placeholder="60000000"
                required
                error={errors.phone?.message}
                {...register('phone')}
              />

              {/* Store Link */}
              <div>
                <MinimalInput
                  id="storeLink"
                  label="Link de tu Tienda"
                  placeholder="mi-tienda"
                  required
                  error={errors.storeLink?.message}
                  {...register('storeLink')}
                />
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <Link2 className="w-4 h-4 mr-2" />
                  Tu tienda estará en: <span className="font-mono ml-1 text-orange-600">dominio.com/store/{storeLink || 'tu-link'}</span>
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">{submitError}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <MinimalButton 
                  type="submit" 
                  className="flex-1"
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? 'Creando Tienda...' : 'Crear Tienda Ahora'}
                </MinimalButton>
                
                <MinimalButton 
                  type="button" 
                  variant="outline"
                  onClick={() => reset()}
                >
                  Cancelar
                </MinimalButton>
              </div>
            </form>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">¿Qué sucede después?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Serás redirigido automáticamente al editor de tu tienda</li>
                <li>• Podrás personalizar el diseño, agregar páginas y contenido</li>
                <li>• Tu tienda estará disponible en dominio.com/store/{storeLink || 'tu-link'}</li>
                <li>• Podrás publicarla cuando esté lista</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
