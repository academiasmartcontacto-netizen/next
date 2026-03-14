'use client'

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useEditor } from "@/contexts/EditorContext"

export default function StoreNameControl() {
    const { store, updateStore } = useEditor()

    return (
        <div className="control-group">
            <div className="control-group-header">
                <Label>Nombre</Label>
                <Switch 
                    checked={store.mostrar_nombre}
                    onCheckedChange={(value) => updateStore('mostrar_nombre', value)}
                />
            </div>
            <Input 
                value={store.nombre}
                onChange={(e) => updateStore('nombre', e.target.value)}
            />
        </div>
    )
}
