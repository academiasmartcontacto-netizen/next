'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  MessageCircle, 
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MinimalButton } from '@/components/ui/minimal-button'
import { MinimalInput } from '@/components/ui/minimal-input'
import Navbar from '@/components/layout/navbar'

interface Publication {
  id: string
  title: string
  content: string
  category: string
  status: 'published' | 'draft' | 'archived'
  views: number
  likes: number
  comments: number
  createdAt: string
  updatedAt: string
  thumbnail?: string
}

export default function PublicationsPage() {
  const [user, setUser] = useState<any>(null)
  const [publications, setPublications] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const router = useRouter()

  useEffect(() => {
    fetchUser()
    fetchPublications()
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

  const fetchPublications = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockPublications: Publication[] = [
        {
          id: '1',
          title: 'Guía completa de React Hooks',
          content: 'Aprende a usar React Hooks como un profesional con ejemplos prácticos...',
          category: 'Desarrollo Web',
          status: 'published',
          views: 1250,
          likes: 89,
          comments: 12,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '2',
          title: 'Tips para optimizar tu código JavaScript',
          content: 'Descubre las mejores prácticas para escribir código JavaScript limpio y eficiente...',
          category: 'Programación',
          status: 'published',
          views: 890,
          likes: 67,
          comments: 8,
          createdAt: '2024-01-10',
          updatedAt: '2024-01-12'
        },
        {
          id: '3',
          title: 'Introducción a TypeScript',
          content: 'Aprende los fundamentos de TypeScript y cómo mejorar tus proyectos...',
          category: 'Desarrollo Web',
          status: 'draft',
          views: 0,
          likes: 0,
          comments: 0,
          createdAt: '2024-01-20',
          updatedAt: '2024-01-20'
        }
      ]
      
      setPublications(mockPublications)
    } catch (error) {
      console.error('Error fetching publications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || pub.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700'
      case 'draft': return 'bg-yellow-100 text-yellow-700'
      case 'archived': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado'
      case 'draft': return 'Borrador'
      case 'archived': return 'Archivado'
      default: return status
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
          <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tus publicaciones</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Publicaciones</h1>
              <p className="text-gray-600">Gestiona y organiza todo tu contenido</p>
            </div>
            <MinimalButton asChild>
              <Link href="/publications/create">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Publicación
              </Link>
            </MinimalButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Publicaciones</p>
                <p className="text-2xl font-bold text-gray-900">{publications.length}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Publicadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {publications.filter(p => p.status === 'published').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Vistas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {publications.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {publications.reduce((sum, p) => sum + p.likes, 0).toLocaleString()}
                </p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MinimalInput
                label=""
                placeholder="Buscar publicaciones..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            <div className="flex gap-2">
              {['all', 'published', 'draft', 'archived'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    filterStatus === status
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {status === 'all' ? 'Todas' : getStatusText(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Publications List */}
        <div className="space-y-4">
          {filteredPublications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron publicaciones' : 'No tienes publicaciones'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Comienza creando tu primera publicación'
                }
              </p>
              {!searchTerm && (
                <MinimalButton asChild>
                  <Link href="/publications/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primera Publicación
                  </Link>
                </MinimalButton>
              )}
            </div>
          ) : (
            filteredPublications.map((publication) => (
              <div key={publication.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {publication.thumbnail && (
                        <img 
                          src={publication.thumbnail} 
                          alt={publication.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            <Link 
                              href={`/publications/${publication.id}`}
                              className="hover:text-orange-600 transition-colors"
                            >
                              {publication.title}
                            </Link>
                          </h3>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getStatusColor(publication.status)
                          )}>
                            {getStatusText(publication.status)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {publication.content}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(publication.createdAt).toLocaleDateString('es-BO')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {publication.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {publication.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {publication.comments.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MinimalButton variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </MinimalButton>
                    <MinimalButton variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </MinimalButton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
