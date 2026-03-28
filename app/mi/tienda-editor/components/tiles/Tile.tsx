'use client'

import { ReactNode } from 'react'

interface TileProps {
  onClick?: () => void
  bgColor: string
  shadowColor: string
  iconColor: string
  titleColor: string
  title: string | ReactNode
  icon: ReactNode
  disabled?: boolean
  className?: string
}

export default function Tile({ 
  onClick, 
  bgColor, 
  shadowColor, 
  iconColor, 
  titleColor, 
  title, 
  icon,
  disabled = false,
  className = ""
}: TileProps) {
  if (disabled) {
    return (
      <div
        className={`cursor-not-allowed opacity-50 ${className}`}
        style={{
          background: 'rgba(240, 240, 240, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '12px',
          border: '1px dashed rgba(255, 255, 255, 0.2)',
          minHeight: '90px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {icon}
        <h3 
          style={{
            color: '#999',
            fontSize: '12px',
            fontWeight: '600',
            textAlign: 'center',
            margin: '0'
          }}
        >
          {title}
        </h3>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-all duration-500 transform hover:scale-105 hover:rotate-1 ${className}`}
      style={{
        background: bgColor,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: `0 8px 32px ${shadowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: `radial-gradient(circle, ${bgColor} 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />
      <div style={{ color: iconColor, marginBottom: '6px', filter: `drop-shadow(0 2px 4px ${iconColor}4D)` }}>
        {icon}
      </div>
      <h3 
        style={{
          color: titleColor,
          fontSize: '12px',
          fontWeight: '700',
          textAlign: 'center',
          margin: '0',
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
          letterSpacing: '0.5px'
        }}
      >
        {title}
      </h3>
    </div>
  )
}
