'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Package, 
  Eye, 
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCard {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  trend: 'up' | 'down' | 'neutral'
}

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: 'Total Usuarios',
      value: '2,543',
      change: 12.5,
      icon: <Users className="h-6 w-6" />,
      trend: 'up'
    },
    {
      title: 'Productos Activos',
      value: '8,921',
      change: 8.2,
      icon: <Package className="h-6 w-6" />,
      trend: 'up'
    },
    {
      title: 'Visitas Hoy',
      value: '15,234',
      change: -3.1,
      icon: <Eye className="h-6 w-6" />,
      trend: 'down'
    },
    {
      title: 'Tiendas Activas',
      value: '342',
      change: 5.7,
      icon: <ShoppingCart className="h-6 w-6" />,
      trend: 'up'
    }
  ])

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'user',
      message: 'Nuevo usuario registrado: Juan Pérez',
      time: 'Hace 2 minutos',
      status: 'success'
    },
    {
      id: 2,
      type: 'product',
      message: 'Producto reportado: iPhone 13 Pro',
      time: 'Hace 15 minutos',
      status: 'warning'
    },
    {
      id: 3,
      type: 'store',
      message: 'Tienda "Tech Store" verificada',
      time: 'Hace 1 hora',
      status: 'success'
    },
    {
      id: 4,
      type: 'system',
      message: 'Backup automático completado',
      time: 'Hace 2 horas',
      status: 'info'
    }
  ])

  const [quickActions] = useState<QuickAction[]>([
    {
      title: 'Gestionar Usuarios',
      description: 'Ver y administrar todos los usuarios',
      icon: <Users className="h-8 w-8" />,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Revisar Productos',
      description: 'Moderar productos reportados',
      icon: <Package className="h-8 w-8" />,
      href: '/admin/products',
      color: 'bg-green-500'
    },
    {
      title: 'Ver Analíticas',
      description: 'Estadísticas detalladas del sistema',
      icon: <TrendingUp className="h-8 w-8" />,
      href: '/admin/analytics',
      color: 'bg-purple-500'
    },
    {
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: <Activity className="h-8 w-8" />,
      href: '/admin/settings',
      color: 'bg-orange-500'
    }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al panel de administración de Done!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(stat.trend)}
                    <span className={cn(
                      "ml-1 text-sm",
                      stat.trend === 'up' ? "text-green-600" : 
                      stat.trend === 'down' ? "text-red-600" : "text-gray-600"
                    )}>
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="ml-1 text-sm text-gray-500">vs ayer</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className={`${action.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {action.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Salud del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado del Servidor</span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base de Datos</span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Conectada
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uso de CPU</span>
                <span className="text-sm font-medium text-gray-900">23%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Memoria</span>
                <span className="text-sm font-medium text-gray-900">4.2GB / 8GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Último Backup</span>
                <span className="text-sm font-medium text-gray-900">Hace 2 horas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
