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
      bgColor="rgba(239, 68, 68, 0.25)"
      shadowColor="rgba(239, 68, 68, 0.15)"
      iconColor="#dc2626"
      titleColor="#7f1d1d"
      title="Inventario"
      icon={<Package size={32} />}
    />
  )
}
