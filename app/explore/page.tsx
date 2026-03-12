'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Heart, 
  Eye, 
  MapPin, 
  Star, 
  TrendingUp,
  Calendar,
  User,
  Store
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MinimalButton } from '@/components/ui/minimal-button'
import { MinimalInput } from '@/components/ui/minimal-input'
import { MinimalSelect } from '@/components/ui/minimal-select'
import Navbar from '@/components/layout/navbar'

interface ExploreItem {
  id: string
  title: string
  description: string
  type: 'store' | 'publication' | 'course' | 'service'
  author: {
    name: string
    avatar?: string
  }
  category: string
  rating: number
  reviews: number
  location?: string
  price?: number
  thumbnail?: string
  tags: string[]
  featured?: boolean
}

export default function ExplorePage() {
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<ExploreItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'store' | 'publication' | 'course' | 'service'>('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const router = useRouter()

  useEffect(() => {
    fetchUser()
    fetchItems()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      // User not logged in, continue with explore
    }
  }

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockItems: ExploreItem[] = [
        {
          id: '1',
          title: 'Tech Store Bolivia',
          description: 'Tienda especializada en tecnología y gadgets con los mejores precios del mercado.',
          type: 'store',
          author: {
            name: 'Carlos Rodriguez',
            avatar: '/avatars/carlos.jpg'
          },
          category: 'Tecnología',
          rating: 4.8,
          reviews: 234,
          location: 'La Paz, Bolivia',
          thumbnail: '/images/tech-store.jpg',
          tags: ['Electrónica', 'Gadgets', 'Computación'],
          featured: true
        },
        {
          id: '2',
          title: 'Curso Avanzado de React',
          description: 'Domina React con proyectos reales y las mejores prácticas del mercado.',
          type: 'course',
          author: {
            name: 'Maria Fernandez',
            avatar: '/avatars/maria.jpg'
          },
          category: 'Desarrollo Web',
          rating: 4.9,
          reviews: 156,
          price: 299,
          thumbnail: '/images/react-course.jpg',
          tags: ['React', 'JavaScript', 'Frontend'],
          featured: true
        },
        {
          id: '3',
          title: 'Guía de Marketing Digital',
          description: 'Aprende las estrategias de marketing digital que funcionan en 2024.',
          type: 'publication',
          author: {
            name: 'Luis Martinez',
            avatar: '/avatars/luis.jpg'
          },
          category: 'Marketing',
          rating: 4.6,
          reviews: 89,
          thumbnail: '/images/marketing-guide.jpg',
          tags: ['Marketing', 'Digital', 'SEO']
        },
        {
          id: '4',
          title: 'Consultoría SEO Empresarial',
          description: 'Optimiza tu sitio web para los motores de búsqueda con nuestros expertos.',
          type: 'service',
          author: {
            name: 'SEO Bolivia',
            avatar: '/avatars/seo.jpg'
          },
          category: 'Marketing',
          rating: 4.7,
          reviews: 67,
          location: 'Santa Cruz, Bolivia',
          price: 1500,
          thumbnail: '/images/seo-service.jpg',
          tags: ['SEO', 'Consultoría', 'Marketing']
        }
      ]
      
      setItems(mockItems)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesType && matchesCategory
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'store': return 'bg-purple-100 text-purple-700'
      case 'course': return 'bg-green-100 text-green-700'
      case 'publication': return 'bg-blue-100 text-blue-700'
      case 'service': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'store': return 'Tienda'
      case 'course': return 'Curso'
      case 'publication': return 'Publicación'
      case 'service': return 'Servicio'
      default: return type
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'store': return <Store className="w-4 h-4" />
      case 'course': return <Star className="w-4 h-4" />
      case 'publication': return <Eye className="w-4 h-4" />
      case 'service': return <Heart className="w-4 h-4" />
      default: return <Eye className="w-4 h-4" />
    }
  }

  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'Tecnología', label: 'Tecnología' },
    { value: 'Desarrollo Web', label: 'Desarrollo Web' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Diseño', label: 'Diseño' },
    { value: 'Educación', label: 'Educación' },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Explorar</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre tiendas, cursos, publicaciones y servicios de la comunidad
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MinimalInput
                label=""
                placeholder="Buscar tiendas, cursos, publicaciones..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <MinimalSelect
                label=""
                placeholder="Tipo"
                value={filterType}
                onValueChange={setFilterType}
                options={[
                  { value: 'all', label: 'Todos' },
                  { value: 'store', label: 'Tiendas' },
                  { value: 'course', label: 'Cursos' },
                  { value: 'publication', label: 'Publicaciones' },
                  { value: 'service', label: 'Servicios' },
                ]}
              />
              
              <MinimalSelect
                label=""
                placeholder="Categoría"
                value={filterCategory}
                onValueChange={setFilterCategory}
                options={categories}
              />
            </div>
          </div>
        </div>

        {/* Featured Items */}
        {filteredItems.filter(item => item.featured).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              Destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.filter(item => item.featured).map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Thumbnail */}
                  {item.thumbnail && (
                    <div className="aspect-video bg-gray-100 relative">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                          getTypeColor(item.type)
                        )}>
                          {getTypeIcon(item.type)}
                          {getTypeText(item.type)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          <Link 
                            href={`/${item.type}s/${item.id}`}
                            className="hover:text-orange-600 transition-colors"
                          >
                            {item.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Author */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {item.author.avatar ? (
                          <img 
                            src={item.author.avatar} 
                            alt={item.author.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.author.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "w-4 h-4",
                              i < Math.floor(item.rating) 
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {item.rating} ({item.reviews} reseñas)
                      </span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {item.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                          </span>
                        )}
                        {item.price && (
                          <span className="font-semibold text-orange-600">
                            ${item.price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <MinimalButton variant="outline" size="sm">
                          <Heart className="w-4 h-4" />
                        </MinimalButton>
                        <MinimalButton size="sm">
                          Ver más
                        </MinimalButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Items */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {filterType === 'all' ? 'Todos los Items' : `${getTypeText(filterType)}s`}
          </h2>
          
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron resultados' : 'No hay items disponibles'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Pronto habrá nuevo contenido disponible'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Thumbnail */}
                  {item.thumbnail && (
                    <div className="aspect-video bg-gray-100 relative">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                          getTypeColor(item.type)
                        )}>
                          {getTypeIcon(item.type)}
                          {getTypeText(item.type)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link 
                        href={`/${item.type}s/${item.id}`}
                        className="hover:text-orange-600 transition-colors text-sm"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "w-3 h-3",
                              i < Math.floor(item.rating) 
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        {item.rating} ({item.reviews})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {item.price && (
                        <span className="font-semibold text-orange-600 text-sm">
                          ${item.price}
                        </span>
                      )}
                      <MinimalButton variant="outline" size="sm">
                        <Heart className="w-3 h-3" />
                      </MinimalButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
