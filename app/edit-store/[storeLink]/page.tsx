'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Settings, 
  Layout, 
  Type, 
  Image, 
  Palette, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Save,
  ArrowLeft,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Layers,
  Text,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MinimalButton } from '@/components/ui/minimal-button'
import Navbar from '@/components/layout/navbar'
import { StorePageWithSections, StoreSection } from '@/lib/db/schema'

interface Store {
  id: string
  userId: string
  name: string
  phone: string
  link: string
  domain: string
  isActive: boolean
  isPublished: boolean
  settings: any
  theme: string
  logo?: string
  favicon?: string
  pages: StorePageWithSections[]
}

export default function EditStorePage() {
  const params = useParams()
  const router = useRouter()
  const storeLink = params.storeLink as string
  
  const [user, setUser] = useState<any>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [selectedPage, setSelectedPage] = useState<StorePageWithSections | null>(null)
  const [selectedSection, setSelectedSection] = useState<StoreSection | null>(null)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isSaving, setIsSaving] = useState(false)
  const [sidebarTab, setSidebarTab] = useState<'pages' | 'sections' | 'design'>('pages')

  useEffect(() => {
    fetchUser()
    fetchStore()
  }, [storeLink])

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

  const fetchStore = async () => {
    try {
      const response = await fetch(`/api/stores/${storeLink}`)
      if (response.ok) {
        const data = await response.json()
        setStore(data.store)
        // Select first page by default
        if (data.store.pages && data.store.pages.length > 0) {
          setSelectedPage(data.store.pages[0])
        }
      } else if (response.status === 404) {
        router.push('/create-store')
      }
    } catch (error) {
      console.error('Error fetching store:', error)
    }
  }

  const sectionTypes = [
    { id: 'header', name: 'Encabezado', icon: Type },
    { id: 'hero', name: 'Héroe', icon: Star },
    { id: 'text', name: 'Texto', icon: Text },
    { id: 'image', name: 'Imagen', icon: Image },
    { id: 'gallery', name: 'Galería', icon: Layers },
    { id: 'contact', name: 'Contacto', icon: Phone },
    { id: 'features', name: 'Características', icon: Square },
    { id: 'testimonials', name: 'Testimonios', icon: Heart },
  ]

  const addSection = (type: string) => {
    if (!selectedPage) return
    
    const newSection: StoreSection = {
      id: `section-${Date.now()}`,
      pageId: selectedPage.id,
      type,
      content: JSON.stringify(getSectionContent(type)),
      order: (selectedPage.sections?.length || 0) + 1,
      isVisible: true,
      settings: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const updatedPage = {
      ...selectedPage,
      sections: [...(selectedPage.sections || []), newSection]
    }
    
    setSelectedPage(updatedPage)
    setSelectedSection(newSection)
  }

  const getSectionContent = (type: string) => {
    switch (type) {
      case 'header':
        return { title: 'Título Principal', subtitle: 'Subtítulo opcional' }
      case 'hero':
        return { title: 'Bienvenido a mi tienda', description: 'Descripción increíble', buttonText: 'Comprar ahora' }
      case 'text':
        return { content: 'Tu texto aquí...' }
      case 'image':
        return { url: '', alt: 'Descripción de imagen' }
      case 'contact':
        return { email: '', phone: '', address: '' }
      default:
        return {}
    }
  }

  const saveStore = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // TODO: Implement actual save API
      console.log('Saving store:', store)
    } catch (error) {
      console.error('Error saving store:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const publishStore = async () => {
    if (!store) return
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStore({ ...store, isPublished: true })
      // TODO: Implement actual publish API
    } catch (error) {
      console.error('Error publishing store:', error)
    }
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!user || !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center max-w-md w-full">
          <p className="text-gray-600 mb-4">No se encontró la tienda o no tienes permisos para editarla</p>
          <MinimalButton asChild>
            <Link href="/dashboard">Ir al Dashboard</Link>
          </MinimalButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MinimalButton variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Link>
            </MinimalButton>
            
            <div className="flex items-center space-x-2">
              <h1 className="font-semibold text-gray-900">{store.name}</h1>
              <span className="text-sm text-gray-500">/</span>
              <span className="text-sm text-gray-600">{selectedPage?.title || 'Sin página'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Selector */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={cn(
                  "p-2 rounded transition-colors",
                  viewMode === 'desktop' ? "bg-white text-orange-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={cn(
                  "p-2 rounded transition-colors",
                  viewMode === 'tablet' ? "bg-white text-orange-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={cn(
                  "p-2 rounded transition-colors",
                  viewMode === 'mobile' ? "bg-white text-orange-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <MinimalButton variant="outline" onClick={saveStore} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar'}
            </MinimalButton>
            
            <MinimalButton 
              onClick={publishStore}
              className={store.isPublished ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <Globe className="w-4 h-4 mr-2" />
              {store.isPublished ? 'Publicado' : 'Publicar'}
            </MinimalButton>

            <MinimalButton variant="outline" asChild>
              <Link href={`/store/${store.link}`} target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                Vista Previa
              </Link>
            </MinimalButton>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setSidebarTab('pages')}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                sidebarTab === 'pages' 
                  ? "text-orange-600 border-b-2 border-orange-600" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Layout className="w-4 h-4 inline mr-2" />
              Páginas
            </button>
            <button
              onClick={() => setSidebarTab('sections')}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                sidebarTab === 'sections' 
                  ? "text-orange-600 border-b-2 border-orange-600" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Layers className="w-4 h-4 inline mr-2" />
              Secciones
            </button>
            <button
              onClick={() => setSidebarTab('design')}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                sidebarTab === 'design' 
                  ? "text-orange-600 border-b-2 border-orange-600" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Palette className="w-4 h-4 inline mr-2" />
              Diseño
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {sidebarTab === 'pages' && (
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Páginas</h3>
                  <MinimalButton size="sm">
                    <Plus className="w-4 h-4" />
                  </MinimalButton>
                </div>
                
                {store.pages?.map((page) => (
                  <div
                    key={page.id}
                    onClick={() => setSelectedPage(page)}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedPage?.id === page.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{page.title}</p>
                        <p className="text-xs text-gray-500">/{page.slug}</p>
                      </div>
                      {page.isHomePage && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          Inicio
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sidebarTab === 'sections' && selectedPage && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Secciones</h3>
                  <MinimalButton size="sm">
                    <Plus className="w-4 h-4" />
                  </MinimalButton>
                </div>

                {/* Add Section Types */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Agregar sección:</p>
                  {sectionTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => addSection(type.id)}
                        className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-left"
                      >
                        <Icon className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-900">{type.name}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Existing Sections */}
                {selectedPage.sections && selectedPage.sections.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Secciones existentes:</p>
                    {selectedPage.sections.map((section, index) => (
                      <div
                        key={section.id}
                        onClick={() => setSelectedSection(section)}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer transition-colors",
                          selectedSection?.id === section.id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {sectionTypes.find(t => t.id === section.type)?.name || section.type}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit className="w-3 h-3 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-red-100 rounded">
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {sidebarTab === 'design' && (
              <div className="p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Configuración de Diseño</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                  <select className="w-full p-2 border border-gray-200 rounded-lg">
                    <option>Por defecto</option>
                    <option>Moderno</option>
                    <option>Clásico</option>
                    <option>Minimalista</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Principal</label>
                  <div className="flex space-x-2">
                    {['bg-orange-600', 'bg-blue-600', 'bg-green-600', 'bg-purple-600'].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-lg ${color}`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipografía</label>
                  <select className="w-full p-2 border border-gray-200 rounded-lg">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                    <option>Poppins</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Preview */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto">
          <div className="flex justify-center">
            <div 
              className={cn(
                "bg-white shadow-lg transition-all duration-300",
                viewMode === 'desktop' && "w-full max-w-6xl",
                viewMode === 'tablet' && "w-full max-w-2xl",
                viewMode === 'mobile' && "w-full max-w-sm"
              )}
            >
              {/* Store Preview */}
              <div className="min-h-screen">
                {selectedPage ? (
                  <div className="p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedPage.title}</h1>
                    
                    {selectedPage.sections?.map((section) => (
                      <div key={section.id} className="mb-8 p-4 border border-gray-200 rounded-lg">
                        <div className="text-sm text-gray-500 mb-2">{section.type}</div>
                        <div className="text-gray-700">
                          {JSON.stringify(section.content, null, 2)}
                        </div>
                      </div>
                    ))}

                    {(!selectedPage.sections || selectedPage.sections.length === 0) && (
                      <div className="text-center py-12 text-gray-500">
                        <Layers className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>Esta página no tiene secciones</p>
                        <p className="text-sm mt-2">Agrega secciones desde el panel izquierdo</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96 text-gray-500">
                    <div className="text-center">
                      <Layout className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Selecciona una página para editar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
