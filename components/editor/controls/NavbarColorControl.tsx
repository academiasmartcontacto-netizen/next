'use client'

import { Label } from "@/components/ui/label"
import { useEditor } from "@/contexts/EditorContext"

const colorOptions = [
  { name: 'Rojo', value: '#ff0000' },
  { name: 'Naranja', value: '#ff6b1a' },
  { name: 'Azul', value: '#007bff' },
  { name: 'Verde', value: '#28a745' },
  { name: 'Negro', value: '#000000' },
  { name: 'Blanco', value: '#ffffff' },
]

export default function NavbarColorControl() {
    const { store, updateStore } = useEditor()

    return (
        <div className="control-group">
            <Label>Color de Barra de Navegación</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                {colorOptions.map(color => (
                    <button 
                        key={color.value} 
                        onClick={() => updateStore('navbarColor', color.value)}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: color.value,
                            border: store.navbarColor === color.value ? '3px solid #007bff' : '1px solid #ccc',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        title={color.name}
                    />
                ))}
            </div>
        </div>
    )
}
