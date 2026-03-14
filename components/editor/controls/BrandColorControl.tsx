'use client'

import { Label } from "@/components/ui/label"

interface BrandColorControlProps {
    color: string;
}

export default function BrandColorControl({ color }: BrandColorControlProps) {
    return (
        <div className="control-group">
            <Label>Color de Marca</Label>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-10 h-10 rounded border" style={{ backgroundColor: color }}></div>
                <input type="color" defaultValue={color} className="w-20 h-10 p-1 border rounded" />
            </div>
        </div>
    )
}
