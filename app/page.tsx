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
        padding: '0',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Search Bar */}
        <SearchBar />
      </div>

      {/* Categories Section */}
      <div style={{ padding: '4rem 2rem' }}>
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
    </div>
  )
}
