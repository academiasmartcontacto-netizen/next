'use client'

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PhotoFormatControlProps {
    style: string;
}

export default function PhotoFormatControl({ style }: PhotoFormatControlProps) {
    return (
        <div className="control-group">
            <Label>Formato de Fotos</Label>
            <Select defaultValue={style}>
                <SelectTrigger>
                    <SelectValue placeholder="Seleccionar formato..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="cuadrado">Cuadrado</SelectItem>
                    <SelectItem value="vertical">Vertical</SelectItem>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
                    <SelectItem value="natural">Sin recorte</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
