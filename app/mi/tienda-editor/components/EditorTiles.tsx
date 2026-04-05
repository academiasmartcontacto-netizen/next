'use client'

import NavbarTile from './tiles/NavbarTile'
import SectionsTile from './tiles/SectionsTile'
import IdentityTile from './tiles/IdentityTile'
import AppearanceTile from './tiles/AppearanceTile'
import ProductsTile from './tiles/ProductsTile'
import InventoryTile from './tiles/InventoryTile'
import ContactanosTile from './tiles/ContactanosTile'
import FeriaVirtualTile from './tiles/FeriaVirtualTile'
import PlaceholderTile from './tiles/PlaceholderTile'

interface EditorTilesProps {
  onOpenNavbar: () => void
  onOpenSecciones: () => void
  onOpenIdentidad: () => void
  onOpenApariencia: () => void
  onOpenProductos: () => void
  onOpenInventario: () => void
  onOpenContactanos: () => void
  onOpenFeriaVirtual: () => void
}

export default function EditorTiles({ 
  onOpenNavbar, 
  onOpenSecciones, 
  onOpenIdentidad, 
  onOpenApariencia, 
  onOpenProductos, 
  onOpenInventario,
  onOpenContactanos,
  onOpenFeriaVirtual
}: EditorTilesProps) {
  return (
    <>
      <div className="grid grid-cols-4 gap-2 mb-2">
        <NavbarTile onClick={onOpenNavbar} />
        <SectionsTile onClick={onOpenSecciones} />
        <IdentityTile onClick={onOpenIdentidad} />
        <AppearanceTile onClick={onOpenApariencia} />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <ProductsTile onClick={onOpenProductos} />
        <InventoryTile onClick={onOpenInventario} />
        <ContactanosTile onClick={onOpenContactanos} />
        <FeriaVirtualTile onClick={onOpenFeriaVirtual} />
      </div>
    </>
  )
}
