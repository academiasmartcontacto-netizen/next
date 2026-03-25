'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Globe, 
  Monitor, 
  Smartphone, 
  Tablet,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Users,
  Clock,
  TrendingUp,
  MapPin,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/format'

interface TrafficEntry {
  id: string
  timestamp: string
  ip: string
  userAgent: string
  url: string
  method: string
  statusCode: number
  responseTime: number
  referrer?: string
  country?: string
  city?: string
  device: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
}

interface LiveStats {
  totalVisits: number
  uniqueVisitors: number
  activeUsers: number
  avgResponseTime: number
  topPages: Array<{
    url: string
    visits: number
    change: number
  }>
  topCountries: Array<{
    country: string
    visits: number
    percentage: number
  }>
  devices: Array<{
    type: string
    count: number
    percentage: number
  }>
}

export default function AdminTraffic() {
  const [traffic, setTraffic] = useState<TrafficEntry[]>([
    {
      id: '1',
      timestamp: '2024-03-24 15:30:15',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      url: '/tienda/tech-store',
      method: 'GET',
      statusCode: 200,
      responseTime: 245,
      referrer: 'https://google.com',
      country: 'Bolivia',
      city: 'Santa Cruz',
      device: 'desktop',
      browser: 'Chrome',
      os: 'Windows'
    },
    {
      id: '2',
      timestamp: '2024-03-24 15:29:45',
      ip: '45.123.67.89',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      url: '/explore',
      method: 'GET',
      statusCode: 200,
      responseTime: 189,
      referrer: 'https://facebook.com',
      country: 'Bolivia',
      city: 'La Paz',
      device: 'mobile',
      browser: 'Safari',
      os: 'iOS'
    },
    {
      id: '3',
      timestamp: '2024-03-24 15:29:12',
      ip: '78.90.123.45',
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      url: '/feria',
      method: 'GET',
      statusCode: 200,
      responseTime: 312,
      country: 'Bolivia',
      city: 'Cochabamba',
      device: 'tablet',
      browser: 'Safari',
      os: 'iPadOS'
    },
    {
      id: '4',
      timestamp: '2024-03-24 15:28:55',
      ip: '156.78.90.12',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
      url: '/',
      method: 'GET',
      statusCode: 200,
      responseTime: 156,
      country: 'Argentina',
      city: 'Buenos Aires',
      device: 'desktop',
      browser: 'Firefox',
      os: 'Windows'
    },
    {
      id: '5',
      timestamp: '2024-03-24 15:28:30',
      ip: '234.56.78.90',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      url: '/tienda/computer-world',
      method: 'GET',
      statusCode: 404,
      responseTime: 89,
      country: 'Chile',
      city: 'Santiago',
      device: 'desktop',
      browser: 'Chrome',
      os: 'macOS'
    }
  ])

  const [liveStats, setLiveStats] = useState<LiveStats>({
    totalVisits: 15432,
    uniqueVisitors: 8934,
    activeUsers: 234,
    avgResponseTime: 187,
    topPages: [
      { url: '/tienda/tech-store', visits: 1234, change: 12.5 },
      { url: '/explore', visits: 987, change: -5.2 },
      { url: '/', visits: 876, change: 8.1 },
      { url: '/feria', visits: 654, change: 3.4 },
      { url: '/tienda/computer-world', visits: 543, change: -2.1 }
    ],
    topCountries: [
      { country: 'Bolivia', visits: 8234, percentage: 65.2 },
      { country: 'Argentina', visits: 1876, percentage: 14.9 },
      { country: 'Chile', visits: 1234, percentage: 9.8 },
      { country: 'Perú', visits: 876, percentage: 6.9 },
      { country: 'Estados Unidos', visits: 412, percentage: 3.2 }
    ],
    devices: [
      { type: 'Desktop', count: 8234, percentage: 45.2 },
      { type: 'Mobile', count: 7123, percentage: 39.1 },
      { type: 'Tablet', count: 2876, percentage: 15.7 }
    ]
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deviceFilter, setDeviceFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        totalVisits: prev.totalVisits + Math.floor(Math.random() * 5),
        activeUsers: Math.max(100, prev.activeUsers + Math.floor(Math.random() * 10) - 5),
        avgResponseTime: Math.max(100, prev.avgResponseTime + Math.floor(Math.random() * 20) - 10)
      }))
      setLastUpdate(new Date())
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const filteredTraffic = traffic.filter(entry => {
    const matchesSearch = entry.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.ip.includes(searchTerm) ||
                         entry.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.city?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'success' && entry.statusCode < 400) ||
                         (statusFilter === 'error' && entry.statusCode >= 400)
    const matchesDevice = deviceFilter === 'all' || entry.device === deviceFilter
    return matchesSearch && matchesStatus && matchesDevice
  })

  const itemsPerPage = 20
  const totalPages = Math.ceil(filteredTraffic.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTraffic = filteredTraffic.slice(startIndex, startIndex + itemsPerPage)

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop':
        return <Monitor className="h-4 w-4 text-blue-500" />
      case 'mobile':
        return <Smartphone className="h-4 w-4 text-green-500" />
      case 'tablet':
        return <Tablet className="h-4 w-4 text-purple-500" />
      default:
        return <Monitor className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (statusCode: number) => {
    if (statusCode < 300) {
      return <Badge className="bg-green-100 text-green-800">{statusCode}</Badge>
    } else if (statusCode < 400) {
      return <Badge className="bg-blue-100 text-blue-800">{statusCode}</Badge>
    } else if (statusCode < 500) {
      return <Badge className="bg-yellow-100 text-yellow-800">{statusCode}</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800">{statusCode}</Badge>
    }
  }

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 200) return 'text-green-600'
    if (responseTime < 500) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleRefresh = () => {
    // Simulate refresh
    setLastUpdate(new Date())
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-3 h-3 rounded-full",
            isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"
          )} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tráfico en Vivo</h1>
            <p className="text-gray-600">
              Monitoreo de tráfico en tiempo real
              {isLive && <span className="ml-2 text-green-600">• En vivo</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isLive ? "default" : "outline"}
            onClick={() => setIsLive(!isLive)}
            className={isLive ? "bg-green-500 hover:bg-green-600" : ""}
          >
            <Activity className="h-4 w-4 mr-2" />
            {isLive ? 'En Vivo' : 'Pausado'}
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visitas</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(liveStats.totalVisits)}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visitantes Únicos</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(liveStats.uniqueVisitors)}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-orange-600">{liveStats.activeUsers}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo Respuesta</p>
                <p className="text-2xl font-bold text-purple-600">{liveStats.avgResponseTime}ms</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Páginas Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {liveStats.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{page.url}</p>
                    <p className="text-sm text-gray-500">{formatNumber(page.visits)} visitas</p>
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

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Países Principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {liveStats.topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{country.country}</p>
                      <p className="text-xs text-gray-500">{formatNumber(country.visits)} visitas</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{country.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {liveStats.devices.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getDeviceIcon(device.type.toLowerCase())}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{device.type}</p>
                      <p className="text-xs text-gray-500">{formatNumber(device.count)} usuarios</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{device.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Registro de Tráfico
              <span className="text-sm text-gray-500 ml-2">
                Última actualización: {lastUpdate.toLocaleTimeString()}
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por URL, IP, país o ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos los estados</option>
              <option value="success">Éxito (2xx, 3xx)</option>
              <option value="error">Error (4xx, 5xx)</option>
            </select>
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos los dispositivos</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>

          {/* Traffic Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-900">Timestamp</th>
                  <th className="text-left p-4 font-medium text-gray-900">Dispositivo</th>
                  <th className="text-left p-4 font-medium text-gray-900">URL</th>
                  <th className="text-left p-4 font-medium text-gray-900">Ubicación</th>
                  <th className="text-left p-4 font-medium text-gray-900">Estado</th>
                  <th className="text-left p-4 font-medium text-gray-900">Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTraffic.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-gray-900">{entry.timestamp}</p>
                        <p className="text-xs text-gray-500">{entry.ip}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(entry.device)}
                        <div>
                          <p className="text-sm text-gray-900 capitalize">{entry.device}</p>
                          <p className="text-xs text-gray-500">{entry.browser}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-gray-900 truncate max-w-xs">{entry.url}</p>
                        <p className="text-xs text-gray-500">{entry.method}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        {entry.country && (
                          <p className="text-sm text-gray-900">
                            <Globe className="h-3 w-3 inline mr-1" />
                            {entry.country}
                          </p>
                        )}
                        {entry.city && (
                          <p className="text-xs text-gray-500">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {entry.city}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(entry.statusCode)}
                    </td>
                    <td className="p-4">
                      <span className={cn("text-sm font-medium", getResponseTimeColor(entry.responseTime))}>
                        {entry.responseTime}ms
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredTraffic.length)} de {filteredTraffic.length} entradas
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
