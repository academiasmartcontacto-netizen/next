'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Eye,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Ban,
  Trash2,
  ExternalLink,
  Package,
  Store
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Report {
  id: string
  type: 'product' | 'store'
  targetId: string
  targetName: string
  targetOwner: string
  reason: string
  description: string
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
  reportedBy: string
  reportedAt: string
  reviewedBy?: string
  reviewedAt?: string
  resolution?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      type: 'product',
      targetId: 'prod-123',
      targetName: 'iPhone 13 Pro Max',
      targetOwner: 'Juan Pérez',
      reason: 'producto_falso',
      description: 'El producto anunciado como nuevo es claramente usado, tiene rayones y desgaste visible.',
      status: 'pending',
      reportedBy: 'María García',
      reportedAt: '2024-03-24 10:30',
      priority: 'high'
    },
    {
      id: '2',
      type: 'store',
      targetId: 'store-456',
      targetName: 'Tech Store',
      targetOwner: 'Carlos Rodríguez',
      reason: 'contenido_inapropiado',
      description: 'La tienda contiene imágenes y descripciones inapropiadas que violan los términos del servicio.',
      status: 'reviewing',
      reportedBy: 'Ana Martínez',
      reportedAt: '2024-03-24 09:15',
      reviewedBy: 'Admin',
      reviewedAt: '2024-03-24 11:00',
      priority: 'critical'
    },
    {
      id: '3',
      type: 'product',
      targetId: 'prod-789',
      targetName: 'Laptop Gaming ASUS ROG',
      targetOwner: 'María García',
      reason: 'precio_inflado',
      description: 'El precio es significativamente más alto que el valor de mercado del producto.',
      status: 'resolved',
      reportedBy: 'Pedro López',
      reportedAt: '2024-03-23 16:45',
      reviewedBy: 'Admin',
      reviewedAt: '2024-03-24 08:30',
      resolution: 'Se contactó al vendedor y ajustó el precio a un valor más razonable.',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'product',
      targetId: 'prod-012',
      targetName: 'Samsung Galaxy Watch',
      targetOwner: 'Ana Martínez',
      reason: 'informacion_falsa',
      description: 'Las especificaciones del producto no coinciden con las reales.',
      status: 'dismissed',
      reportedBy: 'Juan Pérez',
      reportedAt: '2024-03-23 14:20',
      reviewedBy: 'Admin',
      reviewedAt: '2024-03-23 18:00',
      resolution: 'No se encontró evidencia de información falsa después de la revisión.',
      priority: 'low'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  const reportReasons = {
    producto_falso: 'Producto Falso',
    contenido_inapropiado: 'Contenido Inapropiado',
    precio_inflado: 'Precio Inflado',
    informacion_falsa: 'Información Falsa',
    spam: 'Spam',
    estafa: 'Estafa',
    otro: 'Otro'
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.targetOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    const matchesType = typeFilter === 'all' || report.type === typeFilter
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case 'reviewing':
        return <Badge className="bg-blue-100 text-blue-800">En Revisión</Badge>
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resuelto</Badge>
      case 'dismissed':
        return <Badge className="bg-gray-100 text-gray-800">Descartado</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'reviewing':
        return <Eye className="h-4 w-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'dismissed':
        return <X className="h-4 w-4 text-gray-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Crítico</Badge>
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">Alto</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medio</Badge>
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Bajo</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'store':
        return <Store className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(paginatedReports.map(report => report.id))
    } else {
      setSelectedReports([])
    }
  }

  const handleSelectReport = (reportId: string, checked: boolean) => {
    if (checked) {
      setSelectedReports([...selectedReports, reportId])
    } else {
      setSelectedReports(selectedReports.filter(id => id !== reportId))
    }
  }

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    reviewing: reports.filter(r => r.status === 'reviewing').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    dismissed: reports.filter(r => r.status === 'dismissed').length,
    critical: reports.filter(r => r.priority === 'critical').length,
    high: reports.filter(r => r.priority === 'high').length
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-600">Gestiona los reportes de productos y tiendas</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Download className="h-4 w-4 mr-2" />
          Exportar Reportes
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reportes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Revisión</p>
                <p className="text-2xl font-bold text-blue-600">{stats.reviewing}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Críticos</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Alert */}
      {stats.critical > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <p className="font-medium text-red-900">
                  {stats.critical} reporte{stats.critical > 1 ? 's' : ''} crítico{stats.critical > 1 ? 's' : ''} requieren atención inmediata
                </p>
                <p className="text-sm text-red-700">
                  Estos reportes tienen prioridad máxima y deben ser revisados urgentemente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, propietario, reportante o descripción..."
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
              <option value="pending">Pendientes</option>
              <option value="reviewing">En Revisión</option>
              <option value="resolved">Resueltos</option>
              <option value="dismissed">Descartados</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="product">Productos</option>
              <option value="store">Tiendas</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todas las prioridades</option>
              <option value="critical">Crítico</option>
              <option value="high">Alto</option>
              <option value="medium">Medio</option>
              <option value="low">Bajo</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Reportes</CardTitle>
            <div className="flex items-center space-x-2">
              {selectedReports.length > 0 && (
                <Button variant="outline" size="sm">
                  Acciones Masivas ({selectedReports.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">Reporte</th>
                  <th className="text-left p-4 font-medium text-gray-900">Motivo</th>
                  <th className="text-left p-4 font-medium text-gray-900">Reportado por</th>
                  <th className="text-left p-4 font-medium text-gray-900">Prioridad</th>
                  <th className="text-left p-4 font-medium text-gray-900">Estado</th>
                  <th className="text-left p-4 font-medium text-gray-900">Fecha</th>
                  <th className="text-left p-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={(e) => handleSelectReport(report.id, e.target.checked)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getTypeIcon(report.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{report.targetName}</p>
                          <p className="text-sm text-gray-500">{report.targetOwner}</p>
                          <p className="text-xs text-gray-400">ID: {report.targetId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {reportReasons[report.reason] || report.reason}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {report.description}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-gray-900">{report.reportedBy}</p>
                        <p className="text-xs text-gray-500">{report.reportedAt}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {getPriorityBadge(report.priority)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(report.status)}
                        {getStatusBadge(report.status)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-gray-900">{report.reportedAt}</p>
                        {report.reviewedAt && (
                          <p className="text-xs text-gray-500">Revisado: {report.reviewedAt}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredReports.length)} de {filteredReports.length} reportes
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
