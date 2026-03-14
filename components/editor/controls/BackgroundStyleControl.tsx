'use client'

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BackgroundStyleControlProps {
    style: string;
}

export default function BackgroundStyleControl({ style }: BackgroundStyleControlProps) {
    return (
        <div className="control-group">
            <Label>Fondo de Página</Label>
            <Select defaultValue={style}>
                <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estilo..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="blanco">Blanco</SelectItem>
                    <SelectItem value="tintado">Color de Marca</SelectItem>
                    <SelectItem value="gris">Gris</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
