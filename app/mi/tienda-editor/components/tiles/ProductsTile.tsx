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
      bgColor="rgba(173, 216, 230, 0.25)"
      shadowColor="rgba(173, 216, 230, 0.15)"
      iconColor="#0d6efd"
      titleColor="#084298"
      title="Productos"
      icon={<Plus size={24} />}
    />
  )
}
