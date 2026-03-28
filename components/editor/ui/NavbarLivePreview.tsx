'use client'

import { Store, Menu, X } from 'lucide-react'

interface NavbarLivePreviewProps {
  logo: string | null
  navbarColor: string
  storeName?: string
}

export default function NavbarLivePreview({ logo, navbarColor, storeName = "Mi Tienda" }: NavbarLivePreviewProps) {
  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-neutral-700 mb-3">Vista Previa en Tiempo Real</h3>
      
      <div 
        className="relative overflow-hidden rounded-xl border border-neutral-200"
        style={{ 
          backgroundColor: navbarColor,
          height: '64px'
        }}
      >
        {/* Glassmorphism overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Navbar Content */}
        <div className="relative h-full px-6 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            {logo ? (
              <div 
                className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <img 
                  src={logo} 
                  alt="Logo de la tienda"
                  className="w-full h-full object-contain rounded-lg"
                  style={{ maxHeight: '48px', maxWidth: '48px' }}
                />
              </div>
            ) : (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Store 
                  size={24} 
                  className="text-white/80"
                  strokeWidth={1.5}
                />
              </div>
            )}
            
            <div>
              <h1 
                className="text-lg font-bold"
                style={{ color: 'white' }}
              >
                {storeName}
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {['Inicio', 'Productos', 'Contacto', 'Acerca de'].map((item) => (
              <button
                key={item}
                className="text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg transition-all duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Menu 
              size={20} 
              className="text-white/90"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)'
          }}
        />
      </div>
      
      <p className="text-xs text-neutral-500 mt-2">
        Los cambios se reflejan instantáneamente en tu tienda
      </p>
    </div>
  )
}
