'use client'

import { X } from 'lucide-react'
import LogoUploader from '@/components/editor/LogoUploader'
import ColorPickerNew from '@/components/editor/ColorPickerNew'

interface NavbarDrawerProps {
  onClose: () => void
  store: any
  updateStore: (field: string, value: any) => void
}

export default function NavbarDrawer({ onClose, store, updateStore }: NavbarDrawerProps) {
  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-100 bg-sky-100 shadow-sm rounded-t-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Barra de Navegación
          </h2>
          
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X size={16} strokeWidth={2} className="text-black" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 space-y-8 overflow-y-auto">
        {/* Logo Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Logo de la Tienda
              </h3>
              <p className="text-sm text-gray-600">
                Sube el logo que representará tu marca
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
            <LogoUploader
              currentLogo={store.logo}
              onLogoChange={(logoUrl) => updateStore('logo', logoUrl)}
              storeId={store.id}
            />
          </div>
          
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Formatos recomendados: PNG, JPG, SVG. Máximo 5MB.</span>
          </div>
        </div>

        {/* Color Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2"/>
                <path d="M12 2V6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 18V22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4.93 4.93L7.76 7.76" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16.24 16.24L19.07 19.07" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 12H6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M18 12H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4.93 19.07L7.76 16.24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16.24 7.76L19.07 4.93" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Color de Fondo
              </h3>
              <p className="text-sm text-gray-600">
                Define la paleta de colores de tu barra
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-gray-200">
            <ColorPickerNew
              currentColor={store.navbarColor || '#1e3a8a'}
              onColorChange={(color: string) => updateStore('navbarColor', color)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
