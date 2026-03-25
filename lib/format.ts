// Función segura para formatear números que evita problemas de hidratación
export const formatNumber = (num: number): string => {
  // Usar siempre el mismo formato simple para evitar diferencias server/client
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Función segura para formatear fechas que evita problemas de hidratación
export const formatDate = (date: Date | string): string => {
  if (typeof window === 'undefined') {
    // Server-side: usar formato ISO simple
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toISOString().split('T')[0]
  }
  // Client-side: usar locale del cliente
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}

// Función segura para formatear tiempo que evita problemas de hidratación
export const formatTime = (date: Date | string): string => {
  if (typeof window === 'undefined') {
    // Server-side: usar formato ISO simple
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toTimeString().split(' ')[0].substring(0, 5)
  }
  // Client-side: usar locale del cliente
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Función segura para formatear datetime que evita problemas de hidratación
export const formatDateTime = (date: Date | string): string => {
  if (typeof window === 'undefined') {
    // Server-side: usar formato ISO simple
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toISOString().replace('T', ' ').substring(0, 16)
  }
  // Client-side: usar locale del cliente
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString([], { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
