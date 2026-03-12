'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface MinimalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  required?: boolean
}

export const MinimalInput = React.forwardRef<HTMLInputElement, MinimalInputProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    required,
    id,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <div className="space-y-2">
        <Label 
          htmlFor={id}
          className={cn(
            "text-sm font-medium text-gray-900 transition-colors",
            error && "text-red-600",
            isFocused && "text-orange-600"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        <Input
          {...props}
          id={id}
          ref={ref}
          className={cn(
            "h-11 px-4 bg-white border border-gray-200 rounded-lg",
            "focus:bg-white focus:border-orange-500 focus:ring-0",
            "placeholder:text-gray-400",
            "transition-all duration-200",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
        />
        
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

MinimalInput.displayName = 'MinimalInput'
