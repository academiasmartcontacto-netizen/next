'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  User, 
  ShoppingBag, 
  Heart, 
  FileText, 
  LogOut, 
  Settings, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MinimalButton } from '@/components/ui/minimal-button'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest('.user-dropdown')) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  const handleLogout = async () => {
    await logout()
  }

  const handleStoreClick = async () => {
    // Lógica inteligente: Verificar si el usuario tiene tienda
    try {
      const response = await fetch('/api/stores?user-store=true')
      const data = await response.json()
      
      if (data.store) {
        // Tiene tienda -> Ir al editor (cuando lo creemos)
        router.push('/mi/tienda-editor')
      } else {
        // No tiene tienda -> Ir a crear tienda directamente
        router.push('/mi/crear-tienda')
      }
    } catch (error) {
      console.error('Error checking store:', error)
      // En caso de error, ir a crear tienda
      router.push('/mi/crear-tienda')
    }
    
    setIsDropdownOpen(false)
  }

  const displayName = user?.profile?.firstName && user?.profile?.lastName 
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email?.split('@')[0] || 'Usuario'

  const userInitials = displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Mostrar estado de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <nav className="bg-[#ff6b1a] border-b border-[#e55a15] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img 
                  src="/assets/img/doneback.svg" 
                  alt="Done Logo" 
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <div className="w-8 h-8 bg-[#e55a15] rounded-full animate-pulse" />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-[#ff6b1a] border-b border-[#e55a15] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/assets/img/doneback.svg" 
                alt="Done Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative user-dropdown">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-orange-500 h-11 px-6 py-2 space-x-2"
                >
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-[#ff6b1a] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {userInitials}
                  </div>
                  
                  {/* User Info */}
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-black">{displayName}</p>
                  </div>
                  
                  {/* Dropdown Arrow */}
                  <ChevronDown 
                    className={cn(
                      "w-4 h-4 text-black transition-transform",
                      isDropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{displayName}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Mi Perfil</span>
                      </Link>
                      
                      <Link
                        href="/publications"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Mis Publicaciones</span>
                      </Link>
                      
                      <Link
                        href="/favorites"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Heart className="w-4 h-4" />
                        <span>Mis Favoritos</span>
                      </Link>
                      
                      <Link
                        href="#"
                        onClick={handleStoreClick}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Mi Tienda</span>
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Configuración</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <MinimalButton variant="outline" asChild>
                  <Link href="/feria-virtual" target="_blank">Feria Virtual</Link>
                </MinimalButton>
                <MinimalButton variant="outline" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </MinimalButton>
                <MinimalButton variant="outline" asChild>
                  <Link href="/register">Registrarse</Link>
                </MinimalButton>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#e55a15] transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#e55a15] py-4">
            <div className="space-y-3">
              <Link
                href="/explore"
                className="block px-4 py-2 text-white hover:bg-[#e55a15] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explorar
              </Link>
              <Link
                href="/marketplace"
                className="block px-4 py-2 text-white hover:bg-[#e55a15] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-white hover:bg-[#e55a15] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nosotros
              </Link>
              
              {!user && (
                <div className="pt-3 border-t border-[#e55a15] space-y-2">
                  <MinimalButton variant="outline" asChild className="w-full">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Iniciar Sesión
                    </Link>
                  </MinimalButton>
                  <MinimalButton asChild className="w-full">
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      Registrarse
                    </Link>
                  </MinimalButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
