// Utilidad para detectar orientación de imagen y aplicar clase CSS adecuada
import { useState, useEffect } from 'react'

export interface LogoDimensions {
  width: number
  height: number
  aspectRatio: number
}

export type LogoOrientation = 'horizontal' | 'vertical' | 'square'

export async function getImageOrientation(imageUrl: string): Promise<LogoOrientation> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      const aspectRatio = img.width / img.height
      let orientation: LogoOrientation
      
      if (aspectRatio > 1.5) {
        orientation = 'horizontal'
      } else if (aspectRatio < 0.7) {
        orientation = 'vertical'
      } else {
        orientation = 'square'
      }
      
      resolve(orientation)
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = imageUrl
  })
}

export function getLogoClass(orientation: LogoOrientation): string {
  switch (orientation) {
    case 'horizontal':
      return 'logo-horizontal'
    case 'vertical':
      return 'logo-vertical'
    case 'square':
      return 'logo-square'
    default:
      return 'logo-square'
  }
}

// Función para generar estilos dinámicos si es necesario
export function getLogoStyles(orientation: LogoOrientation, customMaxWidth?: number) {
  const baseStyles = {
    objectFit: 'contain' as const,
    maxWidth: '100%',
    maxHeight: '100%',
    transition: 'all 0.3s ease'
  }

  switch (orientation) {
    case 'horizontal':
      return {
        ...baseStyles,
        maxHeight: '60%',
        width: 'auto',
        maxWidth: customMaxWidth ? `${customMaxWidth}px` : '200px'
      }
    case 'vertical':
      return {
        ...baseStyles,
        height: '80%',
        width: 'auto',
        maxWidth: customMaxWidth ? `${customMaxWidth}px` : '60px'
      }
    case 'square':
      return {
        ...baseStyles,
        height: '60%',
        width: 'auto',
        maxWidth: customMaxWidth ? `${customMaxWidth}px` : '60px',
        aspectRatio: '1'
      }
    default:
      return baseStyles
  }
}

// Hook de React para usar esta lógica
export function useLogoAdaptation(logoUrl: string | null) {
  const [orientation, setOrientation] = useState<LogoOrientation>('square')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!logoUrl) return

    setIsLoading(true)
    getImageOrientation(logoUrl)
      .then(setOrientation)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [logoUrl])

  return {
    orientation,
    isLoading,
    cssClass: getLogoClass(orientation),
    styles: getLogoStyles(orientation)
  }
}
