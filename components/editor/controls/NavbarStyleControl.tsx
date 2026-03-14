'use client'

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface NavbarStyleControlProps {
    style: string;
}

export default function NavbarStyleControl({ style }: NavbarStyleControlProps) {
    return (
        <div className="control-group">
            <Label>Barra de Navegación</Label>
            <Select defaultValue={style}>
                <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estilo..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="blanco">Blanco</SelectItem>
                    <SelectItem value="marca">Color de Marca</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
