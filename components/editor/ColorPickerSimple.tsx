'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface ColorPickerSimpleProps {
  currentColor: string
  onColorChange: (color: string) => void
}

// Paleta optimizada de 48 colores (8x6 grid)
const colorPalette = [
  '#FF0000', '#E1306C', '#FF017B', '#BA2C5D', '#ff6a00', '#F16253', '#D85427', '#E07A5F',
  '#C19A6B', '#794C1E', '#F7B500', '#D4AF37', '#B57E0A', '#4CAF50', '#8BC34A', '#3A5829',
  '#8C8733', '#666229', '#1a73e8', '#038CB4', '#026E8F', '#00374A', '#8C92AC', '#22226B',
  '#6C4DF2', '#6A0DAD', '#5A54A4', '#BDB0D0', '#602A7B', '#34495E', '#999999', '#000000',
  '#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#6C757D', '#495057',
  '#D92223', '#F9D416', '#009739', '#0033A0', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'
]

export default function ColorPickerSimple({ currentColor, onColorChange }: ColorPickerSimpleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hexValue, setHexValue] = useState(currentColor)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Actualizar input cuando cambia el color actual
  useEffect(() => {
    setHexValue(currentColor)
  }, [currentColor])

  const handleColorSelect = (color: string) => {
    onColorChange(color)
    setHexValue(color)
    setIsOpen(false) // Cerrar después de seleccionar
  }

  const handleHexSubmit = () => {
    if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
      onColorChange(hexValue)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
      >
        <div
          className="w-5 h-5 rounded border border-gray-400"
          style={{ backgroundColor: currentColor }}
        />
        <span className="text-sm font-mono">{currentColor}</span>
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
                className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform duration-150"
                style={{ 
                  backgroundColor: color,
                  borderColor: color === '#FFFFFF' ? '#E5E7EB' : 'transparent'
                }}
                title={color}
              >
                {color === currentColor && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Input hex opcional */}
          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <input
              type="text"
              value={hexValue}
              onChange={(e) => setHexValue(e.target.value)}
              placeholder="#FF5733"
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleHexSubmit()}
            />
            <button
              onClick={handleHexSubmit}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
