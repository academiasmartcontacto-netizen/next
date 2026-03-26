'use client'

import { useState } from 'react'
import { Facebook, Instagram, Youtube, MessageCircle, Mail, MapPin, ExternalLink } from 'lucide-react'

interface ContactanosDrawerProps {
  onClose: () => void
  store: any
  updateStore: (field: string, value: any) => void
}

export default function ContactanosDrawer({ onClose, store, updateStore }: ContactanosDrawerProps) {
  const [channels, setChannels] = useState({
    facebook: store.facebook_url || '',
    instagram: store.instagram_url || '',
    youtube: store.youtube_url || '',
    whatsapp: store.whatsapp_url || '',
    telegram: store.telegram_url || '',
    email: store.email || '',
    googleMaps: store.google_maps_url || ''
  })

  const handleChannelChange = (channel: string, value: string) => {
    const newChannels = { ...channels, [channel]: value }
    setChannels(newChannels)
    updateStore(channel, value)
  }

  const channelConfigs = [
    {
      key: 'facebook',
      label: 'Facebook',
      placeholder: 'https://facebook.com/tu-pagina',
      icon: Facebook,
      color: '#1877F2'
    },
    {
      key: 'instagram',
      label: 'Instagram',
      placeholder: 'https://instagram.com/tu-perfil',
      icon: Instagram,
      color: '#E4405F'
    },
    {
      key: 'youtube',
      label: 'YouTube',
      placeholder: 'https://youtube.com/channel/tu-canal',
      icon: Youtube,
      color: '#FF0000'
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      placeholder: 'https://wa.me/59112345678',
      icon: MessageCircle,
      color: '#25D366'
    },
    {
      key: 'telegram',
      label: 'Telegram',
      placeholder: 'https://t.me/tu-usuario',
      icon: MessageCircle,
      color: '#0088cc'
    },
    {
      key: 'email',
      label: 'Correo Electrónico',
      placeholder: 'correo@ejemplo.com',
      icon: Mail,
      color: '#EA4335'
    },
    {
      key: 'googleMaps',
      label: 'Google Maps (Ubicación)',
      placeholder: 'https://maps.google.com/?q=ubicacion',
      icon: MapPin,
      color: '#4285F4'
    }
  ]

  return (
    <div style={{ padding: '16px', color: '#333' }}>
      <button 
        onClick={onClose} 
        style={{ 
          marginBottom: '24px', 
          color: '#333', 
          background: '#f0f0f0', 
          border: '1px solid #ccc', 
          padding: '8px 16px', 
          cursor: 'pointer', 
          borderRadius: '8px', 
          fontWeight: '600' 
        }}
      >
        &larr; Volver a Opciones
      </button>
      
      <h2 style={{ color: 'black', marginBottom: '16px' }}>Contáctanos</h2>
      <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
        Configura los enlaces a tus redes sociales y canales de contacto para que tus clientes puedan comunicarse contigo fácilmente.
      </p>

      <div className="control-group" style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px' }}>
          Redes Sociales y Contactos
        </label>
        
        {channelConfigs.map((config) => {
          const Icon = config.icon
          const value = channels[config.key as keyof typeof channels]
          
          return (
            <div key={config.key} style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '8px',
                gap: '8px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: config.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={16} color="white" />
                </div>
                <label style={{ 
                  fontWeight: '500', 
                  color: '#333',
                  fontSize: '14px'
                }}>
                  {config.label}
                </label>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="url"
                  value={value}
                  onChange={(e) => handleChannelChange(config.key, e.target.value)}
                  placeholder={config.placeholder}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b1a'
                    e.target.style.outline = 'none'
                    e.target.style.boxShadow = '0 0 0 2px rgba(255, 107, 26, 0.2)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#dee2e6'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                
                {value && (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '8px',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e9ecef'
                      e.currentTarget.style.borderColor = '#ff6b1a'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa'
                      e.currentTarget.style.borderColor = '#dee2e6'
                    }}
                    title={`Ver ${config.label}`}
                  >
                    <ExternalLink size={16} color="#666" />
                  </a>
                )}
              </div>
              
              {config.key === 'whatsapp' && (
                <p style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  marginTop: '4px',
                  fontStyle: 'italic'
                }}>
                  Formato: https://wa.me/código-país-número (ej: https://wa.me/59112345678)
                </p>
              )}
              
              {config.key === 'email' && (
                <p style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  marginTop: '4px',
                  fontStyle: 'italic'
                }}>
                  Los clientes podrán hacer clic para enviar un correo directamente
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ 
          color: '#495057', 
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          💡 Consejo Profesional
        </h4>
        <p style={{ 
          color: '#6c757d', 
          fontSize: '13px',
          lineHeight: '1.4',
          margin: 0
        }}>
          Asegúrate de que todos los enlaces funcionen correctamente antes de guardar. 
          Los canales configurados aparecerán en el footer de tu tienda para que 
          tus clientes puedan contactarte fácilmente.
        </p>
      </div>
    </div>
  )
}
