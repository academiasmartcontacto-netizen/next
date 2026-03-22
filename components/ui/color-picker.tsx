
"use client"

import * as React from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-10 h-10 rounded border"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <div className="grid grid-cols-8 gap-2">
          {[
            "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff",
            "#c0c0c0", "#808080", "#800000", "#808000", "#008000", "#800080", "#008080", "#000080",
          ].map((c) => (
            <button
              key={c}
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: c }}
              onClick={() => {
                onChange(c)
                setIsOpen(false)
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
