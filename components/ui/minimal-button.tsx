'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/utils'

const minimalButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500 shadow-sm",
        outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-orange-500",
        ghost: "text-gray-700 hover:bg-gray-100 focus:ring-orange-500",
        link: "text-orange-600 underline-offset-4 hover:underline focus:ring-orange-500",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 py-1.5 text-sm",
        lg: "h-13 px-8 py-3 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface MinimalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof minimalButtonVariants> {
  asChild?: boolean
  loading?: boolean
}

const MinimalButton = React.forwardRef<HTMLButtonElement, MinimalButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    if (asChild) {
      // When asChild is true, we need to render the child directly
      // and apply the button styles to it
      const child = React.Children.only(children) as React.ReactElement
      return React.cloneElement(child, {
        className: cn(minimalButtonVariants({ variant, size, className }), child.props.className),
        disabled: disabled || loading || child.props.disabled,
        ref,
        ...props,
        ...child.props,
        children: loading ? (
          <>
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {typeof child.props.children === 'string' ? child.props.children : ''}
          </>
        ) : child.props.children
      })
    }
    
    return (
      <button
        className={cn(minimalButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

MinimalButton.displayName = 'MinimalButton'

export { MinimalButton, minimalButtonVariants }
