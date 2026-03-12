'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FormSelectProps {
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

export const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
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
            "text-sm font-medium transition-colors",
            error ? "text-destructive" : "text-foreground",
            isFocused && "text-primary"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
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
              "transition-all duration-200",
              error && "border-destructive focus:border-destructive focus:ring-destructive/20",
              isFocused && "ring-2 ring-primary/20",
              className
            )}
            {...props}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          
          <SelectContent className="max-h-60">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {error && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'
