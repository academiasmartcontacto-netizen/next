'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface EditorTileProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  shadowColor: string;
}

export default function EditorTile({ 
  onClick, 
  icon: Icon, 
  label, 
  color, 
  bgColor, 
  textColor, 
  shadowColor 
}: EditorTileProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer transition-all duration-500 transform hover:scale-105 hover:rotate-1"
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
        background: `radial-gradient(circle, ${bgColor.replace('0.25', '0.1')} 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />
      <Icon size={32} style={{ color: color, marginBottom: '8px', filter: `drop-shadow(0 2px 4px ${color}4D)` }} />
      <h3 
        style={{
          color: textColor,
          fontSize: '14px',
          fontWeight: '700',
          textAlign: 'center',
          margin: '0',
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
          letterSpacing: '0.5px'
        }}
      >
        {label}
      </h3>
    </div>
  )
}
