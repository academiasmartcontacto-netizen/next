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
      bgColor="rgba(173, 216, 230, 0.25)"
      shadowColor="rgba(173, 216, 230, 0.15)"
      iconColor="#0d6efd"
      titleColor="#084298"
      title="Apariencia"
      icon={<Palette size={24} />}
    />
  )
}
