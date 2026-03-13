'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Mic, Loader2 } from 'lucide-react'
import { useDebounce } from 'use-debounce'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const recognitionRef = useRef<any>(null)
  
  const debouncedQuery = useDebounce(query, 300)
  
  // Web Speech API - Igual que tu PHP pero con hooks
  useEffect(() => {
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
        setQuery(transcript)
        // Auto-submit como en tu PHP
        setTimeout(() => {
          handleSearch(transcript)
        }, 500)
      }
      
      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])
  
  const startVoiceSearch = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }, [])
  
  const stopVoiceSearch = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])
  
  const handleSearch = useCallback((searchQuery: string) => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      // Redirección como en tu PHP
      window.location.href = `/products/search.php?q=${encodeURIComponent(searchQuery)}`
      setTimeout(() => setIsSearching(false), 1000)
    }
  }, [])
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="relative bg-white rounded-full shadow-lg overflow-hidden">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isListening ? "Escuchando..." : "Buscar en Done!"}
          className="w-full pl-12 pr-32 py-4 outline-none text-gray-700 placeholder-gray-400"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="p-2"
              >
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            type="button"
            onClick={isListening ? stopVoiceSearch : startVoiceSearch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative p-3 rounded-full transition-all duration-300
              ${isListening 
                ? 'bg-[#ff6b1a] text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <Mic className="w-4 h-4" />
            
            {/* Animación ripple igual que tu PHP */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.8 }}
                  exit={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-[#ff6b1a]"
                />
              )}
            </AnimatePresence>
          </motion.button>
          
          <motion.button
            type="submit"
            onClick={() => handleSearch(query)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-[#ff6b1a] text-white rounded-full hover:bg-[#e55a15] transition-colors"
          >
            <Search className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default SearchBar
