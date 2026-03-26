'use client'

import LogoUploader from '@/components/editor/LogoUploader'
import ColorPickerNew from '@/components/editor/ColorPickerNew'

interface NavbarDrawerProps {
  onClose: () => void
  store: any
  updateStore: (field: string, value: any) => void
}

export default function NavbarDrawer({ onClose, store, updateStore }: NavbarDrawerProps) {
  return (
    <div style={{ padding: '16px', color: '#333' }}>
      <button 
        onClick={onClose} 
        style={{ 
          marginBottom: '24px', 
          color: '#333', 
          background: '#f0f0f0', 
          border: '1px solid #ccc', 
          padding: '8px 16px', 
          cursor: 'pointer', 
          borderRadius: '8px', 
          fontWeight: '600' 
        }}
      >
        &larr; Volver a Opciones
      </button>
      <h2 style={{color: 'black', marginBottom: '16px'}}>Editar Barra de Navegación</h2>
      
      <div className="control-group" style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Logo de la Tienda</label>
        <LogoUploader
          currentLogo={store.logo}
          onLogoChange={(logoUrl) => updateStore('logo', logoUrl)}
          storeId={store.id}
        />
      </div>
      
      <div className="control-group">
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Color de Fondo</label>
        <ColorPickerNew
          currentColor={store.navbarColor}
          onColorChange={(color: string) => updateStore('navbarColor', color)}
        />
      </div>
    </div>
  )
}
