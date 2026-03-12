'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Eye, EyeOff, User, Mail, Phone, Lock, Building2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

import { MinimalButton } from "@/components/ui/minimal-button"
import { Checkbox } from "@/components/ui/checkbox"
import { MinimalInput } from "@/components/ui/minimal-input"
import { MinimalSelect } from "@/components/ui/minimal-select"
import { PasswordStrength } from "@/components/ui/password-strength"
import Navbar from "@/components/layout/navbar"

const registerSchema = z.object({
  nombres: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede exceder 50 caracteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: "El nombre solo puede contener letras y espacios" }),
  apellidos: z.string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(50, { message: "El apellido no puede exceder 50 caracteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: "El apellido solo puede contener letras y espacios" }),
  email: z.string()
    .email({ message: "Email inválido" })
    .max(100, { message: "El email no puede exceder 100 caracteres" }),
  telefono: z.string()
    .regex(/^[67]\d{7}$/, { message: "El teléfono debe comenzar con 6 o 7 y tener 8 dígitos" }),
  departamento: z.string({ required_error: "Debes seleccionar un departamento" }),
  municipio: z.string({ required_error: "Debes seleccionar un municipio" }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .max(100, { message: "La contraseña no puede exceder 100 caracteres" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: "La contraseña debe contener al menos una mayúscula, una minúscula y un número" 
    }),
  terms: z.boolean().refine((val) => val === true, { message: "Debes aceptar los términos y condiciones" }),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
    trigger,
    getFieldState
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: false,
    },
    mode: 'onChange'
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setSubmitError(null)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.nombres,
          lastName: data.apellidos,
          phone: data.telefono,
          department: data.departamento,
          municipality: data.municipio,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear la cuenta')
      }

      setSubmitSuccess(true)
      // Aquí iría la lógica real de envío a Supabase
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error al crear la cuenta. Por favor, intenta nuevamente.')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const departamento = watch("departamento")
  const password = watch("password")
  const watchedFields = watch()
  
  // Opciones para departamentos y municipios
  const departamentos = [
    { value: 'lp', label: 'La Paz' },
    { value: 'sc', label: 'Santa Cruz' },
    { value: 'cb', label: 'Cochabamba' },
    { value: 'or', label: 'Oruro' },
    { value: 'pt', label: 'Potosí' },
    { value: 'tj', label: 'Tarija' },
    { value: 'ch', label: 'Chuquisaca' },
    { value: 'bn', label: 'Beni' },
    { value: 'pd', label: 'Pando' }
  ]
  
  const municipios: Record<string, Array<{ value: string; label: string }>> = {
    'lp': [
      { value: 'lp-1', label: 'La Paz' },
      { value: 'lp-2', label: 'El Alto' },
      { value: 'lp-3', label: 'Viacha' },
      { value: 'lp-4', label: 'Achocalla' }
    ],
    'sc': [
      { value: 'sc-1', label: 'Santa Cruz de la Sierra' },
      { value: 'sc-2', label: 'Warnes' },
      { value: 'sc-3', label: 'Montero' },
      { value: 'sc-4', label: 'Lagunillas' }
    ],
    'cb': [
      { value: 'cb-1', label: 'Cochabamba' },
      { value: 'cb-2', label: 'Quillacollo' },
      { value: 'cb-3', label: 'Sacaba' },
      { value: 'cb-4', label: 'Tiquipaya' }
    ],
    'or': [
      { value: 'or-1', label: 'Oruro' },
      { value: 'or-2', label: 'Huanuni' },
      { value: 'or-3', label: 'Machacamarca' }
    ],
    'pt': [
      { value: 'pt-1', label: 'Potosí' },
      { value: 'pt-2', label: 'Llallagua' },
      { value: 'pt-3', label: 'Uyuni' }
    ],
    'tj': [
      { value: 'tj-1', label: 'Tarija' },
      { value: 'tj-2', label: 'Yacuiba' },
      { value: 'tj-3', label: 'Bermejo' }
    ],
    'ch': [
      { value: 'ch-1', label: 'Sucre' },
      { value: 'ch-2', label: 'Yotala' },
      { value: 'ch-3', label: 'Tarabuco' }
    ],
    'bn': [
      { value: 'bn-1', label: 'Trinidad' },
      { value: 'bn-2', label: 'Riberalta' },
      { value: 'bn-3', label: 'Guayaramerín' }
    ],
    'pd': [
      { value: 'pd-1', label: 'Cobija' },
      { value: 'pd-2', label: 'Porvenir' },
      { value: 'pd-3', label: 'Filadelfia' }
    ]
  }
  
  // Resetear municipio cuando cambia el departamento
  useEffect(() => {
    if (departamento) {
      setValue('municipio', '')
      trigger('municipio')
    }
  }, [departamento, setValue, trigger])
  
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center max-w-md w-full">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Cuenta Creada!</h2>
          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.
          </p>
          <MinimalButton asChild className="w-full">
            <Link href="/login">
              Iniciar Sesión
            </Link>
          </MinimalButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={null} />
      
      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Crear cuenta
          </h1>
          <p className="text-lg text-gray-600">
            Únete a nuestra plataforma y accede a contenido educativo de calidad.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MinimalInput
                      id="nombres"
                      label="Nombres"
                      placeholder="Ingresa tus nombres"
                      required
                      error={errors.nombres?.message}
                      {...register('nombres')}
                      autoComplete="given-name"
                    />
                    
                    <MinimalInput
                      id="apellidos"
                      label="Apellidos"
                      placeholder="Ingresa tus apellidos"
                      required
                      error={errors.apellidos?.message}
                      {...register('apellidos')}
                      autoComplete="family-name"
                    />
                  </div>

                  <MinimalInput
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    error={errors.email?.message}
                    helperText="Usaremos este email para comunicarnos contigo"
                    {...register('email')}
                    autoComplete="email"
                  />

                  <MinimalInput
                    id="telefono"
                    label="Teléfono"
                    type="tel"
                    placeholder="60000000"
                    required
                    error={errors.telefono?.message}
                    helperText="Número de teléfono boliviano (8 dígitos)"
                    {...register('telefono')}
                    autoComplete="tel"
                  />
                </div>

                {/* Location */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MinimalSelect
                      label="Departamento"
                      placeholder="Seleccionar departamento"
                      required
                      value={departamento}
                      onValueChange={(value) => {
                        setValue('departamento', value)
                        trigger('departamento')
                      }}
                      options={departamentos}
                      error={errors.departamento?.message}
                    />
                    
                    <MinimalSelect
                      label="Municipio"
                      placeholder="Seleccionar municipio"
                      required
                      value={watchedFields.municipio}
                      onValueChange={(value) => {
                        setValue('municipio', value)
                        trigger('municipio')
                      }}
                      options={departamento ? municipios[departamento] || [] : []}
                      error={errors.municipio?.message}
                      disabled={!departamento}
                    />
                  </div>
                </div>

                {/* Security */}
                <div className="pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Seguridad</h2>
                  <MinimalInput
                    id="password"
                    label="Contraseña"
                    type="password"
                    placeholder="Crea una contraseña segura"
                    required
                    error={errors.password?.message}
                    {...register('password')}
                    autoComplete="new-password"
                  />
                  
                  {password && (
                    <div className="mt-4">
                      <PasswordStrength password={password} />
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="terms" 
                      onCheckedChange={(checked) => {
                        setValue('terms', checked as boolean)
                        trigger('terms')
                      }}
                    />
                    <div className="space-y-1">
                      <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                        Acepto los{' '}
                        <Link href="/terms" className="font-medium text-orange-600 hover:text-orange-700">
                          Términos y Condiciones
                        </Link>
                        {' '}y la{' '}
                        <Link href="/privacy" className="font-medium text-orange-600 hover:text-orange-700">
                          Política de Privacidad
                        </Link>
                      </label>
                      {errors.terms && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.terms.message}
                        </p>
                      )}
                    </div>
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
                    disabled={!isValid || !isDirty || isLoading}
                    loading={isLoading}
                  >
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </MinimalButton>
                  
                  <MinimalButton 
                    type="button" 
                    variant="outline"
                    asChild
                  >
                    <Link href="/login">Cancelar</Link>
                  </MinimalButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
