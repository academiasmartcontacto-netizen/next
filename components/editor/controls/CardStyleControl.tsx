'use client'

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CardStyleControlProps {
    style: string;
}

export default function CardStyleControl({ style }: CardStyleControlProps) {
    return (
        <div className="control-group">
            <Label>Estilo de Tarjetas</Label>
            <Select defaultValue={style}>
                <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estilo..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="elevada">Flotante</SelectItem>
                    <SelectItem value="borde">Con borde</SelectItem>
                    <SelectItem value="flat">Sin borde</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
