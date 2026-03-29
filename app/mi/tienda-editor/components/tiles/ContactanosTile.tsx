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
      bgColor="rgba(173, 216, 230, 0.25)"
      shadowColor="rgba(173, 216, 230, 0.15)"
      iconColor="#0d6efd"
      titleColor="#084298"
      title="Contáctanos"
      icon={<MessageCircle size={24} />}
    />
  )
}
