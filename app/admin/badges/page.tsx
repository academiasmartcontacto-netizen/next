'use client'

import { useState, useEffect } from 'react'
import { 
  List, 
  Search, 
  Download, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Award,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Package,
  ChevronUp,
  ChevronDown,
  GripVertical
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface BadgeItem {
  id: string
  name: string
  description: string
  icon: string
  color: string
  backgroundColor: string
  isActive: boolean
  order: number
  productsCount: number
  createdAt: string
}

export default function AdminBadges() {
  const [badges, setBadges] = useState<BadgeItem[]>([
    {
      id: '1',
      name: 'Nuevo',
      description: 'Producto recién publicado',
      icon: 'star',
      color: '#10b981',
      backgroundColor: '#d1fae5',
      isActive: true,
      order: 1,
      productsCount: 45,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Oferta',
      description: 'Producto en descuento',
      icon: 'tag',
      color: '#f59e0b',
      backgroundColor: '#fef3c7',
      isActive: true,
      order: 2,
      productsCount: 23,
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Popular',
      description: 'Producto con muchas visitas',
      icon: 'trending-up',
      color: '#3b82f6',
      backgroundColor: '#dbeafe',
      isActive: true,
      order: 3,
      productsCount: 67,
      createdAt: '2024-01-15'
    },
    {
      id: '4',
      name: 'Premium',
      description: 'Producto de alta calidad',
      icon: 'award',
      color: '#8b5cf6',
      backgroundColor: '#ede9fe',
      isActive: true,
      order: 4,
      productsCount: 12,
      createdAt: '2024-01-15'
    },
    {
      id: '5',
      name: 'Últimas Unidades',
      description: 'Stock bajo',
      icon: 'alert-triangle',
      color: '#ef4444',
      backgroundColor: '#fee2e2',
      isActive: true,
      order: 5,
      productsCount: 8,
      createdAt: '2024-02-20'
    },
    {
      id: '6',
      name: 'Envío Gratis',
      description: 'Envío sin costo',
      icon: 'zap',
      color: '#06b6d4',
      backgroundColor: '#cffafe',
      isActive: false,
      order: 6,
      productsCount: 0,
      createdAt: '2024-02-20'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [draggedBadge, setDraggedBadge] = useState<string | null>(null)

  const filteredBadges = badges.filter(badge => {
    const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         badge.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesActive = showInactive || badge.isActive
    return matchesSearch && matchesActive
  })

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'star': <Star className="h-4 w-4" />,
      'tag': <List className="h-4 w-4" />,
      'trending-up': <TrendingUp className="h-4 w-4" />,
      'award': <Award className="h-4 w-4" />,
      'alert-triangle': <AlertTriangle className="h-4 w-4" />,
      'zap': <Zap className="h-4 w-4" />,
      'check': <CheckCircle className="h-4 w-4" />,
      'package': <Package className="h-4 w-4" />
    }
    return iconMap[iconName] || <List className="h-4 w-4" />
  }

  const handleDragStart = (badgeId: string) => {
    setDraggedBadge(badgeId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetId: string) => {
    if (!draggedBadge || draggedBadge === targetId) return

    const draggedIndex = badges.findIndex(b => b.id === draggedBadge)
    const targetIndex = badges.findIndex(b => b.id === targetId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newBadges = [...badges]
      const [draggedItem] = newBadges.splice(draggedIndex, 1)
      newBadges.splice(targetIndex, 0, draggedItem)

      // Update order
      const updatedBadges = newBadges.map((badge, index) => ({
        ...badge,
        order: index + 1
      }))

      setBadges(updatedBadges)
    }

    setDraggedBadge(null)
  }

  const toggleBadgeStatus = (badgeId: string) => {
    setBadges(prev => prev.map(badge => 
      badge.id === badgeId ? { ...badge, isActive: !badge.isActive } : badge
    ))
  }

  const moveBadge = (badgeId: string, direction: 'up' | 'down') => {
    const index = badges.findIndex(b => b.id === badgeId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= badges.length) return

    const newBadges = [...badges]
    const [movedBadge] = newBadges.splice(index, 1)
    newBadges.splice(newIndex, 0, movedBadge)

    // Update order
    const updatedBadges = newBadges.map((badge, index) => ({
      ...badge,
      order: index + 1
    }))

    setBadges(updatedBadges)
  }

  const stats = {
    totalBadges: badges.length,
    activeBadges: badges.filter(b => b.isActive).length,
    totalProducts: badges.reduce((sum, b) => sum + b.productsCount, 0),
    avgProductsPerBadge: Math.round(badges.reduce((sum, b) => sum + b.productsCount, 0) / badges.length)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Badges</h1>
          <p className="text-gray-600">Gestiona las insignias del sistema</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Badge
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Badges</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBadges}</p>
              </div>
              <List className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeBadges}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productos con Badges</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio por Badge</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgProductsPerBadge}</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Búsqueda y Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar badges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showInactive"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="showInactive" className="text-sm text-gray-700">
                Mostrar inactivos
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges List */}
      <div className="space-y-4">
        {filteredBadges.map((badge, index) => (
          <Card 
            key={badge.id} 
            className={cn(
              "transition-all duration-200",
              draggedBadge === badge.id && "opacity-50"
            )}
          >
            <CardContent className="p-0">
              <div 
                className="flex items-center justify-between p-4"
                draggable
                onDragStart={() => handleDragStart(badge.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(badge.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="cursor-move">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  {/* Badge Preview */}
                  <div className="flex items-center space-x-3">
                    <div 
                      className="px-3 py-1 rounded-full flex items-center space-x-1 border-2"
                      style={{ 
                        backgroundColor: badge.backgroundColor, 
                        borderColor: badge.color,
                        color: badge.color
                      }}
                    >
                      {getIcon(badge.icon)}
                      <span className="text-sm font-medium">{badge.name}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{badge.name}</h3>
                      <Badge className={cn(
                        "bg-green-100 text-green-800",
                        !badge.isActive && "bg-gray-100 text-gray-800"
                      )}>
                        {badge.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Orden: {badge.order}</span>
                      <span>•</span>
                      <span>{badge.productsCount} productos</span>
                      <span>•</span>
                      <span>Creado: {badge.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Order Controls */}
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveBadge(badge.id, 'up')}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveBadge(badge.id, 'down')}
                      disabled={index === filteredBadges.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBadgeStatus(badge.id)}
                    className={cn(
                      badge.isActive ? "text-green-600 hover:text-green-700" : "text-gray-600 hover:text-gray-700"
                    )}
                  >
                    {badge.isActive ? 'Desactivar' : 'Activar'}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron badges</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primer badge'}
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Crear Badge
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instrucciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Arrastrar y soltar</strong> para reordenar los badges</p>
            <p>• Usa las <strong>flechas arriba/abajo</strong> para mover individualmente</p>
            <p>• Los badges <strong>activos</strong> se mostrarán en los productos</p>
            <p>• El <strong>orden</strong> determina la prioridad de visualización</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
