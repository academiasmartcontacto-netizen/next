'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { DrizzleWaitlistForm } from '@/components/drizzle/waitlist-form'

export default function Home() {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubscribeSuccess = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Bienvenido al Futuro Web
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubre la próxima generación de aplicaciones web construidas con 
            las tecnologías más modernas: Next.js 15, Drizzle ORM, Supabase, y Tailwind CSS.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Únete a la Lista de Espera
            </h2>
            <DrizzleWaitlistForm onSuccess={handleSubscribeSuccess} />
            
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm"
              >
                ¡Gracias por tu interés! Te contactaremos pronto.
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Rendimiento Ultra Rápido</h3>
              <p className="text-gray-600">
                Optimizado para velocidad con Next.js 15 y Drizzle ORM.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Base de Datos Moderna</h3>
              <p className="text-gray-600">
                Type safety extremo con Drizzle ORM y Supabase PostgreSQL.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Diseño Excepcional</h3>
              <p className="text-gray-600">
                UI moderna y responsiva con Tailwind CSS y componentes de alta calidad.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
