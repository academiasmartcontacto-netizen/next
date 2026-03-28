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
      bgColor="rgba(255, 182, 193, 0.25)"
      shadowColor="rgba(255, 182, 193, 0.15)"
      iconColor="#d63384"
      titleColor="#831943"
      title="Identidad Visual"
      icon={<Store size={24} />}
    />
  )
}
