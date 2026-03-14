'use client'

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TextSizeControlProps {
    size: string;
}

export default function TextSizeControl({ size }: TextSizeControlProps) {
    return (
        <div className="control-group">
            <Label>Tamaño de Texto</Label>
            <Select defaultValue={size}>
                <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tamaño..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="small">Pequeño</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
