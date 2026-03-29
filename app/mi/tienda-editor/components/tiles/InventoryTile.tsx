'use client'

import { Package } from 'lucide-react'
import Tile from './Tile'

interface InventoryTileProps {
  onClick: () => void
}

export default function InventoryTile({ onClick }: InventoryTileProps) {
  return (
    <Tile
      onClick={onClick}
      bgColor="rgba(173, 216, 230, 0.25)"
      shadowColor="rgba(173, 216, 230, 0.15)"
      iconColor="#0d6efd"
      titleColor="#084298"
      title="Inventario"
      icon={<Package size={24} />}
    />
  )
}
