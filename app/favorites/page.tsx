'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Heart, 
  Search, 
  Filter, 
  ExternalLink, 
  MoreVertical,
  Calendar,
  User,
  Tag,
  BookmarkIcon as Bookmark
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MinimalButton } from '@/components/ui/minimal-button'
import { MinimalInput } from '@/components/ui/minimal-input'
import Navbar from '@/components/layout/navbar'

interface FavoriteItem {
  id: string
  title: string
  description: string
  type: 'publication' | 'product' | 'course' | 'service'
  author: {
    name: string
    avatar?: string
  }
  category: string
  tags: string[]
  createdAt: string
  url: string
  thumbnail?: string
}

export default function FavoritesPage() {
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'publication' | 'product' | 'course' | 'service'>('all')
  const router = useRouter()

  useEffect(() => {
    fetchUser()
    fetchFavorites()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else if (response.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchFavorites = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockFavorites: FavoriteItem[] = [
        {
          id: '1',
          title: 'Guía completa de React Hooks',
          description: 'Aprende a usar React Hooks como un profesional con ejemplos prácticos y proyectos reales.',
          type: 'publication',
          author: {
            name: 'Juan Pérez',
            avatar: '/avatars/juan.jpg'
          },
          category: 'Desarrollo Web',
          tags: ['React', 'JavaScript', 'Frontend'],
          createdAt: '2024-01-15',
          url: '/publications/1',
          thumbnail: '/images/react-hooks.jpg'
        },
        {
          id: '2',
          title: 'Curso de Diseño UX/UI',
          description: 'Transforma tus ideas en productos digitales con este curso completo de diseño.',
          type: 'course',
          author: {
            name: 'María González',
            avatar: '/avatars/maria.jpg'
          },
          category: 'Diseño',
          tags: ['UX', 'UI', 'Figma', 'Design'],
          createdAt: '2024-01-10',
          url: '/courses/1',
          thumbnail: '/images/ux-course.jpg'
        },
        {
          id: '3',
          title: 'Plantilla Premium para E-commerce',
          description: 'Plantilla profesional lista para usar en tu tienda online con todas las funcionalidades.',
          type: 'product',
          author: {
            name: 'DevStudio',
            avatar: '/avatars/devstudio.jpg'
          },
          category: 'Templates',
          tags: ['E-commerce', 'React', 'Premium'],
          createdAt: '2024-01-08',
          url: '/products/1',
          thumbnail: '/images/ecommerce-template.jpg'
        },
        {
          id: '4',
          title: 'Servicio de Consultoría SEO',
          description: 'Mejora el posicionamiento de tu sitio web con nuestra consultoría especializada.',
          type: 'service',
          author: {
            name: 'SEO Experts',
            avatar: '/avatars/seoexperts.jpg'
          },
          category: 'Marketing',
          tags: ['SEO', 'Marketing', 'Consultoría'],
          createdAt: '2024-01-05',
          url: '/services/1',
          thumbnail: '/images/seo-service.jpg'
        }
      ]
      
      setFavorites(mockFavorites)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFavorites = favorites.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesFilter
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'publication': return 'bg-blue-100 text-blue-700'
      case 'course': return 'bg-green-100 text-green-700'
      case 'product': return 'bg-purple-100 text-purple-700'
      case 'service': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'publication': return 'Publicación'
      case 'course': return 'Curso'
      case 'product': return 'Producto'
      case 'service': return 'Servicio'
      default: return type
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'publication': return <Bookmark className="w-4 h-4" />
      case 'course': return <Tag className="w-4 h-4" />
      case 'product': return <Heart className="w-4 h-4" />
      case 'service': return <User className="w-4 h-4" />
      default: return <Bookmark className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center max-w-md w-full">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tus favoritos</p>
          <MinimalButton asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </MinimalButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Favoritos</h1>
              <p className="text-gray-600">Contenido que has guardado para consultar más tarde</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Favoritos</p>
                <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Publicaciones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {favorites.filter(f => f.type === 'publication').length}
                </p>
              </div>
              <Bookmark className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cursos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {favorites.filter(f => f.type === 'course').length}
                </p>
              </div>
              <Tag className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Productos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {favorites.filter(f => f.type === 'product').length}
                </p>
              </div>
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MinimalInput
                label=""
                placeholder="Buscar favoritos..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {['all', 'publication', 'course', 'product', 'service'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    filterType === type
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {type === 'all' ? 'Todos' : getTypeText(type)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="space-y-4">
          {filteredFavorites.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron favoritos' : 'No tienes favoritos'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Guarda contenido que te interese para encontrarlo fácilmente'
                }
              </p>
              {!searchTerm && (
                <MinimalButton asChild>
                  <Link href="/explore">
                    <Heart className="w-4 h-4 mr-2" />
                    Explorar Contenido
                  </Link>
                </MinimalButton>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((item) => (
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
                            href={item.url}
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
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString('es-BO')}
                      </span>
                      <div className="flex items-center gap-2">
                        <MinimalButton variant="outline" size="sm" asChild>
                          <Link href={item.url}>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </MinimalButton>
                        <MinimalButton variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </MinimalButton>
                      </div>
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
