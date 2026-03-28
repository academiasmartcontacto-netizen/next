'use client'

import { ChevronRight, Home, Settings } from 'lucide-react'
import { ReactNode } from 'react'

interface BreadcrumbItem {
  label: string
  icon?: ReactNode
  href?: string
  current?: boolean
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[]
  onClose?: () => void
}

export default function BreadcrumbNavigation({ items, onClose }: BreadcrumbNavigationProps) {
  return (
    <nav 
      className="flex items-center justify-between"
      role="navigation"
      aria-label="Navegación de breadcrumbs"
    >
      {/* Breadcrumb Items */}
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight 
                size={16} 
                className="text-neutral-400 mx-2" 
                strokeWidth={1.5}
              />
            )}
            
            {item.href ? (
              <a
                href={item.href}
                className="flex items-center space-x-2 text-neutral-500 hover:text-primary-600 transition-colors duration-200 text-sm font-medium"
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </a>
            ) : (
              <div className="flex items-center space-x-2">
                {item.icon && <span className="text-neutral-600">{item.icon}</span>}
                <span 
                  className={`text-sm font-medium ${
                    item.current 
                      ? 'text-neutral-900' 
                      : 'text-neutral-600'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            )}
          </li>
        ))}
      </ol>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-all duration-200"
          aria-label="Cerrar configuración"
          title="Cerrar (ESC)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path 
              d="M12 4L4 12M4 4L12 12" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </nav>
  )
}
