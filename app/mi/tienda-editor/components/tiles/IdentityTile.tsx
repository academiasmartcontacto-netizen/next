'use client'

import { Store } from 'lucide-react'
import Tile from './Tile'

interface IdentityTileProps {
  onClick: () => void
}

export default function IdentityTile({ onClick }: IdentityTileProps) {
  return (
    <Tile
      onClick={onClick}
      bgColor="rgba(173, 216, 230, 0.25)"
      shadowColor="rgba(173, 216, 230, 0.15)"
      iconColor="#0d6efd"
      titleColor="#084298"
      title="Identidad Visual"
      icon={<Store size={24} />}
    />
  )
}
