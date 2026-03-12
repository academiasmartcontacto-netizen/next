'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface PasswordStrengthProps {
  password: string
  showText?: boolean
}

interface StrengthLevel {
  score: number
  label: string
  color: string
  bgColor: string
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ 
  password, 
  showText = true 
}) => {
  const getStrength = (password: string): StrengthLevel => {
    if (!password) return { score: 0, label: '', color: '', bgColor: '' }
    
    let score = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    score = Object.values(checks).filter(Boolean).length
    
    const levels: Record<number, StrengthLevel> = {
      0: { score: 0, label: '', color: '', bgColor: '' },
      1: { score: 1, label: 'Muy débil', color: 'bg-destructive', bgColor: 'bg-destructive/20' },
      2: { score: 2, label: 'Débil', color: 'bg-orange-500', bgColor: 'bg-orange-500/20' },
      3: { score: 3, label: 'Regular', color: 'bg-yellow-500', bgColor: 'bg-yellow-500/20' },
      4: { score: 4, label: 'Fuerte', color: 'bg-blue-500', bgColor: 'bg-blue-500/20' },
      5: { score: 5, label: 'Muy fuerte', color: 'bg-green-500', bgColor: 'bg-green-500/20' }
    }
    
    return levels[score] || levels[0]
  }
  
  const strength = getStrength(password)
  
  if (strength.score === 0) return null
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {showText && (
          <span className={cn(
            "text-xs font-medium transition-colors",
            strength.color.replace('bg-', 'text-')
          )}>
            {strength.label}
          </span>
        )}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={cn(
                "h-1.5 w-8 rounded-full transition-all duration-300",
                level <= strength.score 
                  ? strength.color 
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className={cn(
          "h-1 rounded-full transition-all duration-300",
          strength.bgColor
        )}>
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              strength.color
            )}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className={cn(
            "w-3 h-3 rounded-full flex items-center justify-center",
            password.length >= 8 ? "bg-green-500" : "bg-muted"
          )}>
            {password.length >= 8 && (
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span className={password.length >= 8 ? "text-foreground" : "text-muted-foreground"}>
            8+ caracteres
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className={cn(
            "w-3 h-3 rounded-full flex items-center justify-center",
            /[A-Z]/.test(password) ? "bg-green-500" : "bg-muted"
          )}>
            {/[A-Z]/.test(password) && (
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span className={/[A-Z]/.test(password) ? "text-foreground" : "text-muted-foreground"}>
            Mayúscula
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className={cn(
            "w-3 h-3 rounded-full flex items-center justify-center",
            /\d/.test(password) ? "bg-green-500" : "bg-muted"
          )}>
            {/\d/.test(password) && (
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span className={/\d/.test(password) ? "text-foreground" : "text-muted-foreground"}>
            Número
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className={cn(
            "w-3 h-3 rounded-full flex items-center justify-center",
            /[!@#$%^&*(),.?":{}|<>]/.test(password) ? "bg-green-500" : "bg-muted"
          )}>
            {/[!@#$%^&*(),.?":{}|<>]/.test(password) && (
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-foreground" : "text-muted-foreground"}>
            Especial
          </span>
        </div>
      </div>
    </div>
  )
}
