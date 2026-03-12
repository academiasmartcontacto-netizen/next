'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface MinimalSelectProps {
  label: string
  error?: string
  helperText?: string
  required?: boolean
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  options: Array<{ value: string; label: string; disabled?: boolean }>
  className?: string
  disabled?: boolean
}

export const MinimalSelect = React.forwardRef<HTMLButtonElement, MinimalSelectProps>(
  ({ 
    label, 
    error, 
    helperText, 
    required, 
    placeholder = "Seleccionar...", 
    value,
    onValueChange,
    options,
    className,
    disabled,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <div className="space-y-2">
        <Label 
          className={cn(
            "text-sm font-medium text-gray-900 transition-colors",
            error && "text-red-600",
            isFocused && "text-orange-600"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        <Select 
          value={value} 
          onValueChange={onValueChange}
          onOpenChange={(open) => setIsFocused(open)}
          disabled={disabled}
        >
          <SelectTrigger
            ref={ref}
            className={cn(
              "h-11 px-4 bg-white border border-gray-200 rounded-lg",
              "focus:bg-white focus:border-orange-500 focus:ring-0",
              "placeholder:text-gray-400",
              "transition-all duration-200",
              error && "border-red-500 focus:border-red-500",
              disabled && "bg-gray-50 cursor-not-allowed",
              className
            )}
            {...props}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          
          <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="cursor-pointer hover:bg-orange-50 focus:bg-orange-100"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

MinimalSelect.displayName = 'MinimalSelect'
