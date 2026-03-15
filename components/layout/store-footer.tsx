'use client'

import { useState } from 'react'

export default function StoreFooter() {
  const [showReportModal, setShowReportModal] = useState(false)

  const openReportModal = () => {
    setShowReportModal(true)
  }

  const closeReportModal = () => {
    setShowReportModal(false)
  }

  return (
    <>
      {/* Footer Blindado Done! */}
      <footer className="done-footer-wrapper bg-gray-900 text-white py-6 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="done-footer-content flex items-center justify-center space-x-4 text-sm">
            <span className="text-gray-300">
              Powered by{' '}
              <a 
                href="https://donebolivia.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="done-link text-orange-500 hover:text-orange-400 font-semibold transition-colors"
              >
                <strong>Done!</strong> Bolivia
              </a>
            </span>
            <span style={{ opacity: 0.3 }} className="text-gray-500">|</span>
            <button 
              onClick={openReportModal}
              className="done-report-link text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
            >
              <i className="fas fa-flag text-xs"></i>
              <span>Informar sobre esta tienda</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modal de Reporte */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Informar sobre esta tienda</h3>
              <button 
                onClick={closeReportModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Por favor, describe el motivo por el cual estás reportando esta tienda. Nos tomamos muy en serio los reportes y revisaremos cada caso.
            </p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo del reporte
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>Selecciona un motivo</option>
                  <option>Contenido inapropiado</option>
                  <option>Productos falsos o engañosos</option>
                  <option>Spam o publicidad no solicitada</option>
                  <option>Violación de derechos de autor</option>
                  <option>Otro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción detallada
                </label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe detalladamente el problema..."
                ></textarea>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeReportModal}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Enviar reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
