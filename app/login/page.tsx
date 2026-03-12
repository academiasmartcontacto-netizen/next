'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

import { MinimalButton } from "@/components/ui/minimal-button"
import { MinimalInput } from "@/components/ui/minimal-input"
import Navbar from "@/components/layout/navbar"
import { useAuth } from '@/contexts/AuthContext'

function LoginPageContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  
  const returnTo = searchParams.get('returnTo') || '/'
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          router.push(returnTo)
        }
      } catch (error) {
        // User not logged in, continue with login page
      }
    }
    
    checkAuth()
  }, [router, returnTo])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    try {
      await login(email, password)
      
      setSuccess(true)
      setTimeout(() => {
        router.push(returnTo)
        router.refresh()
      }, 1500)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Bienvenido!</h2>
          <p className="text-gray-600 mb-6">
            Redirigiendo...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-orange-600 rounded-lg mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
            <p className="text-gray-600">Ingresa tus credenciales para acceder</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-8">
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <MinimalInput
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="tu@correo.com"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <MinimalInput
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 text-red-700">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <div>
                  <MinimalButton 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Iniciando sesión...
                      </div>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </MinimalButton>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <Link href="/register" className="font-medium text-orange-600 hover:text-orange-500">
                      Regístrate
                    </Link>
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm">
                    <Link href="/forgot-password" className="font-medium text-gray-600 hover:text-gray-700">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </p>
                </div>

                <div className="text-center mt-8">
                  <p className="text-xs text-gray-500">
                    Al iniciar sesión, aceptas nuestros{' '}
                    <Link href="/terms" className="text-gray-600 hover:text-gray-700">
                      términos de servicio
                    </Link>
                    {' '}y{' '}
                    <Link href="/privacy" className="text-gray-600 hover:text-gray-700">
                      política de privacidad
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
