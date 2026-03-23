'use client'

import { useState, useEffect } from 'react'
import { getImageOrientation, getLogoClass } from '@/utils/logo-adaptation'

interface LogoAdaptiveProps {
  logoUrl: string | null
  storeName: string
  className?: string
}

export default function LogoAdaptive({ logoUrl, storeName, className = '' }: LogoAdaptiveProps) {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical' | 'square'>('square')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!logoUrl) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    getImageOrientation(logoUrl)
      .then(setOrientation)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [logoUrl])

  if (!logoUrl) {
    return null
  }

  return (
    <div style={{ height: '48px', display: 'flex', alignItems: 'center' }}>
      {isLoading ? (
        <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
      ) : (
        <img
          src={logoUrl}
          alt={storeName}
          style={{ 
            maxHeight: '48px',
            maxWidth: '200px',
            objectFit: 'contain',
            height: 'auto',
            width: 'auto'
          }}
        />
      )}
    </div>
  )
}
