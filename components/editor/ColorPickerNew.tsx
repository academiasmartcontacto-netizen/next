'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface ColorPickerNewProps {
  currentColor: string
  onColorChange: (color: string) => void
}

// Paleta optimizada de colores - SIN DUPLICADOS
const colorPalette = [
  '#FF0000', '#E1306C', '#FF017B', '#BA2C5D', '#ff6a00', '#F16253', '#D85427', '#E07A5F',
  '#C19A6B', '#794C1E', '#F7B500', '#D4AF37', '#B57E0A', '#4CAF50', '#8BC34A', '#3A5829',
  '#8C8733', '#666229', '#1a73e8', '#038CB4', '#026E8F', '#8C92AC', '#22226B',
  '#6C4DF2', '#6A0DAD', '#5A54A4', '#BDB0D0', '#602A7B', '#34495E', '#999999', '#000000',
  '#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#6C757D', '#495057',
  '#D92223', '#F9D416', '#009739', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DC143C'
]

export default function ColorPickerNew({ currentColor, onColorChange }: ColorPickerNewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(currentColor)

  // Sincronizar con el color actual cuando cambia externamente
  useEffect(() => {
    setSelectedColor(currentColor)
  }, [currentColor])

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    onColorChange(color)
    setIsOpen(false) // Cerrar después de seleccionar
  }

  const handleCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setSelectedColor(color)
    onColorChange(color)
  }

  return (
    <div className="relative">
      {/* Botón principal - SIEMPRE MUESTRA EL COLOR ACTUAL */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
      >
        <div
          className="w-5 h-5 rounded border border-gray-400"
          style={{ backgroundColor: selectedColor }}
        />
        <span className="text-sm font-mono">{selectedColor}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 w-80">
          {/* Grid de colores */}
          <div className="grid grid-cols-8 gap-1 mb-3">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 rounded border hover:scale-110 transition-transform duration-150 ${
                  selectedColor === color ? 'ring-2 ring-blue-600' : ''
                }`}
                style={{ 
                  backgroundColor: color,
                  borderColor: color === '#FFFFFF' ? '#E5E7EB' : 'transparent'
                }}
                title={color}
              >
                {selectedColor === color && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Selector de color personalizado */}
          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <input
              type="color"
              value={selectedColor}
              onChange={handleCustomColor}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => {
                const color = e.target.value
                if (/^#[0-9A-F]{6}$/i.test(color)) {
                  setSelectedColor(color)
                  onColorChange(color)
                }
              }}
              placeholder="#FF5733"
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded font-mono"
            />
          </div>
        </div>
      )}
    </div>
  )
}
