'use client'

import { Plus } from 'lucide-react'
import Tile from './Tile'

interface ProductsTileProps {
  onClick: () => void
}

export default function ProductsTile({ onClick }: ProductsTileProps) {
  return (
    <Tile
      onClick={onClick}
      bgColor="rgba(255, 218, 185, 0.25)"
      shadowColor="rgba(255, 218, 185, 0.15)"
      iconColor="#fd7e14"
      titleColor="#664d03"
      title="Productos"
      icon={<Plus size={32} />}
    />
  )
}
