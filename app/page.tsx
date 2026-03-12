'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Mic, MapPin, Star, Store, Heart, User } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/navbar'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)
  const recognitionRef = useRef<any>(null)

  // Mock de categorías
  const categories = [
    { id: 1, name: 'Vehículos', icon: '🚗', slug: 'vehiculos' },
    { id: 2, name: 'Inmuebles', icon: '🏠', slug: 'inmuebles' },
    { id: 3, name: 'Electrónica', icon: '📱', slug: 'electronica' },
    { id: 4, name: 'Prendas', icon: '👕', slug: 'prendas' },
    { id: 5, name: 'Servicios', icon: '🔧', slug: 'servicios' },
    { id: 6, name: 'Animales', icon: '🐕', slug: 'animales' },
    { id: 7, name: 'Hogar', icon: '🏡', slug: 'hogar' },
    { id: 8, name: 'Trabajo', icon: '💼', slug: 'trabajo' }
  ]

  useEffect(() => {
    checkVoiceSupport()
  }, [])

  const checkVoiceSupport = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'es-BO'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      setShowVoiceSearch(true)
    }
  }

  const startVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar />
      
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Academia Smart
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
          Tu marketplace inteligente para conectar con lo mejor de tu comunidad
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{
          maxWidth: '600px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: '50px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos, servicios o tiendas..."
              style={{
                flex: 1,
                border: 'none',
                padding: '1rem 1.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            
            {showVoiceSearch && (
              <button
                type="button"
                onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                style={{
                  border: 'none',
                  background: isListening ? '#dc3545' : '#28a745',
                  color: 'white',
                  padding: '0 1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <Mic size={20} />
              </button>
            )}
            
            <button
              type="submit"
              style={{
                border: 'none',
                background: '#007bff',
                color: 'white',
                padding: '0 2rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Categories Section */}
      <div style={{ padding: '4rem 2rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>
          Explora por Categorías
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {categories.map(category => (
            <Link
              key={category.id}
              href={`/explore?category=${category.slug}`}
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '15px',
                textDecoration: 'none',
                color: '#333',
                textAlign: 'center',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {category.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div style={{ backgroundColor: 'white', padding: '4rem 2rem' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Store size={48} style={{ color: '#007bff', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Tiendas Locales</h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>
              Descubre y apoya a los negocios de tu comunidad
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Heart size={48} style={{ color: '#dc3545', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Favoritos</h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>
              Guarda lo que más te gusta y encuentra fácilmente
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <MapPin size={48} style={{ color: '#28a745', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Cerca de Ti</h3>
            <p style={{ color: '#666', lineHeight: 1.6 }}>
              Encuentra productos y servicios en tu zona
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          textAlign: 'left'
        }}>
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Academia Smart</h4>
            <p style={{ color: '#ccc', lineHeight: 1.6 }}>
              Tu marketplace inteligente para conectar con lo mejor de tu comunidad
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Enlaces</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/explore" style={{ color: '#ccc', textDecoration: 'none' }}>Explorar</Link>
              <Link href="/marketplace" style={{ color: '#ccc', textDecoration: 'none' }}>Marketplace</Link>
              <Link href="/about" style={{ color: '#ccc', textDecoration: 'none' }}>Nosotros</Link>
            </div>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Contacto</h4>
            <p style={{ color: '#ccc', lineHeight: 1.6 }}>
              info@academiasmart.com<br />
              La Paz, Bolivia
            </p>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #555' }}>
          <p style={{ color: '#ccc' }}>
            © 2024 Academia Smart. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
