'use client'

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BorderControlProps {
    style: string;
}

export default function BorderControl({ style }: BorderControlProps) {
    return (
        <div className="control-group">
            <Label>Bordes</Label>
            <Select defaultValue={style}>
                <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estilo..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="recto">Rectangular</SelectItem>
                    <SelectItem value="suave">Redondeado</SelectItem>
                    <SelectItem value="pill">Píldora</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
