'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, Calendar, LogOut, Edit2, Save, Eye, EyeOff, Shield, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

import { MinimalButton } from "@/components/ui/minimal-button"
import { MinimalInput } from "@/components/ui/minimal-input"
import { MinimalSelect } from "@/components/ui/minimal-select"
import { Checkbox } from "@/components/ui/checkbox"
import Navbar from "@/components/layout/navbar"

const profileSchema = z.object({
  firstName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  lastName: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  phone: z.string().regex(/^[67]\d{7}$/, { message: "El teléfono debe comenzar con 6 o 7 y tener 8 dígitos" }).optional().or(z.literal('')),
  department: z.string().optional(),
  municipality: z.string().optional(),
  bio: z.string().max(500, { message: "La biografía no puede exceder 500 caracteres" }).optional().or(z.literal('')),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "La contraseña actual es requerida" }),
  newPassword: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  confirmPassword: z.string().min(1, { message: "Confirma la nueva contraseña" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
  
  const router = useRouter()
  
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isValid: isProfileValid },
    reset: resetProfile,
    setValue: setProfileValue,
    watch: watchProfile,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange'
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isValid: isPasswordValid },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange'
  })

  const departamento = watchProfile('department')
  const newPassword = watchPassword('newPassword')

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Error al obtener datos del usuario')
      }

      const userData = await response.json()
      setUser(userData.user)
      
      // Set form values
      if (userData.user.profile) {
        resetProfile({
          firstName: userData.user.profile.firstName || '',
          lastName: userData.user.profile.lastName || '',
          phone: userData.user.profile.phone || '',
          department: userData.user.profile.department || '',
          municipality: userData.user.profile.municipality || '',
          bio: userData.user.profile.bio || '',
        })
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar perfil')
      }

      setSuccess('Perfil actualizado exitosamente')
      setUser(prev => ({
        ...prev,
        profile: { ...prev.profile, ...data }
      }))
      
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar perfil')
    } finally {
      setIsSaving(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsChangingPassword(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al cambiar contraseña')
      }

      setSuccess('Contraseña cambiada exitosamente')
      resetPassword()
      
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cambiar contraseña')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const [departamentos, setDepartamentos] = useState<Array<{value: string; label: string}>>([])
  const [municipios, setMunicipios] = useState<Array<{value: string; label: string}>>([])
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(true)
  const [loadingMunicipios, setLoadingMunicipios] = useState(false)

  // Cargar departamentos al montar el componente
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await fetch('/api/departments')
        if (response.ok) {
          const data = await response.json()
          setDepartamentos(data)
        } else {
          console.error('Error fetching departamentos')
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoadingDepartamentos(false)
      }
    }

    fetchDepartamentos()
  }, [])

  // Cargar municipios cuando cambia el departamento
  useEffect(() => {
    if (watchProfile('department')) {
      const fetchMunicipios = async () => {
        try {
          setLoadingMunicipios(true)
          const response = await fetch(`/api/municipios/${watchProfile('department')}`)
          if (response.ok) {
            const data = await response.json()
            setMunicipios(data)
          } else {
            console.error('Error fetching municipios')
          }
        } catch (error) {
          console.error('Error:', error)
        } finally {
          setLoadingMunicipios(false)
        }
      }

      fetchMunicipios()
    }
  }, [watchProfile('department')])

  // Resetear municipio cuando cambia el departamento
  useEffect(() => {
    if (watchProfile('department')) {
      setProfileValue('municipality', '')
    }
  }, [watchProfile('department')])

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
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No autenticado</h2>
          <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tu perfil</p>
          <MinimalButton asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </MinimalButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal y configuración de seguridad</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Cuenta</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.profile?.firstName && user.profile?.lastName 
                        ? `${user.profile.firstName} ${user.profile.lastName}`
                        : user.email
                      }
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Miembro desde {new Date(user.createdAt).toLocaleDateString('es-BO')}</span>
                  </div>
                  {user.lastLoginAt && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4" />
                      <span>Último acceso {new Date(user.lastLoginAt).toLocaleDateString('es-BO')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('profile')}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  activeTab === 'profile'
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Edit2 className="w-4 h-4" />
                <span>Perfil</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  activeTab === 'security'
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Shield className="w-4 h-4" />
                <span>Seguridad</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="text-sm font-medium">{success}</p>
                </div>
              </div>
            )}

            {activeTab === 'profile' ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Personal</h2>
                  <p className="text-gray-600 mb-6">Actualiza tu información personal y preferencias</p>
                  
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MinimalInput
                        id="firstName"
                        label="Nombres"
                        placeholder="Ingresa tus nombres"
                        error={profileErrors.firstName?.message}
                        {...registerProfile('firstName')}
                      />
                      
                      <MinimalInput
                        id="lastName"
                        label="Apellidos"
                        placeholder="Ingresa tus apellidos"
                        error={profileErrors.lastName?.message}
                        {...registerProfile('lastName')}
                      />
                    </div>

                    <MinimalInput
                      id="phone"
                      label="Teléfono"
                      type="tel"
                      placeholder="60000000"
                      error={profileErrors.phone?.message}
                      {...registerProfile('phone')}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MinimalSelect
                        label="Departamento"
                        placeholder="Seleccionar departamento"
                        value={departamento}
                        onValueChange={(value) => setProfileValue('department', value)}
                        options={departamentos}
                        error={profileErrors.department?.message}
                      />
                      
                      <MinimalSelect
                        label="Municipio"
                        placeholder="Seleccionar municipio"
                        value={watchProfile('municipality')}
                        onValueChange={(value) => setProfileValue('municipality', value)}
                        options={departamento ? municipios : []}
                        error={profileErrors.municipality?.message}
                        disabled={!departamento}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Biografía
                      </label>
                      <textarea
                        {...registerProfile('bio')}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-0 transition-colors"
                        placeholder="Cuéntanos sobre ti..."
                      />
                      {profileErrors.bio && (
                        <p className="text-xs text-red-600 mt-1">{profileErrors.bio.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <MinimalButton 
                        type="submit" 
                        disabled={!isProfileValid || isSaving}
                        loading={isSaving}
                      >
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                      </MinimalButton>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Seguridad de la Cuenta</h2>
                  <p className="text-gray-600 mb-6">Cambia tu contraseña y configura opciones de seguridad</p>
                  
                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                    <MinimalInput
                      id="currentPassword"
                      label="Contraseña Actual"
                      type="password"
                      placeholder="Ingresa tu contraseña actual"
                      error={passwordErrors.currentPassword?.message}
                      {...registerPassword('currentPassword')}
                    />

                    <MinimalInput
                      id="newPassword"
                      label="Nueva Contraseña"
                      type="password"
                      placeholder="Ingresa tu nueva contraseña"
                      error={passwordErrors.newPassword?.message}
                      {...registerPassword('newPassword')}
                    />

                    <MinimalInput
                      id="confirmPassword"
                      label="Confirmar Contraseña"
                      type="password"
                      placeholder="Confirma tu nueva contraseña"
                      error={passwordErrors.confirmPassword?.message}
                      {...registerPassword('confirmPassword')}
                    />

                    <div className="flex justify-end">
                      <MinimalButton 
                        type="submit" 
                        disabled={!isPasswordValid || isChangingPassword}
                        loading={isChangingPassword}
                      >
                        {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                      </MinimalButton>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
