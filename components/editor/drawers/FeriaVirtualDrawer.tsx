'use client'

import { X, Store } from 'lucide-react'
import LogoFeriaUploader from '@/components/editor/LogoFeriaUploader'

interface FeriaVirtualDrawerProps {
  onClose: () => void
  store: any
  updateStore: (field: string, value: any) => void
}

export default function FeriaVirtualDrawer({ onClose, store, updateStore }: FeriaVirtualDrawerProps) {
  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-100 to-pink-100 shadow-sm rounded-t-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Feria Virtual
          </h2>
          
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white border-2 border-purple-500 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X size={16} strokeWidth={2} className="text-purple-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 space-y-8 overflow-y-auto">
        {/* Logo Feria Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Logo de Feria Virtual
              </h3>
              <p className="text-sm text-gray-600">
                Sube el logo especial para la feria virtual
              </p>
            </div>
          </div>

          {/* Logo Uploader Component */}
          <LogoFeriaUploader
            storeId={store.id}
            currentLogo={store.logo_feria_url}
            onLogoChange={(logoUrl: string | null) => updateStore('logo_feria_url', logoUrl)}
          />
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M13 16H12V13H13M13 12H12V10H13M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-purple-900 mb-1">
                Acerca del Logo de Feria Virtual
              </h4>
              <p className="text-sm text-purple-700">
                Este logo se mostrará específicamente cuando tu tienda participe en eventos de feria virtual. 
                Puede ser diferente a tu logo principal para destacar en estos eventos especiales.
              </p>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Requisitos del Logo:</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Formato: PNG, JPG, GIF, WebP o SVG</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Tamaño máximo: 5MB</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Resolución recomendada: 200x200px o superior</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Fondo transparente (opcional)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
