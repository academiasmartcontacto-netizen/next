'use client'

import { useState, useEffect } from 'react'
import { 
  Store, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  ShoppingCart,
  Star,
  TrendingUp,
  Package,
  Ban,
  AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/format'

interface StoreData {
  id: string
  name: string
  slug: string
  owner: string
  ownerEmail: string
  status: 'active' | 'inactive' | 'suspended'
  productsCount: number
  views: number
  rating: string
  createdAt: string
  lastActivity: string
  reports: number
  hasLogo: boolean
  domain: string
  isPublished: boolean
  phone?: string
  whatsapp?: string
  emailContacto?: string
  direccion?: string
  descripcion?: string
  slogan?: string
  colorPrimario?: string
  navbarColor?: string
  mostrarLogo?: boolean
  mostrarNombre?: boolean
  bannerImagen?: string
  mostrarBanner?: boolean
}

export default function AdminStores() {
  const [stores, setStores] = useState<StoreData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStores, setSelectedStores] = useState<string[]>([])

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/stores')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setStores(data.stores)
        console.log('Stores loaded successfully:', data.stores.length)
      } else {
        throw new Error(data.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error fetching stores:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      setStores([])
    } finally {
      setLoading(false)
    }
  }

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || store.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStores = filteredStores.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Activa</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactiva</Badge>
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspendida</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocida</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive':
        return <Ban className="h-4 w-4 text-gray-500" />
      case 'suspended':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Store className="h-4 w-4 text-gray-500" />
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        )}
      />
    ))
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStores(paginatedStores.map(store => store.id))
    } else {
      setSelectedStores([])
    }
  }

  const handleSelectStore = (storeId: string, checked: boolean) => {
    if (checked) {
      setSelectedStores([...selectedStores, storeId])
    } else {
      setSelectedStores(selectedStores.filter(id => id !== storeId))
    }
  }

  const handleDeleteStore = async (storeId: string, storeName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la tienda "${storeName}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/stores?id=${storeId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Eliminar del estado local
        setStores(stores.filter(store => store.id !== storeId))
        // Eliminar de la selección si estaba seleccionada
        setSelectedStores(selectedStores.filter(id => id !== storeId))
        alert('Tienda eliminada exitosamente')
      } else {
        throw new Error(data.error || 'Error al eliminar la tienda')
      }
    } catch (error) {
      console.error('Error deleting store:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      alert(`Error al eliminar la tienda: ${errorMessage}`)
    }
  }

  const handleViewStore = (storeLink: string) => {
    window.open(`/tienda/${storeLink}`, '_blank')
  }

  const handleEditStore = (storeId: string) => {
    // TODO: Implementar edición de tienda
    alert('Función de edición próximamente')
  }

  const stats = {
    total: stores.length,
    active: stores.filter(s => s.status === 'active').length,
    inactive: stores.filter(s => s.status === 'inactive').length,
    suspended: stores.filter(s => s.status === 'suspended').length,
    totalProducts: stores.reduce((sum, s) => sum + s.productsCount, 0),
    totalViews: stores.reduce((sum, s) => sum + s.views, 0),
    avgRating: stores.length > 0 
      ? (stores.reduce((sum, s) => sum + parseFloat(s.rating), 0) / stores.length).toFixed(1)
      : '0.0'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tiendas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">Error al cargar las tiendas</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchStores} className="bg-orange-500 hover:bg-orange-600">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Tiendas</h1>
          <p className="text-gray-600">Administra todas las tiendas virtuales del sistema</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Tienda
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tiendas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Store className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspendidas</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.avgRating} ⭐</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-xl font-bold text-gray-900">{formatNumber(stats.totalProducts)}</p>
              </div>
              <Package className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vistas</p>
                <p className="text-xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
              </div>
              <Eye className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sin Logo</p>
                <p className="text-xl font-bold text-orange-600">
                  {stores.filter(s => !s.hasLogo).length}
                </p>
              </div>
              <Store className="h-6 w-6 text-orange-500" />
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
                  placeholder="Buscar por nombre, propietario o slug..."
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
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
              <option value="suspended">Suspendidas</option>
            </select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stores Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Tiendas</CardTitle>
            <div className="flex items-center space-x-2">
              {selectedStores.length > 0 && (
                <Button variant="outline" size="sm">
                  Acciones Masivas ({selectedStores.length})
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
                  <th className="text-left p-4 font-medium text-gray-900">Tienda</th>
                  <th className="text-left p-4 font-medium text-gray-900">Propietario</th>
                  <th className="text-left p-4 font-medium text-gray-900">Estado</th>
                  <th className="text-left p-4 font-medium text-gray-900">Estadísticas</th>
                  <th className="text-left p-4 font-medium text-gray-900">Rating</th>
                  <th className="text-left p-4 font-medium text-gray-900">Última Actividad</th>
                  <th className="text-left p-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStores.map((store) => (
                  <tr key={store.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedStores.includes(store.id)}
                        onChange={(e) => handleSelectStore(store.id, e.target.checked)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          {store.hasLogo ? (
                            <Store className="h-6 w-6 text-gray-400" />
                          ) : (
                            <Store className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{store.name}</p>
                          <p className="text-sm text-gray-500">/{store.slug}</p>
                          {store.domain && (
                            <p className="text-xs text-blue-600">{store.domain}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{store.owner}</p>
                        <p className="text-sm text-gray-500">{store.ownerEmail}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(store.status)}
                        {getStatusBadge(store.status)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Package className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{store.productsCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{store.views}</span>
                          </div>
                        </div>
                        {store.reports > 0 && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3 text-red-400" />
                            <span className="text-red-600 text-xs">{store.reports} reportes</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        {getRatingStars(parseFloat(store.rating))}
                        <span className="text-sm text-gray-600 ml-1">({store.rating})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-gray-900">{store.lastActivity}</p>
                        <p className="text-xs text-gray-500">Creada: {store.createdAt}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewStore(store.slug)}
                          title="Ver tienda"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditStore(store.id)}
                          title="Editar tienda"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteStore(store.id, store.name)}
                          title="Eliminar tienda"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
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
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredStores.length)} de {filteredStores.length} tiendas
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
