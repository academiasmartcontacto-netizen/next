'use client'

import { Menu } from 'lucide-react'
import Tile from './Tile'

interface NavbarTileProps {
  onClick: () => void
}

export default function NavbarTile({ onClick }: NavbarTileProps) {
  return (
    <Tile
      onClick={onClick}
      bgColor="rgba(173, 216, 230, 0.25)"
      shadowColor="rgba(173, 216, 230, 0.15)"
      iconColor="#0d6efd"
      titleColor="#084298"
      title={<>Barra de<br />Navegación</>}
      icon={<Menu size={24} />}
    />
  )
}
