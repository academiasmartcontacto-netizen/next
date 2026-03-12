'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  required?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconClick?: () => void
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    required, 
    leftIcon, 
    rightIcon, 
    onRightIconClick,
    id,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)

    const inputType = props.type === 'password' && showPassword ? 'text' : props.type

    return (
      <div className="space-y-2">
        <Label 
          htmlFor={id}
          className={cn(
            "text-sm font-medium transition-colors",
            error ? "text-destructive" : "text-foreground",
            isFocused && "text-primary"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <Input
            {...props}
            type={inputType}
            id={id}
            ref={ref}
            className={cn(
              "transition-all duration-200",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-destructive focus:border-destructive focus:ring-destructive/20",
              isFocused && "ring-2 ring-primary/20",
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
          
          {rightIcon && (
            <button
              type="button"
              onClick={props.type === 'password' ? () => setShowPassword(!showPassword) : onRightIconClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {rightIcon}
            </button>
          )}
        </div>
        
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

FormInput.displayName = 'FormInput'
