'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  profile?: {
    firstName?: string
    lastName?: string
    avatar?: string
  }
  store?: {
    id: string
    name: string
    link: string
    isPublished: boolean
  } | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (phone: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (phone: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, password }),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    await checkAuth()
  }

  const logout = async () => {
    try {
      console.log('🚨 AUTH CONTEXT: INICIANDO LOGOUT GLOBAL')
      
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      console.log('🔍 AUTH CONTEXT: Response logout:', response.status)
      
      if (response.ok) {
        console.log('🚨 AUTH CONTEXT: API RESPONDIO OK, LIMPIANDO ESTADO GLOBAL')
        
        // Limpiar estado global
        setUser(null)
        
        // Limpiar almacenamiento local
        localStorage.clear()
        sessionStorage.clear()
        
        console.log('🚨 AUTH CONTEXT: ESTADO GLOBAL LIMPIADO, REDIRIGIENDO A LOGIN')
        
        // Redirección forzada
        window.location.href = '/login'
      } else {
        console.error('🚨 AUTH CONTEXT: ERROR EN API LOGOUT:', response.statusText)
      }
    } catch (error) {
      console.error('🚨 AUTH CONTEXT: ERROR GENERAL EN LOGOUT:', error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
