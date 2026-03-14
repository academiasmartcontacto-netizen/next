'use client'

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// TODO: Get this from a config or API
const fonts = [
    { value: 'system', label: 'Predeterminado' },
    { value: 'inter', label: 'Inter' },
    { value: 'jakarta', label: 'Plus Jakarta' },
    { value: 'manrope', label: 'Manrope' },
    { value: 'modern', label: 'Poppins' },
    { value: 'tech', label: 'Space Mono' },
    { value: 'minimal', label: 'Roboto' },
    { value: 'classic', label: 'Lora' },
    { value: 'bold', label: 'Montserrat' },
    { value: 'outfit', label: 'Outfit' },
];

interface FontControlProps {
    font: string;
}

export default function FontControl({ font }: FontControlProps) {
    return (
        <div className="control-group">
            <Label>Tipografía</Label>
            <Select defaultValue={font}>
                <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipografía..." />
                </SelectTrigger>
                <SelectContent>
                    {fonts.map(f => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
