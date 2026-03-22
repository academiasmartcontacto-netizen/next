'use client'

import { Label } from "@/components/ui/label"
import { useEditor } from "@/contexts/EditorContext"

interface ColorControlProps {
    label: string;
    property: 'colorPrimario' | 'navbarColor';
}

export default function ColorControl({ label, property }: ColorControlProps) {
    const { store, updateStore } = useEditor()
    
    // Provide a sensible default if the color is not set.
    const currentColor = store[property] || '#000000'

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateStore(property, e.target.value)
    }

    return (
        <div className="control-group">
            <Label>{label}</Label>
            <div className="flex items-center gap-2 mt-2">
                <div 
                    className="w-10 h-10 rounded border border-gray-300" 
                    style={{ backgroundColor: currentColor }}
                ></div>
                <input 
                    type="color" 
                    value={currentColor} 
                    onChange={handleColorChange}
                    className="w-20 h-10 p-1 border rounded cursor-pointer"
                />
                <input
                    type="text"
                    value={currentColor}
                    onChange={handleColorChange}
                    className="px-2 py-1 border rounded font-mono text-sm w-28"
                    placeholder="#RRGGBB"
                />
            </div>
        </div>
    )
}
