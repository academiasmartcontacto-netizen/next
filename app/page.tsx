'use client'

import { useEffect } from 'react'
import { Search, MapPin, Star, Store, Heart } from 'lucide-react'
import Link from 'next/link'

import Navbar from '@/components/layout/navbar'
import SearchBar from '@/components/SearchBar'

export default function HomePage() {
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Navbar />
      
      {/* Main Content */}
      <div style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Search Bar */}
        <SearchBar />
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
