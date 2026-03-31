'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Save, 
  RotateCcw,
  Globe,
  Mail,
  Phone,
  Palette,
  Shield,
  Bell,
  Database,
  Server,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Setting {
  key: string
  value: string
  type: 'text' | 'email' | 'number' | 'boolean' | 'select'
  label: string
  description: string
  options?: string[]
  category: string
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([
    // General Settings
    {
      key: 'site_name',
      value: 'Done! Bolivia',
      type: 'text',
      label: 'Nombre del Sitio',
      description: 'Nombre que aparecerá en el título y header del sitio',
      category: 'general'
    },
    {
      key: 'site_description',
      value: 'Plataforma de compra y venta en Bolivia',
      type: 'text',
      label: 'Descripción del Sitio',
      description: 'Descripción para SEO y meta tags',
      category: 'general'
    },
    {
      key: 'contact_email',
      value: 'contacto@donebolivia.com',
      type: 'email',
      label: 'Email de Contacto',
      description: 'Email principal para recibir notificaciones',
      category: 'general'
    },
    {
      key: 'contact_phone',
      value: '+591-70000000',
      type: 'text',
      label: 'Celular de Contacto',
      description: 'Celular principal de contacto',
      category: 'general'
    },
    {
      key: 'maintenance_mode',
      value: 'false',
      type: 'boolean',
      label: 'Modo Mantenimiento',
      description: 'Poner el sitio en modo mantenimiento',
      category: 'general'
    },
    
    // UI Settings
    {
      key: 'primary_color',
      value: '#ff6b1a',
      type: 'text',
      label: 'Color Primario',
      description: 'Color principal del tema (hexadecimal)',
      category: 'ui'
    },
    {
      key: 'secondary_color',
      value: '#2c3e50',
      type: 'text',
      label: 'Color Secundario',
      description: 'Color secundario del tema (hexadecimal)',
      category: 'ui'
    },
    {
      key: 'dark_mode',
      value: 'false',
      type: 'boolean',
      label: 'Modo Oscuro',
      description: 'Habilitar modo oscuro para usuarios',
      category: 'ui'
    },
    
    // Security Settings
    {
      key: 'require_email_verification',
      value: 'true',
      type: 'boolean',
      label: 'Verificación de Email',
      description: 'Requerir verificación de email para registrarse',
      category: 'security'
    },
    {
      key: 'max_login_attempts',
      value: '5',
      type: 'number',
      label: 'Intentos de Login Máximos',
      description: 'Número máximo de intentos antes de bloquear',
      category: 'security'
    },
    {
      key: 'session_timeout',
      value: '24',
      type: 'number',
      label: 'Tiempo de Sesión (horas)',
      description: 'Duración de la sesión en horas',
      category: 'security'
    },
    
    // Notification Settings
    {
      key: 'email_notifications',
      value: 'true',
      type: 'boolean',
      label: 'Notificaciones por Email',
      description: 'Enviar notificaciones por email',
      category: 'notifications'
    },
    {
      key: 'new_user_notification',
      value: 'true',
      type: 'boolean',
      label: 'Notificación de Nuevos Usuarios',
      description: 'Notificar cuando se registra un nuevo usuario',
      category: 'notifications'
    },
    {
      key: 'report_notification',
      value: 'true',
      type: 'boolean',
      label: 'Notificación de Reportes',
      description: 'Notificar cuando se reporta contenido',
      category: 'notifications'
    },
    
    // System Settings
    {
      key: 'max_file_size',
      value: '10',
      type: 'number',
      label: 'Tamaño Máximo de Archivo (MB)',
      description: 'Tamaño máximo permitido para uploads',
      category: 'system'
    },
    {
      key: 'allowed_file_types',
      value: 'jpg,jpeg,png,gif,pdf',
      type: 'text',
      label: 'Tipos de Archivo Permitidos',
      description: 'Extensiones permitidas separadas por comas',
      category: 'system'
    },
    {
      key: 'backup_frequency',
      value: 'daily',
      type: 'select',
      label: 'Frecuencia de Backup',
      description: 'Con qué frecuencia se realizan backups automáticos',
      options: ['hourly', 'daily', 'weekly', 'monthly'],
      category: 'system'
    }
  ])

  const [activeCategory, setActiveCategory] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const categories = [
    { key: 'general', label: 'General', icon: <Globe className="h-5 w-5" /> },
    { key: 'ui', label: 'Interfaz', icon: <Palette className="h-5 w-5" /> },
    { key: 'security', label: 'Seguridad', icon: <Shield className="h-5 w-5" /> },
    { key: 'notifications', label: 'Notificaciones', icon: <Bell className="h-5 w-5" /> },
    { key: 'system', label: 'Sistema', icon: <Server className="h-5 w-5" /> }
  ]

  const filteredSettings = settings.filter(setting => setting.category === activeCategory)

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => prev.map(setting => 
      setting.key === key ? { ...setting, value } : setting
    ))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setHasChanges(false)
      setSaveMessage('Configuración guardada exitosamente')
      
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('Error al guardar la configuración')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    // Reset to default values
    setSettings(prev => prev.map(setting => ({
      ...setting,
      value: setting.key === 'site_name' ? 'Done! Bolivia' :
             setting.key === 'primary_color' ? '#ff6b1a' :
             setting.key === 'maintenance_mode' ? 'false' :
             setting.value
    })))
    setHasChanges(true)
  }

  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={setting.key}
              checked={setting.value === 'true'}
              onChange={(e) => handleSettingChange(setting.key, e.target.checked.toString())}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor={setting.key} className="ml-2 text-sm text-gray-700">
              {setting.value === 'true' ? 'Habilitado' : 'Deshabilitado'}
            </label>
          </div>
        )
      
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        )
      
      case 'number':
        return (
          <Input
            type="number"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full"
          />
        )
      
      case 'email':
        return (
          <Input
            type="email"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full"
          />
        )
      
      default:
        return (
          <Input
            type="text"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full"
          />
        )
    }
  }

  const getSystemStatus = () => {
    return {
      database: 'online',
      server: 'online',
      storage: 'healthy',
      lastBackup: '2024-03-24 02:00:00',
      uptime: '15 días, 3 horas'
    }
  }

  const systemStatus = getSystemStatus()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Ajustes del sistema y preferencias</p>
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge className="bg-orange-100 text-orange-800">
              Cambios sin guardar
            </Badge>
          )}
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restablecer
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || isSaving}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <Card className={cn(
          "border",
          saveMessage.includes('error') ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
        )}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              {saveMessage.includes('error') ? (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              <p className={cn(
                "text-sm",
                saveMessage.includes('error') ? "text-red-900" : "text-green-900"
              )}>
                {saveMessage}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categorías</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                      activeCategory === category.key ? "bg-orange-50 border-l-4 border-orange-500" : ""
                    )}
                  >
                    {category.icon}
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Server className="h-5 w-5 mr-2" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base de Datos</span>
                  <Badge className={cn(
                    "bg-green-100 text-green-800",
                    systemStatus.database === 'online' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  )}>
                    {systemStatus.database === 'online' ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Servidor</span>
                  <Badge className={cn(
                    "bg-green-100 text-green-800",
                    systemStatus.server === 'online' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  )}>
                    {systemStatus.server === 'online' ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Almacenamiento</span>
                  <Badge className="bg-green-100 text-green-800">
                    {systemStatus.storage === 'healthy' ? 'Sano' : 'Advertencia'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Último Backup</span>
                  <span className="text-xs text-gray-500">{systemStatus.lastBackup}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tiempo Activo</span>
                  <span className="text-xs text-gray-500">{systemStatus.uptime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {categories.find(c => c.key === activeCategory)?.icon}
                <span className="ml-2">
                  {categories.find(c => c.key === activeCategory)?.label}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredSettings.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        {setting.label}
                      </label>
                      <p className="text-xs text-gray-500">{setting.description}</p>
                    </div>
                    {renderSettingInput(setting)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
