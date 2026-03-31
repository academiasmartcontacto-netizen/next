'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

import { MinimalButton } from "@/components/ui/minimal-button"
import { Checkbox } from "@/components/ui/checkbox"
import { MinimalInput } from "@/components/ui/minimal-input"
import { MinimalSelect } from "@/components/ui/minimal-select"
import { PasswordStrength } from "@/components/ui/password-strength"
import Navbar from "@/components/layout/navbar"
import { useAuth } from '@/contexts/AuthContext'

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
  
  const router = useRouter()
  const { login } = useAuth()
  
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

      // LOGIN AUTOMÁTICO DESPUÉS DEL REGISTRO
      await login(data.telefono, data.password)
      
      // REDIRECCIÓN DIRECTA A HOMEPAGE LOGUEADO
      router.push('/')
      router.refresh()
      
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
  
  // Opciones para departamentos y municipios - Datos INE 2024
  const departamentos = [
    { value: 'ch', label: 'Chuquisaca' },
    { value: 'lp', label: 'La Paz' },
    { value: 'cb', label: 'Cochabamba' },
    { value: 'or', label: 'Oruro' },
    { value: 'pt', label: 'Potosí' },
    { value: 'tj', label: 'Tarija' },
    { value: 'sc', label: 'Santa Cruz' },
    { value: 'bn', label: 'Beni' },
    { value: 'pd', label: 'Pando' }
  ]
  
  const municipios: Record<string, Array<{ value: string; label: string }>> = {
    'ch': [
      { value: 'ch-001', label: 'Sucre' },
      { value: 'ch-002', label: 'Yotala' },
      { value: 'ch-003', label: 'Poroma' },
      { value: 'ch-004', label: 'Azurduy' },
      { value: 'ch-005', label: 'Tarvita' },
      { value: 'ch-006', label: 'Villa Zudáñez' },
      { value: 'ch-007', label: 'Presto' },
      { value: 'ch-008', label: 'Villa Mojocoya' },
      { value: 'ch-009', label: 'Icla' },
      { value: 'ch-010', label: 'Padilla' },
      { value: 'ch-011', label: 'Tomina' },
      { value: 'ch-012', label: 'Sopachuy' },
      { value: 'ch-013', label: 'Villa Alcalá' },
      { value: 'ch-014', label: 'El Villar' },
      { value: 'ch-015', label: 'Monteagudo' },
      { value: 'ch-016', label: 'Huacareta' },
      { value: 'ch-017', label: 'Tarabuco' },
      { value: 'ch-018', label: 'Yamparáez' },
      { value: 'ch-019', label: 'Camargo' },
      { value: 'ch-020', label: 'San Lucas' },
      { value: 'ch-021', label: 'Incahuasi' },
      { value: 'ch-022', label: 'Villa Charcas' },
      { value: 'ch-023', label: 'Villa Serrano' },
      { value: 'ch-024', label: 'Villa Abecia' },
      { value: 'ch-025', label: 'Culpina' },
      { value: 'ch-026', label: 'Las Carreras' },
      { value: 'ch-027', label: 'Villa Vaca Guzmán (Muyupampa)' },
      { value: 'ch-028', label: 'Huacaya' },
      { value: 'ch-029', label: 'Macharetí' }
    ],
    'lp': [
      { value: 'lp-001', label: 'La Paz' },
      { value: 'lp-002', label: 'Palca' },
      { value: 'lp-003', label: 'Mecapaca' },
      { value: 'lp-004', label: 'Achocalla' },
      { value: 'lp-005', label: 'El Alto' },
      { value: 'lp-006', label: 'Achacachi' },
      { value: 'lp-007', label: 'Ancoraimes' },
      { value: 'lp-008', label: 'Huarina' },
      { value: 'lp-009', label: 'Santiago de Huata' },
      { value: 'lp-010', label: 'Huatajata' },
      { value: 'lp-011', label: 'Chua Cocani' },
      { value: 'lp-012', label: 'Coro Coro' },
      { value: 'lp-013', label: 'Caquiaviri' },
      { value: 'lp-014', label: 'Calacoto' },
      { value: 'lp-015', label: 'Comanche' },
      { value: 'lp-016', label: 'Charaña' },
      { value: 'lp-017', label: 'Waldo Ballivian' },
      { value: 'lp-018', label: 'Nazacara de Pacajes' },
      { value: 'lp-019', label: 'Callapa' },
      { value: 'lp-020', label: 'Puerto Acosta' },
      { value: 'lp-021', label: 'Mocomoco' },
      { value: 'lp-022', label: 'Puerto Carabuco' },
      { value: 'lp-023', label: 'Humanata' },
      { value: 'lp-024', label: 'Escoma' },
      { value: 'lp-025', label: 'Chuma' },
      { value: 'lp-026', label: 'Ayata' },
      { value: 'lp-027', label: 'Aucapata' },
      { value: 'lp-028', label: 'Sorata' },
      { value: 'lp-029', label: 'Guanay' },
      { value: 'lp-030', label: 'Tacacoma' },
      { value: 'lp-031', label: 'Quiabaya' },
      { value: 'lp-032', label: 'Combaya' },
      { value: 'lp-033', label: 'Tipuani' },
      { value: 'lp-034', label: 'Mapiri' },
      { value: 'lp-035', label: 'Teoponte' },
      { value: 'lp-036', label: 'Apolo' },
      { value: 'lp-037', label: 'Pelechuco' },
      { value: 'lp-038', label: 'Viacha' },
      { value: 'lp-039', label: 'Guaqui' },
      { value: 'lp-040', label: 'Tiahuanacu' },
      { value: 'lp-041', label: 'Desaguadero' },
      { value: 'lp-042', label: 'San Andrés de Machaca' },
      { value: 'lp-043', label: 'Jesús de Machaca' },
      { value: 'lp-044', label: 'Taraco' },
      { value: 'lp-045', label: 'Luribay' },
      { value: 'lp-046', label: 'Sapahaqui' },
      { value: 'lp-047', label: 'Yaco' },
      { value: 'lp-048', label: 'Malla' },
      { value: 'lp-049', label: 'Cairoma' },
      { value: 'lp-050', label: 'Inquisivi' },
      { value: 'lp-051', label: 'Quime' },
      { value: 'lp-052', label: 'Cajuata' },
      { value: 'lp-053', label: 'Colquiri' },
      { value: 'lp-054', label: 'Ichoca' },
      { value: 'lp-055', label: 'Villa Libertad Licoma' },
      { value: 'lp-056', label: 'Chulumani' },
      { value: 'lp-057', label: 'Irupana' },
      { value: 'lp-058', label: 'Yanacachi' },
      { value: 'lp-059', label: 'Palos Blancos' },
      { value: 'lp-060', label: 'La Asunta' },
      { value: 'lp-061', label: 'Pucarani' },
      { value: 'lp-062', label: 'Laja' },
      { value: 'lp-063', label: 'Batallas' },
      { value: 'lp-064', label: 'Puerto Pérez' },
      { value: 'lp-065', label: 'Sica Sica' },
      { value: 'lp-066', label: 'Umala' },
      { value: 'lp-067', label: 'Ayo Ayo' },
      { value: 'lp-068', label: 'Calamarca' },
      { value: 'lp-069', label: 'Patacamaya' },
      { value: 'lp-070', label: 'Colquencha' },
      { value: 'lp-071', label: 'Collana' },
      { value: 'lp-072', label: 'Coroico' },
      { value: 'lp-073', label: 'Coripata' },
      { value: 'lp-074', label: 'Ixiamas' },
      { value: 'lp-075', label: 'San Buenaventura' },
      { value: 'lp-076', label: 'Charazani' },
      { value: 'lp-077', label: 'Curva' },
      { value: 'lp-078', label: 'Copacabana' },
      { value: 'lp-079', label: 'San Pedro de Tiquina' },
      { value: 'lp-080', label: 'Tito Yupanqui' },
      { value: 'lp-081', label: 'San Pedro Cuarahuara' },
      { value: 'lp-082', label: 'Papel Pampa' },
      { value: 'lp-083', label: 'Chacarilla' },
      { value: 'lp-084', label: 'Santiago de Machaca' },
      { value: 'lp-085', label: 'Catacora' },
      { value: 'lp-086', label: 'Caranavi' },
      { value: 'lp-087', label: 'Alto Beni' }
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
            Tu cuenta ha sido creada exitosamente. Redirigiendo...
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Crear cuenta
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Personal</h2>
                  
                  <div className="space-y-6">
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
                      {...register('telefono')}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="border-b border-gray-200 pb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Ubicación</h2>
                  
                  <div className="space-y-6">
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
                </div>

                {/* Security */}
                <div className="pb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Seguridad</h2>
                  
                  <div className="space-y-6">
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
                      <div>
                        <PasswordStrength password={password} />
                      </div>
                    )}
                  </div>
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
