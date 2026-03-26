'use client'

import { Palette } from 'lucide-react'
import Tile from './Tile'

interface AppearanceTileProps {
  onClick: () => void
}

export default function AppearanceTile({ onClick }: AppearanceTileProps) {
  return (
    <Tile
      onClick={onClick}
      bgColor="rgba(176, 224, 230, 0.25)"
      shadowColor="rgba(176, 224, 230, 0.15)"
      iconColor="#20c997"
      titleColor="#0f5132"
      title="Apariencia"
      icon={<Palette size={32} />}
    />
  )
}
