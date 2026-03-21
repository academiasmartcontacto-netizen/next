'use client'

import { useState, useEffect } from 'react'
import { Palette, Plus, Heart, Clock, ChevronDown, ChevronUp, Check, X } from 'lucide-react'

interface ColorPickerPremiumProps {
  currentColor: string
  onColorChange: (color: string) => void
  onClose: () => void
}

const colorOptions = [
  { name: 'Rojo', value: '#FF0000' },
  { name: 'Rosa Instagram', value: '#E1306C' },
  { name: 'Fucsia', value: '#FF017B' },
  { name: 'Rosa Oscuro', value: '#BA2C5D' },
  { name: 'Naranja Done', value: '#ff6a00' },
  { name: 'Naranja Salmón', value: '#F16253' },
  { name: 'Naranja Ladrillo', value: '#D85427' },
  { name: 'Terracota', value: '#E07A5F' },
  { name: 'Camel', value: '#C19A6B' },
  { name: 'Marrón Café', value: '#794C1E' },
  { name: 'Amarillo', value: '#F7B500' },
  { name: 'Dorado', value: '#D4AF37' },
  { name: 'Bronce', value: '#B57E0A' },
  { name: 'Verde', value: '#4CAF50' },
  { name: 'Verde Lima', value: '#8BC34A' },
  { name: 'Verde Oscuro', value: '#3A5829' },
  { name: 'Verde Oliva', value: '#8C8733' },
  { name: 'Verde Musgo', value: '#666229' },
  { name: 'Azul Facebook', value: '#1a73e8' },
  { name: 'Azul Cielo', value: '#038CB4' },
  { name: 'Azul Marino', value: '#026E8F' },
  { name: 'Azul Petróleo', value: '#00374A' },
  { name: 'Azul Acero', value: '#8C92AC' },
  { name: 'Azul Corporativo', value: '#22226B' },
  { name: 'Púrpura', value: '#6C4DF2' },
  { name: 'Morado Real', value: '#6A0DAD' },
  { name: 'Lavanda', value: '#5A54A4' },
  { name: 'Lila', value: '#BDB0D0' },
  { name: 'Morado', value: '#602A7B' },
  { name: 'Gris Pizarra', value: '#34495E' },
  { name: 'Gris', value: '#999999' },
  { name: 'Negro', value: '#000000' },
]

// Colores patrios bolivianos
const bolivianColors = [
  { name: 'Rojo Bolivia', value: '#D92223' },
  { name: 'Amarillo Bolivia', value: '#F9D416' },
  { name: 'Verde Bolivia', value: '#009739' },
  { name: 'Azul Bolivia', value: '#0033A0' },
]

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  let r = 0, g = 0, b = 0
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16)
    g = parseInt(hex[3] + hex[4], 16)
    b = parseInt(hex[5] + hex[6], 16)
  }

  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export default function ColorPickerPremium({ currentColor, onColorChange, onClose }: ColorPickerPremiumProps) {
  const [activeTab, setActiveTab] = useState<'paleta' | 'personalizado' | 'favoritos' | 'recientes'>('paleta')
  const [hexInput, setHexInput] = useState(currentColor)
  const [hslValues, setHslValues] = useState(hexToHSL(currentColor))
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentColors, setRecentColors] = useState<string[]>([])
  const [showBolivianSection, setShowBolivianSection] = useState(false)

  // Cargar datos del localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('color-favorites')
    const savedRecent = localStorage.getItem('recent-colors')
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    if (savedRecent) setRecentColors(JSON.parse(savedRecent))
  }, [])

  // Actualizar valores cuando cambia el color actual
  useEffect(() => {
    setHexInput(currentColor)
    setHslValues(hexToHSL(currentColor))
  }, [currentColor])

  const isValidHex = (hex: string) => /^#[0-9A-F]{6}$/i.test(hex)

  const handleHexChange = (value: string) => {
    setHexInput(value)
    if (isValidHex(value)) {
      onColorChange(value)
      addToRecent(value)
    }
  }

  const handleHSLChange = (type: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hslValues, [type]: value }
    setHslValues(newHsl)
    const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l)
    onColorChange(newHex)
    setHexInput(newHex)
    addToRecent(newHex)
  }

  const addToRecent = (color: string) => {
    setRecentColors(prev => {
      const updated = [color, ...prev.filter(c => c !== color)].slice(0, 10)
      localStorage.setItem('recent-colors', JSON.stringify(updated))
      return updated
    })
  }

  const toggleFavorite = (color: string) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(color)
      let updated: string[]
      
      if (isFavorite) {
        updated = prev.filter(c => c !== color)
      } else {
        updated = [...prev, color].slice(0, 20) // Máximo 20 favoritos
      }
      
      localStorage.setItem('color-favorites', JSON.stringify(updated))
      return updated
    })
  }

  const ColorButton = ({ color, name, showFavorite = false }: { color: string; name?: string; showFavorite?: boolean }) => (
    <div className="relative group">
      <button
        onClick={() => {
          onColorChange(color)
          addToRecent(color)
        }}
        className="w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 shadow-md"
        style={{
          backgroundColor: color,
          borderColor: color === '#ffffff' ? '#ccc' : 'transparent'
        }}
        title={name || color}
      />
      {showFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(color)
          }}
          className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart
            size={12}
            className={favorites.includes(color) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
      )}
      {color === currentColor && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Check size={16} className="text-white drop-shadow-md" />
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Palette size={24} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Selector de Color Premium</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Preview actual */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-lg shadow-inner border-2 border-gray-200"
            style={{ backgroundColor: currentColor }}
          />
          <div>
            <p className="text-sm text-gray-600">Color Actual</p>
            <p className="font-mono font-semibold text-gray-800">{currentColor.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('paleta')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'paleta'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Paleta
        </button>
        <button
          onClick={() => setActiveTab('personalizado')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'personalizado'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Personalizado
        </button>
        <button
          onClick={() => setActiveTab('favoritos')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'favoritos'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Favoritos
        </button>
        <button
          onClick={() => setActiveTab('recientes')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'recientes'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Recientes
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {activeTab === 'paleta' && (
          <div>
            {/* Colores Bolivianos */}
            <div className="mb-6">
              <button
                onClick={() => setShowBolivianSection(!showBolivianSection)}
                className="flex items-center gap-2 w-full p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <span className="text-sm font-semibold text-red-700">🇧🇴 Colores Patrios Bolivianos</span>
                {showBolivianSection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showBolivianSection && (
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {bolivianColors.map(color => (
                    <ColorButton key={color.value} color={color.value} name={color.name} showFavorite />
                  ))}
                </div>
              )}
            </div>

            {/* Paleta completa */}
            <div className="grid grid-cols-6 gap-3">
              {colorOptions.map(color => (
                <ColorButton key={color.value} color={color.value} name={color.name} showFavorite />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'personalizado' && (
          <div className="space-y-6">
            {/* Input Hexadecimal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código Hexadecimal
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#FF5733"
                  className={`flex-1 px-3 py-2 border rounded-lg font-mono ${
                    isValidHex(hexInput) ? 'border-green-500' : 'border-gray-300'
                  }`}
                />
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => {
                    onColorChange(e.target.value)
                    addToRecent(e.target.value)
                  }}
                  className="w-12 h-10 border rounded cursor-pointer"
                />
              </div>
              {!isValidHex(hexInput) && hexInput.length > 0 && (
                <p className="text-xs text-red-500 mt-1">Formato inválido. Usa #RRGGBB</p>
              )}
            </div>

            {/* Sliders HSL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ajuste HSL (Matiz, Saturación, Luminosidad)
              </label>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Matiz (H)</span>
                    <span>{hslValues.h}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hslValues.h}
                    onChange={(e) => handleHSLChange('h', parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Saturación (S)</span>
                    <span>{hslValues.s}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hslValues.s}
                    onChange={(e) => handleHSLChange('s', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Luminosidad (L)</span>
                    <span>{hslValues.l}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hslValues.l}
                    onChange={(e) => handleHSLChange('l', parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-black via-gray-500 to-white rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'favoritos' && (
          <div>
            {favorites.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart size={48} className="mx-auto mb-2 opacity-30" />
                <p>No tienes colores favoritos aún</p>
                <p className="text-sm">Haz clic en el corazón en cualquier color para agregarlo</p>
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-3">
                {favorites.map(color => (
                  <ColorButton key={color} color={color} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'recientes' && (
          <div>
            {recentColors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock size={48} className="mx-auto mb-2 opacity-30" />
                <p>No has usado colores recientemente</p>
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-3">
                {recentColors.map(color => (
                  <ColorButton key={color} color={color} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
