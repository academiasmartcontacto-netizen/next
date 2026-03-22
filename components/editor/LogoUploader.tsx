'use client'

import { useState } from 'react'
import { Upload, X } from 'lucide-react'

interface LogoUploaderProps {
  currentLogo: string | null
  onLogoChange: (logoUrl: string | null) => void
  storeId: string
}

export default function LogoUploader({ currentLogo, onLogoChange, storeId }: LogoUploaderProps) {
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
            setError(response.error || 'Error al subir el logo')
          }
        } else {
          setError('Error al subir el logo')
        }
        setIsUploading(false)
        setUploadProgress(0)
      })

      xhr.addEventListener('error', () => {
        setError('Error de conexión')
        setIsUploading(false)
        setUploadProgress(0)
      })

      xhr.open('POST', '/api/upload/logo')
      xhr.send(formData)

    } catch (err) {
      setError('Error al subir el logo')
      setIsUploading(false)
      setUploadProgress(0)
    }

    // Reset input
    e.target.value = ''
  }

  const handleRemoveLogo = () => {
    onLogoChange(null)
    setError(null)
  }

  return (
    <div className="logo-uploader">
      <div className="upload-field">
        <input
          type="file"
          id="logo-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        
        <label 
          htmlFor="logo-upload"
          className={`upload-label ${isUploading ? 'uploading' : ''}`}
        >
          {currentLogo ? (
            <img 
              src={currentLogo} 
              alt="Logo actual" 
              className="logo-preview"
            />
          ) : (
            <div className="upload-placeholder">
              <Upload size={24} />
              <span>Subir Logo</span>
            </div>
          )}
          
          {isUploading && (
            <div className="upload-overlay">
              <div className="upload-spinner"></div>
              <span>{uploadProgress}%</span>
            </div>
          )}
        </label>

        {currentLogo && !isUploading && (
          <button
            onClick={handleRemoveLogo}
            className="remove-btn"
            title="Eliminar logo"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <style jsx>{`
        .logo-uploader {
          width: 100%;
        }

        .upload-field {
          position: relative;
          display: inline-block;
        }

        .upload-label {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 60px;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f9fafb;
          position: relative;
          overflow: hidden;
        }

        .upload-label:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .upload-label.uploading {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .logo-preview {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 6px;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: #6b7280;
          font-size: 12px;
          font-weight: 500;
        }

        .upload-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 6px;
        }

        .upload-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .remove-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .remove-btn:hover {
          background: #dc2626;
          transform: scale(1.1);
        }

        .error-message {
          margin-top: 8px;
          padding: 8px 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          color: #dc2626;
          font-size: 12px;
        }
      `}</style>
    </div>
  )
}
