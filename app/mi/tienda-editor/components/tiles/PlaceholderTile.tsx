'use client'

import { Plus } from 'lucide-react'
import Tile from './Tile'

export default function PlaceholderTile() {
  return (
    <Tile
      disabled
      bgColor="rgba(240, 240, 240, 0.1)"
      shadowColor="transparent"
      iconColor="#ccc"
      titleColor="#999"
      title="PRÓXIMO"
      icon={<Plus size={32} />}
    />
  )
}
