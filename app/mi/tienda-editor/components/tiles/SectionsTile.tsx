'use client'

import { Layout } from 'lucide-react'
import Tile from './Tile'

interface SectionsTileProps {
  onClick: () => void
}

export default function SectionsTile({ onClick }: SectionsTileProps) {
  return (
    <Tile
      onClick={onClick}
      bgColor="rgba(144, 238, 144, 0.25)"
      shadowColor="rgba(144, 238, 144, 0.15)"
      iconColor="#198754"
      titleColor="#0f5132"
      title="Secciones"
      icon={<Layout size={24} />}
    />
  )
}
