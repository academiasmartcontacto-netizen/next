'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface WaitlistFormProps {
  onSuccess?: () => void
}

export function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }])

      if (error) {
        if (error.code === '23505') {
          setMessage('Este email ya está registrado en nuestra lista de espera.')
          setMessageType('error')
        } else {
          throw error
        }
        return
      }

      setMessage('¡Gracias por suscribirte! Te mantendremos informado.')
      setMessageType('success')
      setEmail('')
      onSuccess?.()
    } catch (error) {
      console.error('Error subscribing to waitlist:', error)
      setMessage('Error al suscribirte. Por favor intenta de nuevo.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !email}
          className="w-full"
          size="lg"
        >
          {loading ? 'Suscribiendo...' : 'Suscribirse'}
        </Button>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          messageType === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}
