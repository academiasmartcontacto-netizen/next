'use client'

import { Layout } from 'lucide-react'
import Tile from './Tile'

interface SectionsTileProps {
  onClick: () => void
}

export default function SectionsTile({ onClick }: SectionsTileProps) {
  return (
    <Tile
      onClick={onClick}
      bgColor="rgba(173, 216, 230, 0.25)"
      shadowColor="rgba(173, 216, 230, 0.15)"
      iconColor="#0d6efd"
      titleColor="#084298"
      title="Secciones"
      icon={<Layout size={24} />}
    />
  )
}
