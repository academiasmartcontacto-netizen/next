'use client'

import { Store, ShoppingCart, Globe } from 'lucide-react'

interface FeriaVirtualTileProps {
  onClick: () => void
}

export default function FeriaVirtualTile({ onClick }: FeriaVirtualTileProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <Store className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs font-medium text-gray-700 group-hover:text-orange-600">
          Feria Virtual
        </span>
      </div>
    </button>
  )
}
