'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  Eye,
  Calendar,
  Download,
  RefreshCw,
  Activity,
  ShoppingCart,
  DollarSign,
  Target
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/format'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

interface MetricCard {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  trend: 'up' | 'down' | 'neutral'
}

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('all')

  const metrics: MetricCard[] = [
    {
      title: 'Usuarios Totales',
      value: '15,234',
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
      title: 'Visitas Totales',
      value: '45,678',
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
    },
    {
      title: 'Ingresos Estimados',
      value: '$125,430',
      change: 18.3,
      icon: <DollarSign className="h-6 w-6" />,
      trend: 'up'
    },
    {
      title: 'Tasa de Conversión',
      value: '3.2%',
      change: 0.8,
      icon: <Target className="h-6 w-6" />,
      trend: 'up'
    }
  ]

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

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const timeRanges = [
    { value: '24h', label: 'Últimas 24 horas' },
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 90 días' },
    { value: '1y', label: 'Último año' }
  ]

  const topPages = [
    { page: '/tienda/tech-store', views: 1234, change: 12.5 },
    { page: '/tienda/computer-world', views: 987, change: -5.2 },
    { page: '/explore', views: 876, change: 8.1 },
    { page: '/', views: 765, change: 3.4 },
    { page: '/feria', views: 654, change: -2.1 }
  ]

  const topProducts = [
    { name: 'iPhone 13 Pro Max', views: 2341, likes: 145, store: 'Tech Store' },
    { name: 'Laptop Gaming ASUS ROG', views: 1876, likes: 98, store: 'Computer World' },
    { name: 'Samsung Galaxy Watch', views: 1543, likes: 67, store: 'Gadgets Shop' },
    { name: 'PlayStation 5', views: 1234, likes: 234, store: 'GameZone' },
    { name: 'AirPods Pro', views: 1098, likes: 89, store: 'Audio Store' }
  ]

  const topStores = [
    { name: 'Tech Store', products: 45, views: 5678, rating: 4.5 },
    { name: 'Computer World', products: 32, views: 4321, rating: 4.2 },
    { name: 'GameZone', products: 67, views: 3876, rating: 4.7 },
    { name: 'Gadgets Shop', products: 18, views: 2345, rating: 3.8 },
    { name: 'Audio Store', products: 23, views: 1987, rating: 4.1 }
  ]

  const deviceStats = [
    { device: 'Desktop', percentage: 45.2, users: 6876, color: 'bg-blue-500' },
    { device: 'Mobile', percentage: 38.7, users: 5893, color: 'bg-green-500' },
    { device: 'Tablet', percentage: 16.1, users: 2452, color: 'bg-purple-500' }
  ]

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting analytics data...')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analíticas</h1>
          <p className="text-gray-600">Estadísticas detalladas del sistema</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Actualizar
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(metric.trend)}
                    <span className={cn("ml-1 text-sm", getTrendColor(metric.trend))}>
                      {Math.abs(metric.change)}%
                    </span>
                    <span className="ml-1 text-sm text-gray-500">vs período anterior</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Tráfico de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Gráfico de tráfico</p>
                <p className="text-sm text-gray-500">Aquí se mostrará el gráfico de visitas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Ingresos Estimados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Gráfico de ingresos</p>
                <p className="text-sm text-gray-500">Aquí se mostrará el gráfico de ingresos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Páginas Más Visitadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{page.page}</p>
                    <p className="text-sm text-gray-500">{formatNumber(page.views)} visitas</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {page.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                    )}
                    <span className={cn(
                      "text-sm",
                      page.change > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {Math.abs(page.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Productos Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-600">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.store}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-600">{formatNumber(product.views)} vistas</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600">{product.likes} likes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Stores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Tiendas Destacadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStores.map((store, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-600">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{store.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-600">{store.products} productos</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600">{formatNumber(store.views)} vistas</span>
                      <span className="text-xs text-gray-400">•</span>
                      <div className="flex items-center">
                        <span className="text-xs text-yellow-600">⭐ {store.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Estadísticas de Dispositivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deviceStats.map((device, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{device.device}</span>
                    <span className="text-sm text-gray-600">{device.percentage}% ({formatNumber(device.users)} usuarios)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn("h-2 rounded-full", device.color)}
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
