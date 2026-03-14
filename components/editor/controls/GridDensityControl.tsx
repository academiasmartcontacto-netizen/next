'use client'

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface GridDensityControlProps {
    density: string | number;
}

export default function GridDensityControl({ density }: GridDensityControlProps) {
    return (
        <div className="control-group">
            <Label>Columnas de Productos</Label>
            <Select defaultValue={String(density)}>
                <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="auto">Automático</SelectItem>
                    <SelectItem value="2">2 Columnas</SelectItem>
                    <SelectItem value="3">3 Columnas</SelectItem>
                    <SelectItem value="4">4 Columnas</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
