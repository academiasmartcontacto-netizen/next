'use client'

import { useState, useEffect } from 'react'
import { 
  Tags, 
  Search, 
  Download, 
  Plus,
  Edit,
  Trash2,
  Package,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon: string
  isActive: boolean
  productsCount: number
  subcategories: Subcategory[]
  createdAt: string
}

interface Subcategory {
  id: string
  name: string
  slug: string
  categoryId: string
  productsCount: number
  isActive: boolean
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Vehículos',
      slug: 'vehiculos',
      description: 'Automóviles, motocicletas y otros vehículos',
      icon: 'car',
      isActive: true,
      productsCount: 156,
      subcategories: [
        { id: '1-1', name: 'Automóviles', slug: 'automoviles', categoryId: '1', productsCount: 89, isActive: true },
        { id: '1-2', name: 'Motocicletas', slug: 'motocicletas', categoryId: '1', productsCount: 45, isActive: true },
        { id: '1-3', name: 'Camiones', slug: 'camiones', categoryId: '1', productsCount: 22, isActive: true }
      ],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Electrónica',
      slug: 'electronica',
      description: 'Dispositivos electrónicos y gadgets',
      icon: 'smartphone',
      isActive: true,
      productsCount: 234,
      subcategories: [
        { id: '2-1', name: 'Celulares', slug: 'celulares', categoryId: '2', productsCount: 98, isActive: true },
        { id: '2-2', name: 'Laptops', slug: 'laptops', categoryId: '2', productsCount: 67, isActive: true },
        { id: '2-3', name: 'Tablets', slug: 'tablets', categoryId: '2', productsCount: 34, isActive: true },
        { id: '2-4', name: 'Accesorios', slug: 'accesorios', categoryId: '2', productsCount: 35, isActive: true }
      ],
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Inmuebles',
      slug: 'inmuebles',
      description: 'Propiedades inmobiliarias',
      icon: 'home',
      isActive: true,
      productsCount: 78,
      subcategories: [
        { id: '3-1', name: 'Casas', slug: 'casas', categoryId: '3', productsCount: 45, isActive: true },
        { id: '3-2', name: 'Departamentos', slug: 'departamentos', categoryId: '3', productsCount: 33, isActive: true }
      ],
      createdAt: '2024-01-15'
    },
    {
      id: '4',
      name: 'Ropa',
      slug: 'ropa',
      description: 'Prendas de vestir y accesorios',
      icon: 'shirt',
      isActive: false,
      productsCount: 0,
      subcategories: [],
      createdAt: '2024-02-20'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['1', '2', '3'])
  const [showInactive, setShowInactive] = useState(false)

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.subcategories.some(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesActive = showInactive || category.isActive
    return matchesSearch && matchesActive
  })

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      'car': '🚗',
      'smartphone': '📱',
      'home': '🏠',
      'shirt': '👔',
      'laptop': '💻',
      'camera': '📷',
      'book': '📚',
      'game': '🎮'
    }
    return iconMap[iconName] || '📁'
  }

  const stats = {
    totalCategories: categories.length,
    activeCategories: categories.filter(c => c.isActive).length,
    totalSubcategories: categories.reduce((sum, c) => sum + c.subcategories.length, 0),
    totalProducts: categories.reduce((sum, c) => sum + c.productsCount, 0)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600">Gestiona las categorías y subcategorías del sistema</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categorías</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
              </div>
              <Tags className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCategories}</p>
              </div>
              <Folder className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subcategorías</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalSubcategories}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
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
                  placeholder="Buscar categorías o subcategorías..."
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
                Mostrar inactivas
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Category Header */}
              <div 
                className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => toggleCategoryExpansion(category.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {getIcon(category.icon)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <Badge className={cn(
                        "bg-green-100 text-green-800",
                        !category.isActive && "bg-gray-100 text-gray-800"
                      )}>
                        {category.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Slug: /{category.slug}</span>
                      <span>•</span>
                      <span>{category.productsCount} productos</span>
                      <span>•</span>
                      <span>{category.subcategories.length} subcategorías</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Subcategories */}
              {expandedCategories.includes(category.id) && category.subcategories.length > 0 && (
                <div className="border-t bg-gray-50">
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Subcategorías</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {category.subcategories.map((subcategory) => (
                        <div 
                          key={subcategory.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                              <BarChart3 className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{subcategory.name}</p>
                              <p className="text-xs text-gray-500">/{subcategory.slug}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={cn(
                              "text-xs",
                              subcategory.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            )}>
                              {subcategory.productsCount} productos
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Tags className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron categorías</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primera categoría'}
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Crear Categoría
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
