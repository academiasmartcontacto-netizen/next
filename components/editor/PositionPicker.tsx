'use client'

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface PositionPickerProps {
  currentPosition: string
  onPositionChange: (position: string) => void
}

export default function PositionPicker({ currentPosition, onPositionChange }: PositionPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const positions = [
    { value: 'left', label: 'Izquierda', icon: '←' },
    { value: 'center', label: 'Centro', icon: '↔' },
    { value: 'right', label: 'Derecha', icon: '→' }
  ]

  const selectedPosition = positions.find(p => p.value === currentPosition) || positions[1]

  return (
    <div className="position-picker">
      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
        Posición de Navegación
      </label>
      
      <div className="dropdown-container">
        <button
          type="button"
          className="dropdown-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="selected-content">
            <span className="position-icon">{selectedPosition.icon}</span>
            <span className="position-label">{selectedPosition.label}</span>
          </div>
          <ChevronDown 
            size={16} 
            className={`chevron ${isOpen ? 'open' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {positions.map((position) => (
              <button
                key={position.value}
                type="button"
                className={`dropdown-item ${position.value === currentPosition ? 'selected' : ''}`}
                onClick={() => {
                  onPositionChange(position.value)
                  setIsOpen(false)
                }}
              >
                <span className="position-icon">{position.icon}</span>
                <span className="position-label">{position.label}</span>
                {position.value === currentPosition && (
                  <Check size={14} className="check-icon" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .position-picker {
          width: 100%;
        }

        .dropdown-container {
          position: relative;
        }

        .dropdown-button {
          width: 100%;
          padding: 10px 12px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .dropdown-button:hover {
          border-color: #3b82f6;
          background: #f8fafc;
        }

        .dropdown-button:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .selected-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .position-icon {
          font-weight: bold;
          color: #6b7280;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
        }

        .position-label {
          color: #374151;
        }

        .chevron {
          color: #6b7280;
          transition: transform 0.2s ease;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 4px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 50;
          overflow: hidden;
        }

        .dropdown-item {
          width: 100%;
          padding: 10px 12px;
          background: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.2s ease;
          font-size: 14px;
        }

        .dropdown-item:hover {
          background: #f3f4f6;
        }

        .dropdown-item.selected {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .dropdown-item.selected .position-icon {
          color: #1d4ed8;
        }

        .check-icon {
          margin-left: auto;
          color: #1d4ed8;
        }
      `}</style>
    </div>
  )
}
