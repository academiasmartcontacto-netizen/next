'use client'

import { MessageCircle } from 'lucide-react'
import Tile from './Tile'

interface ContactanosTileProps {
  onClick: () => void
}

export default function ContactanosTile({ onClick }: ContactanosTileProps) {
  return (
    <Tile
      onClick={onClick}
      bgColor="rgba(34, 34, 107, 0.15)"
      shadowColor="rgba(34, 34, 107, 0.2)"
      iconColor="#22226B"
      titleColor="#22226B"
      title="Contáctanos"
      icon={<MessageCircle size={24} />}
    />
  )
}
