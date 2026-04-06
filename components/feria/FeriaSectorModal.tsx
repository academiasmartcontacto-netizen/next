'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Palette } from 'lucide-react'

interface FeriaSectorModalProps {
  isOpen: boolean
  onClose: () => void
  sector?: any
  onSave: (sector: any) => void
}

// Función helper para convertir base64 a File
const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  
  while(n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new File([u8arr], filename, { type: mime || 'image/avif' })
}

export default function FeriaSectorModal({ isOpen, onClose, sector, onSave }: FeriaSectorModalProps) {
  const [formData, setFormData] = useState({
    titulo: sector?.titulo || '',
    slug: sector?.slug || '',
    descripcion: sector?.descripcion || '',
    colorHex: sector?.colorHex || '#FF6B35',
    categoriaDefaultId: sector?.categoriaDefaultId || '',
    imagenBanner: sector?.imagenBanner || ''
  })

  const [isLoading, setIsLoading] = useState(false)

  // Reiniciar formData cuando cambia el sector (para crear o editar)
  useEffect(() => {
    if (isOpen) {
      setFormData({
        titulo: sector?.titulo || '',
        slug: sector?.slug || '',
        descripcion: sector?.descripcion || '',
        colorHex: sector?.colorHex || '#FF6B35',
        categoriaDefaultId: sector?.categoriaDefaultId || '',
        imagenBanner: sector?.imagenBanner || ''
      })
      
      console.log('🔄 [MODAL] Formulario reiniciado:', {
        isEditing: !!sector,
        sectorId: sector?.id,
        formData: {
          titulo: sector?.titulo || '',
          slug: sector?.slug || '',
          tieneImagen: !!sector?.imagenBanner
        }
      })
    }
  }, [sector, isOpen])

  // Categorías hardcoded (como en tu sistema actual)
  const categories = [
    { id: '1', nombre: 'Vehículos' },
    { id: '2', nombre: 'Dispositivos' },
    { id: '3', nombre: 'Electrodomésticos' },
    { id: '4', nombre: 'Herramientas' },
    { id: '5', nombre: 'Inmuebles' },
    { id: '6', nombre: 'Juguetes' },
    { id: '7', nombre: 'Muebles' },
    { id: '8', nombre: 'Prendas' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // PRIMERO: Crear el sector sin banner para obtener UUID
      const sectorData = {
        slug: formData.slug,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        colorHex: formData.colorHex,
        categoriaDefaultId: formData.categoriaDefaultId,
        activo: true
      }

      const method = sector?.id ? 'PUT' : 'POST'
      const url = sector?.id 
        ? `/api/admin/feria-sectores/${sector.id}`
        : '/api/admin/feria-sectores'

      // Crear/actualizar sector primero
      const sectorResponse = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectorData)
      })

      if (!sectorResponse.ok) {
        throw new Error('Error al guardar el sector')
      }

      const savedSector = await sectorResponse.json()

      // SEGUNDO: Si hay imagen, subirla con el UUID correcto
      if (formData.imagenBanner && formData.imagenBanner.startsWith('data:')) {
        // Es imagen base64, subirla directamente
        const uploadFormData = new FormData()
        uploadFormData.append('file', base64ToFile(formData.imagenBanner, 'banner.avif'))
        uploadFormData.append('sectorId', savedSector.id)
        uploadFormData.append('slug', formData.slug)

        const uploadResponse = await fetch('/api/admin/feria-sectores/upload', {
          method: 'POST',
          body: uploadFormData
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          console.log('📤 [MODAL] Imagen subida:', uploadData.url)
          
          // Actualizar el sector con la URL del banner
          const updateResponse = await fetch(`/api/admin/feria-sectores/${savedSector.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...savedSector,
              imagenBanner: uploadData.url
            })
          })
          
          if (updateResponse.ok) {
            const updatedSector = await updateResponse.json()
            console.log('✅ [MODAL] Sector actualizado con imagen:', updatedSector.imagenBanner)
            
            // Pasar el sector actualizado con la imagen
            onSave(updatedSector)
          } else {
            console.error('❌ [MODAL] Error actualizando sector con imagen')
            // Si falla la actualización, pasar el sector sin imagen
            onSave(savedSector)
          }
        } else {
          console.log('⚠️ [MODAL] Error subiendo imagen, guardando sector sin imagen')
          // Si falla el upload, pasar el sector sin imagen
          onSave(savedSector)
        }
      }

      // Si no hay imagen, solo pasar el sector guardado
      if (!formData.imagenBanner || !formData.imagenBanner.startsWith('data:')) {
        console.log('✅ [MODAL] Sector guardado sin imagen')
        onSave(savedSector)
      }

      onClose()

    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar el sector')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // NO subir automáticamente, solo guardar en estado como base64
    setIsLoading(true)
    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        setFormData(prev => ({ ...prev, imagenBanner: base64 }))
        console.log('📤 [MODAL] Imagen seleccionada (base64):', {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          base64Length: base64.length
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error al leer archivo:', error)
      alert('Error al procesar la imagen')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {sector?.id ? 'Editar Sector' : 'Nuevo Sector'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              required
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ej: Celulares"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (ID Único)
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ej: tech"
              pattern="[a-z0-9-]+"
              title="Solo letras minúsculas, números y guiones"
            />
            <p className="text-xs text-gray-500 mt-1">
              Sin espacios, solo letras minúsculas y números.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              required
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="Ej: Las mejores tiendas y marcas de celulares"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color del Tema
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formData.colorHex}
                onChange={(e) => setFormData(prev => ({ ...prev, colorHex: e.target.value }))}
                className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.colorHex}
                onChange={(e) => setFormData(prev => ({ ...prev, colorHex: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="#FF6B35"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría de Productos Asociada
            </label>
            <select
              value={formData.categoriaDefaultId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoriaDefaultId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">-- Ninguna (Libre) --</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Si seleccionas una categoría, las tiendas en este sector solo podrán publicar productos de esta categoría automáticamente.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner del Sector
            </label>
            
            {formData.imagenBanner && (
              <div className="mb-2 p-2 border rounded bg-gray-50 text-center relative">
                <img 
                  src={formData.imagenBanner} 
                  alt="Banner actual" 
                  className="max-h-32 mx-auto rounded"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, imagenBanner: '' }))}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  title="Eliminar imagen"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex items-center text-gray-500">
                <Upload size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Sube una imagen (JPG/PNG/WebP). Se redimensionará automáticamente.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
