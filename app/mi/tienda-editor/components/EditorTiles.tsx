'use client'

import NavbarTile from './tiles/NavbarTile'
import SectionsTile from './tiles/SectionsTile'
import IdentityTile from './tiles/IdentityTile'
import AppearanceTile from './tiles/AppearanceTile'
import ProductsTile from './tiles/ProductsTile'
import InventoryTile from './tiles/InventoryTile'
import PlaceholderTile from './tiles/PlaceholderTile'

interface EditorTilesProps {
  onOpenNavbar: () => void
  onOpenSecciones: () => void
  onOpenIdentidad: () => void
  onOpenApariencia: () => void
  onOpenProductos: () => void
  onOpenInventario: () => void
}

export default function EditorTiles({ 
  onOpenNavbar, 
  onOpenSecciones, 
  onOpenIdentidad, 
  onOpenApariencia, 
  onOpenProductos, 
  onOpenInventario 
}: EditorTilesProps) {
  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <NavbarTile onClick={onOpenNavbar} />
        <SectionsTile onClick={onOpenSecciones} />
        <IdentityTile onClick={onOpenIdentidad} />
        <AppearanceTile onClick={onOpenApariencia} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ProductsTile onClick={onOpenProductos} />
        <InventoryTile onClick={onOpenInventario} />
        <PlaceholderTile />
      </div>
    </>
  )
}
