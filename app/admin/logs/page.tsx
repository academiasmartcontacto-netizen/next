'use client'

import { useState, useEffect } from 'react'
import { 
  List, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  RefreshCw,
  User,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  FileText,
  Package,
  Store,
  Settings
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface LogEntry {
  id: string
  action: string
  table: string
  recordId?: string
  details: string
  adminId: string
  adminName: string
  ip: string
  timestamp: string
  severity: 'info' | 'warning' | 'error' | 'success'
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      action: 'crear_usuario',
      table: 'users',
      recordId: 'user-123',
      details: 'Nuevo usuario registrado: Juan Pérez (juan.perez@email.com)',
      adminId: 'admin-1',
      adminName: 'Admin System',
      ip: '192.168.1.100',
      timestamp: '2024-03-24 14:30:15',
      severity: 'info'
    },
    {
      id: '2',
      action: 'eliminar_producto',
      table: 'products',
      recordId: 'prod-456',
      details: 'Producto eliminado: "iPhone 12" por violación de términos',
      adminId: 'admin-1',
      adminName: 'Admin System',
      ip: '192.168.1.100',
      timestamp: '2024-03-24 13:45:22',
      severity: 'warning'
    },
    {
      id: '3',
      action: 'banear_usuario',
      table: 'users',
      recordId: 'user-789',
      details: 'Usuario baneado: María García (maria.garcia@email.com) - Motivo: Spam masivo',
      adminId: 'admin-1',
      adminName: 'Admin System',
      ip: '192.168.1.100',
      timestamp: '2024-03-24 12:15:33',
      severity: 'error'
    },
    {
      id: '4',
      action: 'actualizar_configuracion',
      table: 'settings',
      details: 'Configuración actualizada: Modo mantenimiento activado',
      adminId: 'admin-1',
      adminName: 'Admin System',
      ip: '192.168.1.100',
      timestamp: '2024-03-24 11:30:45',
      severity: 'info'
    },
    {
      id: '5',
      action: 'resolver_reporte',
      table: 'reports',
      recordId: 'report-012',
      details: 'Reporte resuelto: ID 012 - Producto "Laptop ASUS" - Estado: Resuelto',
      adminId: 'admin-1',
      adminName: 'Admin System',
      ip: '192.168.1.100',
      timestamp: '2024-03-24 10:20:18',
      severity: 'success'
    },
    {
      id: '6',
      action: 'backup_completado',
      table: 'system',
      details: 'Backup automático completado exitosamente - Tamaño: 2.3GB',
      adminId: 'system',
      adminName: 'System',
      ip: 'localhost',
      timestamp: '2024-03-24 02:00:00',
      severity: 'success'
    },
    {
      id: '7',
      action: 'error_login',
      table: 'auth',
      details: 'Intento de login fallido: admin@donebolivia.com - IP: 45.123.67.89',
      adminId: 'system',
      adminName: 'System',
      ip: '45.123.67.89',
      timestamp: '2024-03-23 23:45:12',
      severity: 'warning'
    },
    {
      id: '8',
      action: 'crear_tienda',
      table: 'stores',
      recordId: 'store-345',
      details: 'Nueva tienda creada: "Tech Store" - Propietario: Juan Pérez',
      adminId: 'admin-1',
      adminName: 'Admin System',
      ip: '192.168.1.100',
      timestamp: '2024-03-23 22:15:30',
      severity: 'info'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [tableFilter, setTableFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLogs, setSelectedLogs] = useState<string[]>([])

  const actions = [
    'crear_usuario', 'eliminar_usuario', 'actualizar_usuario', 'banear_usuario',
    'crear_producto', 'eliminar_producto', 'actualizar_producto',
    'crear_tienda', 'eliminar_tienda', 'actualizar_tienda',
    'resolver_reporte', 'crear_reporte', 'eliminar_reporte',
    'actualizar_configuracion', 'backup_completado', 'error_login'
  ]

  const tables = ['users', 'products', 'stores', 'reports', 'settings', 'auth', 'system']

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ip.includes(searchTerm)
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesTable = tableFilter === 'all' || log.table === tableFilter
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter
    return matchesSearch && matchesAction && matchesTable && matchesSeverity
  })

  const itemsPerPage = 20
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage)

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Advertencia</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Éxito</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <List className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes('usuario')) return <User className="h-4 w-4 text-blue-500" />
    if (action.includes('producto')) return <Package className="h-4 w-4 text-green-500" />
    if (action.includes('tienda')) return <Store className="h-4 w-4 text-purple-500" />
    if (action.includes('reporte')) return <FileText className="h-4 w-4 text-orange-500" />
    if (action.includes('configuracion')) return <Settings className="h-4 w-4 text-gray-500" />
    if (action.includes('backup')) return <Database className="h-4 w-4 text-indigo-500" />
    if (action.includes('login')) return <Shield className="h-4 w-4 text-red-500" />
    return <List className="h-4 w-4 text-gray-500" />
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLogs(paginatedLogs.map(log => log.id))
    } else {
      setSelectedLogs([])
    }
  }

  const handleSelectLog = (logId: string, checked: boolean) => {
    if (checked) {
      setSelectedLogs([...selectedLogs, logId])
    } else {
      setSelectedLogs(selectedLogs.filter(id => id !== logId))
    }
  }

  const stats = {
    total: logs.length,
    info: logs.filter(l => l.severity === 'info').length,
    warning: logs.filter(l => l.severity === 'warning').length,
    error: logs.filter(l => l.severity === 'error').length,
    success: logs.filter(l => l.severity === 'success').length,
    today: logs.filter(l => l.timestamp.startsWith('2024-03-24')).length
  }

  const handleRefresh = () => {
    // Simulate refresh
    console.log('Refreshing logs...')
  }

  const handleExport = () => {
    // Simulate export
    console.log('Exporting logs...')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Logs de Actividad</h1>
          <p className="text-gray-600">Registro de acciones del sistema</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <List className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Advertencias</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errores</p>
                <p className="text-2xl font-bold text-red-600">{stats.error}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoy</p>
                <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

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
                  placeholder="Buscar por acción, detalles, admin o IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todas las acciones</option>
              {actions.map(action => (
                <option key={action} value={action}>
                  {action.replace('_', ' ').charAt(0).toUpperCase() + action.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>
            <select
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todas las tablas</option>
              {tables.map(table => (
                <option key={table} value={table}>
                  {table.charAt(0).toUpperCase() + table.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todas las severidades</option>
              <option value="info">Info</option>
              <option value="warning">Advertencia</option>
              <option value="error">Error</option>
              <option value="success">Éxito</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Registro de Actividad</CardTitle>
            <div className="flex items-center space-x-2">
              {selectedLogs.length > 0 && (
                <Button variant="outline" size="sm">
                  Acciones Masivas ({selectedLogs.length})
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
                  <th className="text-left p-4 font-medium text-gray-900">Timestamp</th>
                  <th className="text-left p-4 font-medium text-gray-900">Acción</th>
                  <th className="text-left p-4 font-medium text-gray-900">Detalles</th>
                  <th className="text-left p-4 font-medium text-gray-900">Admin</th>
                  <th className="text-left p-4 font-medium text-gray-900">IP</th>
                  <th className="text-left p-4 font-medium text-gray-900">Severidad</th>
                  <th className="text-left p-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedLogs.includes(log.id)}
                        onChange={(e) => handleSelectLog(log.id, e.target.checked)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-gray-900">{log.timestamp}</p>
                        <p className="text-xs text-gray-500">ID: {log.id}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getActionIcon(log.action)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {log.action.replace('_', ' ').charAt(0).toUpperCase() + log.action.replace('_', ' ').slice(1)}
                          </p>
                          <p className="text-xs text-gray-500">{log.table}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 truncate">{log.details}</p>
                        {log.recordId && (
                          <p className="text-xs text-gray-500">ID: {log.recordId}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-gray-900">{log.adminName}</p>
                        <p className="text-xs text-gray-500">{log.adminId}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-900 font-mono">{log.ip}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getSeverityIcon(log.severity)}
                        {getSeverityBadge(log.severity)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
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
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredLogs.length)} de {filteredLogs.length} logs
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
