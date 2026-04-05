'use client'

import { useState } from 'react'
import { Upload, X, Store } from 'lucide-react'

interface LogoFeriaUploaderProps {
  currentLogo: string | null
  onLogoChange: (logoUrl: string | null) => void
  storeId: string
}

export default function LogoFeriaUploader({ currentLogo, onLogoChange, storeId }: LogoFeriaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      setError('Formato no válido. Usa JPG, PNG, GIF, WebP o SVG')
      return
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 5MB')
      return
    }

    // Subir archivo
    const formData = new FormData()
    formData.append('logo', file)
    formData.append('storeId', storeId)

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const xhr = new XMLHttpRequest()

      // Simular progreso
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          if (response.success) {
            onLogoChange(response.logoUrl)
          } else {
            setError(response.error || 'Error al subir el logo de feria')
          }
        } else {
          setError('Error al subir el logo de feria')
        }
        setIsUploading(false)
        setUploadProgress(0)
      })

      xhr.addEventListener('error', () => {
        setError('Error de conexión')
        setIsUploading(false)
        setUploadProgress(0)
      })

      xhr.open('POST', '/api/upload/logo-feria')
      xhr.send(formData)

    } catch (err) {
      setError('Error al subir el logo de feria')
      setIsUploading(false)
      setUploadProgress(0)
    }

    // Reset input
    e.target.value = ''
  }

  const handleRemoveLogo = async () => {
    // Eliminar de Storage si existe un logo actual
    if (currentLogo) {
      try {
        await fetch(`/api/upload/logo-feria?url=${encodeURIComponent(currentLogo)}`, {
          method: 'DELETE'
        })
      } catch (error) {
        console.error('Error eliminando logo de feria:', error)
      }
    }
    
    onLogoChange(null)
    setError(null)
  }

  return (
    <div className="logo-uploader">
      <div className="upload-field">
        <input
          type="file"
          id="logo-feria-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        
        {currentLogo ? (
          <div className="relative">
            <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-purple-200">
              <img
                src={currentLogo}
                alt="Logo de Feria Virtual"
                className="w-full h-full object-contain"
              />
            </div>
            <button
              onClick={handleRemoveLogo}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label
            htmlFor="logo-feria-upload"
            className={`w-32 h-32 border-2 border-dashed border-purple-300 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
              isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-500 hover:bg-purple-50'
            }`}
          >
            <Store className="w-8 h-8 text-purple-400 mb-2" />
            <span className="text-xs text-purple-600 font-medium">
              {isUploading ? 'Subiendo...' : 'Logo Feria'}
            </span>
          </label>
        )}
      </div>

      {isUploading && (
        <div className="mt-3">
          <div className="w-full bg-purple-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-purple-600 mt-1 text-center">{uploadProgress}%</p>
        </div>
      )}

      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {!currentLogo && !isUploading && (
        <div className="mt-3 text-xs text-gray-500">
          <p>Formatos: JPG, PNG, GIF, WebP, SVG</p>
          <p>Tamaño máximo: 5MB</p>
        </div>
      )}
    </div>
  )
}
