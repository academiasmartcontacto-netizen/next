'use client'

import { Store } from 'lucide-react'
import Tile from './Tile'

interface FeriaVirtualTileProps {
  onClick: () => void
}

export default function FeriaVirtualTile({ onClick }: FeriaVirtualTileProps) {
  return (
    <Tile
      onClick={onClick}
      bgColor="rgba(173, 216, 230, 0.25)"
      shadowColor="rgba(173, 216, 230, 0.15)"
      iconColor="#0d6efd"
      titleColor="#084298"
      title="Feria Virtual"
      icon={<Store size={24} />}
    />
  )
}
