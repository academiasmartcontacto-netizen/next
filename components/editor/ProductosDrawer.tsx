'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  X, Plus, Upload, Package, AlertCircle, Loader2, 
  Truck, Tag, Star
} from 'lucide-react'

interface ProductosDrawerProps {
  onClose: () => void
  store: any
  updateStore: (field: string, value: any) => void
  editingProductId?: string
}

export default function ProductosDrawer({ onClose, store, updateStore, editingProductId }: ProductosDrawerProps) {
  const [formData, setFormData] = useState({
    categoria_id: '',
    subcategoria_id: '',
    titulo: '',
    descripcion: '',
    precio: '',
    estado: '',
    departamento: '',
    municipio: '',
    categoria_tienda: '',
    badges: [] as string[],
    imagenes: [] as File[]
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)

  // Cargar datos del producto si está en modo edición
  useEffect(() => {
    if (editingProductId && editingProductId !== 'undefined' && store?.id) {
      loadProductData()
    } else {
      // Resetear formulario si no hay edición
      resetForm()
    }
  }, [editingProductId, store?.id])

  const loadProductData = async () => {
    if (!editingProductId || !store?.id) return
    
    try {
      setIsLoadingProduct(true)
      
      // Obtener datos del producto
      const response = await fetch(`/api/products/${editingProductId}`)
      
      if (response.ok) {
        const data = await response.json()
        const product = data.product
        
        console.log('=== DATOS RECIBIDOS EN FRONTEND ===')
        console.log('1. Data completa:', data)
        console.log('2. Product:', product)
        console.log('3. categoria_id:', product?.categoria_id)
        console.log('4. subcategoria_id:', product?.subcategoria_id)
        console.log('5. departamento:', product?.departamento)
        console.log('6. municipio:', product?.municipio)
        console.log('7. estado:', product?.estado)
        console.log('8. categoria_tienda:', product?.categoria_tienda)
        
        if (product) {
          // Cargar todos los campos del producto
          const newFormData = {
            categoria_id: product.categoria_id || '',
            subcategoria_id: product.subcategoria_id || '',
            titulo: product.titulo || '',
            descripcion: product.descripcion || '',
            precio: product.precio ? product.precio.toString() : '',
            estado: product.estado || 'nuevo',
            departamento: product.departamento || '',
            municipio: product.municipio || '',
            categoria_tienda: product.categoria_tienda || '',
            badges: product.badges || [],
            imagenes: []
          }
          
          console.log('=== FORM DATA A SETEAR ===')
          console.log('1. newFormData:', newFormData)
          
          setFormData(newFormData)
          
          // Cargar imágenes existentes
          console.log('=== IMAGEN DEL PRODUCTO ===')
          console.log('1. product.imagen:', product.imagen)
          console.log('2. product.image:', product.image)
          console.log('3. Tipo de product.imagen:', typeof product.imagen)
          console.log('4. Tipo de product.image:', typeof product.image)
          
          if (product.imagen) {
            console.log('✅ Usando product.imagen:', product.imagen)
            setPreviewImages([product.imagen])
          } else if (product.image) {
            console.log('✅ Usando product.image:', product.image)
            setPreviewImages([product.image])
          } else {
            console.log('❌ No se encontró imagen')
          }
        }
      } else {
        const errorData = await response.json()
        alert(`Error al cargar los datos del producto: ${errorData.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Error al cargar producto:', error)
      alert('Error de conexión al cargar el producto')
    } finally {
      setIsLoadingProduct(false)
    }
  }

  const resetForm = () => {
    setFormData({
      categoria_id: '',
      subcategoria_id: '',
      titulo: '',
      descripcion: '',
      precio: '',
      estado: '',
      departamento: '',
      municipio: '',
      categoria_tienda: '',
      badges: [],
      imagenes: []
    })
    setPreviewImages([])
    setErrors({})
  }

  // Categorías reales (basadas en D:/FUNCIONAL)
  const categorias = [
    { id: 1, nombre: 'Vehículos' },
    { id: 2, nombre: 'Dispositivos' },
    { id: 3, nombre: 'Electrodomésticos' },
    { id: 4, nombre: 'Herramientas' },
    { id: 5, nombre: 'Inmuebles' },
    { id: 6, nombre: 'Juguetes' },
    { id: 7, nombre: 'Muebles' },
    { id: 8, nombre: 'Prendas' }
  ]

  // Subcategorías reales (basadas en D:/FUNCIONAL/api/subcategorias.php)
  const subcategorias: Record<number, Array<{id: number, nombre: string}>> = {
    1: [ // Vehículos
      { id: 11, nombre: 'Motocicletas' },
      { id: 12, nombre: 'Buses/Micros' },
      { id: 13, nombre: 'Automóviles' },
      { id: 14, nombre: 'Bicicletas' },
      { id: 15, nombre: 'Camionetas' },
      { id: 16, nombre: 'Vagonetas' },
      { id: 17, nombre: 'Camiones' },
      { id: 18, nombre: 'Otros' }
    ],
    2: [ // Dispositivos
      { id: 21, nombre: 'Celulares' },
      { id: 22, nombre: 'Tablets' },
      { id: 23, nombre: 'Relojes' },
      { id: 24, nombre: 'Consolas' },
      { id: 25, nombre: 'Laptops' },
      { id: 26, nombre: 'PCs de escritorio' },
      { id: 27, nombre: 'Otros' }
    ],
    3: [ // Electrodomésticos
      { id: 31, nombre: 'Aspiradoras' },
      { id: 32, nombre: 'Cocinas' },
      { id: 33, nombre: 'Lavadoras' },
      { id: 34, nombre: 'Microondas' },
      { id: 35, nombre: 'Refrigeradores' },
      { id: 36, nombre: 'Televisores' },
      { id: 37, nombre: 'Otros' }
    ],
    4: [ // Herramientas
      { id: 41, nombre: 'Herramientas Manuales' },
      { id: 42, nombre: 'Herramientas Eléctricas' },
      { id: 43, nombre: 'Herramientas Inalámbricas' },
      { id: 44, nombre: 'Herramientas Neumáticas' },
      { id: 45, nombre: 'Medición y Nivelación' },
      { id: 46, nombre: 'Jardinería y Exterior' },
      { id: 47, nombre: 'Seguridad y Protección' },
      { id: 48, nombre: 'Soldadura y Corte' },
      { id: 49, nombre: 'Almacenamiento de Herramientas' },
      { id: 50, nombre: 'Otros' }
    ],
    5: [ // Inmuebles
      { id: 51, nombre: 'Departamentos' },
      { id: 52, nombre: 'Habitaciones' },
      { id: 53, nombre: 'Terrenos' },
      { id: 54, nombre: 'Galpones' },
      { id: 55, nombre: 'Oficinas' },
      { id: 56, nombre: 'Locales' },
      { id: 57, nombre: 'Casas' },
      { id: 58, nombre: 'Otros' }
    ],
    6: [ // Juguetes
      { id: 61, nombre: 'Didácticos' },
      { id: 62, nombre: 'Vehículos' },
      { id: 63, nombre: 'Peluches' },
      { id: 64, nombre: 'Muñecas' },
      { id: 65, nombre: 'Pelotas' },
      { id: 66, nombre: 'Bloques' },
      { id: 67, nombre: 'Acción' },
      { id: 68, nombre: 'Bebés' },
      { id: 69, nombre: 'Mesa' },
      { id: 70, nombre: 'Otros' }
    ],
    7: [ // Muebles
      { id: 71, nombre: 'Estantes y repisas' },
      { id: 72, nombre: 'Sofás y sillones' },
      { id: 73, nombre: 'Muebles de TV' },
      { id: 74, nombre: 'Escritorios' },
      { id: 75, nombre: 'Colchones' },
      { id: 76, nombre: 'Roperos' },
      { id: 77, nombre: 'Somier' },
      { id: 78, nombre: 'Comedor' },
      { id: 79, nombre: 'Sillas' },
      { id: 80, nombre: 'Mesas' },
      { id: 81, nombre: 'Catres' },
      { id: 82, nombre: 'Otros' }
    ],
    8: [ // Prendas
      { id: 91, nombre: 'Sandalias' },
      { id: 92, nombre: 'Tacones' },
      { id: 93, nombre: 'Zapatos' },
      { id: 94, nombre: 'Crocs' },
      { id: 95, nombre: 'Joyas' },
      { id: 96, nombre: 'Tenis' },
      { id: 97, nombre: 'Ropa' },
      { id: 98, nombre: 'Otros' }
    ]
  }

  // Departamentos de Bolivia (códigos) - Datos INE 2024
  const departamentos = [
    { codigo: 'CH', nombre: 'Chuquisaca' },
    { codigo: 'LP', nombre: 'La Paz' },
    { codigo: 'CB', nombre: 'Cochabamba' },
    { codigo: 'OR', nombre: 'Oruro' },
    { codigo: 'PT', nombre: 'Potosí' },
    { codigo: 'TJ', nombre: 'Tarija' },
    { codigo: 'SC', nombre: 'Santa Cruz' },
    { codigo: 'BN', nombre: 'Beni' },
    { codigo: 'PA', nombre: 'Pando' }
  ]

  // Municipios (ejemplo para La Paz)
  const municipios: Record<string, Array<{codigo: string, nombre: string}>> = {
    'LP': [
      { codigo: 'LP001', nombre: 'La Paz' },
      { codigo: 'LP002', nombre: 'El Alto' },
      { codigo: 'LP003', nombre: 'Viacha' }
    ],
    'CB': [
      { codigo: 'CB001', nombre: 'Cochabamba' },
      { codigo: 'CB002', nombre: 'Sacaba' },
      { codigo: 'CB003', nombre: 'Quillacollo' }
    ],
    'SC': [
      { codigo: 'SC001', nombre: 'Santa Cruz de la Sierra' },
      { codigo: 'SC002', nombre: 'Montero' },
      { codigo: 'SC003', nombre: 'Warnes' }
    ]
  }

  // Estados del producto
  const estados = [
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'como_nuevo', label: 'Como Nuevo' },
    { value: 'buen_estado', label: 'Buen Estado' },
    { value: 'aceptable', label: 'Aceptable' }
  ]

  // Badges disponibles (Opciones de Entrega)
  const badgesDisponibles = [
    { value: 'envio_gratis', label: 'Ofrezco Envío Gratis', icon: Truck, color: '#22c55e' },
    { value: 'oferta', label: 'Marcar como Oferta', icon: Tag, color: '#f59e0b' },
    { value: 'nuevo', label: 'Marcar como Novedad', icon: Star, color: '#3b82f6' }
  ]

  // Secciones de tienda (simuladas)
  const seccionesTienda = store?.menu_items ? 
    JSON.parse(store.menu_items).filter((item: any) => item.label).map((item: any) => item.label) : 
    ['Productos', 'Servicios', 'Promociones']

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleBadgeToggle = (badge: string) => {
    setFormData(prev => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter(b => b !== badge)
        : [...prev.badges, badge]
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const isValidType = file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
      return isValidType && isValidSize
    })

    if (validFiles.length + formData.imagenes.length > 5) {
      setErrors(prev => ({ ...prev, imagenes: 'Máximo 5 imágenes permitidas' }))
      return
    }

    setFormData(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, ...validFiles]
    }))

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })

    if (errors.imagenes) {
      setErrors(prev => ({ ...prev, imagenes: '' }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }))
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.categoria_id) newErrors.categoria_id = 'Debes seleccionar una categoría'
    if (!formData.subcategoria_id) newErrors.subcategoria_id = 'Debes seleccionar una subcategoría'
    if (!formData.titulo || formData.titulo.length < 10) newErrors.titulo = 'El título debe tener al menos 10 caracteres'
    if (!formData.descripcion || formData.descripcion.length < 20) newErrors.descripcion = 'La descripción debe tener al menos 20 caracteres'
    if (!formData.precio || parseFloat(formData.precio) <= 0) newErrors.precio = 'Debes ingresar un precio válido'
    if (!formData.estado) newErrors.estado = 'Debes seleccionar el estado del producto'
    if (!formData.departamento) newErrors.departamento = 'Debes seleccionar un departamento'
    if (!formData.municipio) newErrors.municipio = 'Debes seleccionar un municipio'
    
    // Validación de imagen diferente para creación vs edición
    const isEditing = !!editingProductId
    if (isEditing) {
      // En edición, verificar que haya imagen en preview (existente o nueva)
      if (previewImages.length === 0) {
        newErrors.imagenes = 'Debes agregar al menos una imagen'
      }
    } else {
      // En creación, verificar que se hayan subido archivos
      if (formData.imagenes.length === 0) {
        newErrors.imagenes = 'Debes agregar al menos una imagen'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Determinar si es creación o edición
      const isEditing = !!editingProductId
      const apiUrl = isEditing ? `/api/products/${editingProductId}` : '/api/products/create'
      const method = isEditing ? 'PUT' : 'POST'

      // Para PUT (edición) enviar JSON, para POST (creación) enviar FormData
      if (isEditing) {
        // PUT con JSON para edición
        const jsonData = {
          categoria_id: formData.categoria_id,
          subcategoria_id: formData.subcategoria_id,
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          precio: formData.precio,
          estado: formData.estado,
          departamento: formData.departamento,
          municipio: formData.municipio,
          categoria_tienda: formData.categoria_tienda,
          badges: formData.badges,
          store_id: store.id,
          // Mantener imagen existente si no se subió nueva
          imagen: previewImages.length > 0 ? previewImages[0] : undefined
        }

        const response = await fetch(apiUrl, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData)
        })

        const result = await response.json()

        if (result.success) {
          alert('¡Producto actualizado exitosamente!')
          onClose()
          resetForm()
        } else {
          setErrors(prev => ({ ...prev, general: result.error || 'Error al actualizar el producto' }))
        }
      } else {
        // POST con FormData para creación (con imágenes)
        const formDataToSend = new FormData()
        
        // Agregar todos los campos del formulario
        Object.keys(formData).forEach(key => {
          if (key === 'imagenes') {
            formData.imagenes.forEach((file, index) => {
              formDataToSend.append(`imagenes[]`, file)
            })
          } else if (key === 'badges') {
            formDataToSend.append('badges', JSON.stringify(formData.badges))
          } else {
            formDataToSend.append(key, formData[key as string])
          }
        })

        // Agregar store ID
        formDataToSend.append('store_id', store.id)

        const response = await fetch(apiUrl, {
          method: method,
          body: formDataToSend
        })

        const result = await response.json()

        if (result.success) {
          alert('¡Producto creado exitosamente!')
          onClose()
          resetForm()
        } else {
          setErrors(prev => ({ ...prev, general: result.message || 'Error al crear el producto' }))
        }
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, general: 'Error de conexión. Intenta nuevamente.' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedDepartamento = departamentos.find(d => d.codigo === formData.departamento)
  const municipiosDisponibles = selectedDepartamento ? municipios[selectedDepartamento.codigo] || [] : []
  const subcategoriasDisponibles = formData.categoria_id ? subcategorias[parseInt(formData.categoria_id)] || [] : []

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ 
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Package style={{ width: '24px', height: '24px', color: '#f97316' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
            {editingProductId ? 'Editar Producto' : 'Añadir Producto'}
          </h2>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '8px',
            background: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#6b7280',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>
      </div>

      {/* Form Content - SIN NINGÚN SCROLL INTERNO */}
      <div style={{ flex: 1, padding: '24px', overflow: 'visible' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Error General */}
          {errors.general && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626' }} />
              <span style={{ color: '#dc2626', fontSize: '14px' }}>{errors.general}</span>
            </div>
          )}

          {/* CATEGORÍA */}
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2c3e50', margin: '0 0 16px 0', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>
              Categoría
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Categoría <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={formData.categoria_id}
                  onChange={(e) => {
                    handleInputChange('categoria_id', e.target.value)
                    handleInputChange('subcategoria_id', '')
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '15px',
                    backgroundColor: '#fff',
                    outline: 'none',
                    height: '48px',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b1a'
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 26, 0.1)'
                    e.target.style.backgroundColor = '#fffbf8'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                    e.target.style.backgroundColor = '#fff'
                  }}
                >
                  <option value="">Seleccionar</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
                {errors.categoria_id && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.categoria_id}</p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Subcategoría <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={formData.subcategoria_id}
                  onChange={(e) => handleInputChange('subcategoria_id', e.target.value)}
                  disabled={!formData.categoria_id}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '15px',
                    backgroundColor: !formData.categoria_id ? '#f9fafb' : '#fff',
                    outline: 'none',
                    height: '48px',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    if (formData.categoria_id) {
                      e.target.style.borderColor = '#ff6b1a'
                      e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 26, 0.1)'
                      e.target.style.backgroundColor = '#fffbf8'
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                    e.target.style.backgroundColor = formData.categoria_id ? '#fff' : '#f9fafb'
                  }}
                >
                  <option value="">
                    {formData.categoria_id ? 'Seleccionar subcategoría' : 'Primero elige categoría'}
                  </option>
                  {subcategoriasDisponibles.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.nombre}</option>
                  ))}
                </select>
                {errors.subcategoria_id && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.subcategoria_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2c3e50', margin: '0 0 16px 0', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>
              Descripción
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Título del producto <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value.toUpperCase())}
                placeholder="Título del producto (mínimo 10 caracteres)"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1.5px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none',
                  height: '48px',
                  boxSizing: 'border-box',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ff6b1a'
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 26, 0.1)'
                  e.target.style.backgroundColor = '#fffbf8'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                  e.target.style.backgroundColor = '#fff'
                }}
              />
              {errors.titulo && (
                <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.titulo}</p>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Descripción <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Describe tu producto (mínimo 20 caracteres)"
                rows={4}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1.5px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '110px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ff6b1a'
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 26, 0.1)'
                  e.target.style.backgroundColor = '#fffbf8'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                  e.target.style.backgroundColor = '#fff'
                }}
              />
              {errors.descripcion && (
                <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.descripcion}</p>
              )}
            </div>
          </div>

          {/* FOTOGRAFÍAS */}
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2c3e50', margin: '0 0 16px 0', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>
              Fotografías
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', width: '100%' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '12px', 
                flexWrap: 'wrap', 
                maxWidth: '600px', 
                margin: '0 auto' 
              }}>
                {/* Botón agregar */}
                {formData.imagenes.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      aspectRatio: '1',
                      border: '2px dashed #d1d5db',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      background: 'transparent',
                      transition: 'all 0.3s ease',
                      width: '120px',
                      height: '120px'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#ff6b1a'
                      e.currentTarget.style.backgroundColor = '#fffbf8'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <Upload style={{ width: '24px', height: '24px', color: '#6b7280', marginBottom: '8px' }} />
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Agregar</span>
                  </button>
                )}
                
                {/* Previews */}
                {previewImages.map((preview, index) => (
                  <div key={index} style={{ position: 'relative', width: '120px', height: '120px' }}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb'
                      }}
                    />
                    {index === 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '5px',
                        fontSize: '10px',
                        fontWeight: '700',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                      }}>
                        PRINCIPAL
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '28px',
                        height: '28px',
                        background: 'rgba(0,0,0,0.75)',
                        border: 'none',
                        borderRadius: '50%',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '18px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626'
                        e.currentTarget.style.transform = 'scale(1.1)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.75)'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <p style={{ fontSize: '13px', color: '#333', margin: '8px 0 0 0', fontWeight: '600' }}>
              Máximo 5 fotos • La primera será la principal
            </p>
            {errors.imagenes && (
              <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.imagenes}</p>
            )}
          </div>

          {/* PRECIO */}
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2c3e50', margin: '0 0 16px 0', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>
              Precio
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Precio <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.precio}
                  onChange={(e) => handleInputChange('precio', e.target.value)}
                  placeholder="1000"
                  inputMode="numeric"
                  pattern="[0-9]+"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    height: '48px',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b1a'
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 26, 0.1)'
                    e.target.style.backgroundColor = '#fffbf8'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                    e.target.style.backgroundColor = '#fff'
                  }}
                />
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', marginBottom: '0', minHeight: '18px', fontStyle: 'italic', fontWeight: '500' }}>
                  {formData.precio && parseFloat(formData.precio) > 0 ? `Bs ${parseFloat(formData.precio).toLocaleString('es-BO')}` : ''}
                </div>
                {errors.precio && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.precio}</p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Estado <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    height: '48px',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b1a'
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 26, 0.1)'
                    e.target.style.backgroundColor = '#fffbf8'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                    e.target.style.backgroundColor = '#fff'
                  }}
                >
                  <option value="">Estado</option>
                  {estados.map(estado => (
                    <option key={estado.value} value={estado.value}>{estado.label}</option>
                  ))}
                </select>
                {errors.estado && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.estado}</p>
                )}
              </div>
            </div>
          </div>

          {/* OPCIONES DE ENTREGA */}
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2c3e50', margin: '0 0 16px 0', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>
              Opciones de Entrega
            </h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {badgesDisponibles.map(badge => {
                const Icon = badge.icon
                const isSelected = formData.badges.includes(badge.value)
                return (
                  <label
                    key={badge.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      border: isSelected ? '2px solid #ff6b1a' : '2px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backgroundColor: isSelected ? '#fffbf8' : '#fff'
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#9ca3af'
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#e5e7eb'
                        e.currentTarget.style.backgroundColor = '#fff'
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleBadgeToggle(badge.value)}
                      style={{ display: 'none' }}
                    />
                    <Icon style={{ width: '16px', height: '16px', color: badge.color }} />
                    <span style={{ fontSize: '14px', color: '#374151' }}>{badge.label}</span>
                  </label>
                )
              })}
            </div>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
              Selecciona las insignias que apliquen a tu producto.
            </p>
          </div>

          {/* SECCIÓN DE TIENDA */}
          {seccionesTienda.length > 0 && (
            <div style={{ 
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2c3e50', margin: '0 0 16px 0', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>
                Sección de tu Tienda
              </h3>
              <select
                value={formData.categoria_tienda}
                onChange={(e) => handleInputChange('categoria_tienda', e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1.5px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none',
                  height: '48px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ff6b1a'
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 26, 0.1)'
                  e.target.style.backgroundColor = '#fffbf8'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                  e.target.style.backgroundColor = '#fff'
                }}
              >
                <option value="">Mostrar en "Inicio" solamente</option>
                {seccionesTienda.map(seccion => (
                  <option key={seccion} value={seccion.toLowerCase()}>
                    {seccion}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                Elige en qué sección de tu tienda <strong>{store?.nombre || 'tu tienda'}</strong> quieres que aparezca este producto.
              </p>
            </div>
          )}

          {/* UBICACIÓN */}
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2c3e50', margin: '0 0 16px 0', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px' }}>
              Ubicación
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Departamento <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={formData.departamento}
                  onChange={(e) => {
                    handleInputChange('departamento', e.target.value)
                    handleInputChange('municipio', '')
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    height: '48px',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b1a'
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 26, 0.1)'
                    e.target.style.backgroundColor = '#fffbf8'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                    e.target.style.backgroundColor = '#fff'
                  }}
                >
                  <option value="">Departamento</option>
                  {departamentos.map(dept => (
                    <option key={dept.codigo} value={dept.codigo}>{dept.nombre}</option>
                  ))}
                </select>
                {errors.departamento && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.departamento}</p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Municipio <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={formData.municipio}
                  onChange={(e) => handleInputChange('municipio', e.target.value)}
                  disabled={!formData.departamento}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '15px',
                    backgroundColor: !formData.departamento ? '#f9fafb' : '#fff',
                    outline: 'none',
                    height: '48px',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    if (formData.departamento) {
                      e.target.style.borderColor = '#ff6b1a'
                      e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 26, 0.1)'
                      e.target.style.backgroundColor = '#fffbf8'
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                    e.target.style.backgroundColor = formData.departamento ? '#fff' : '#f9fafb'
                  }}
                >
                  <option value="">
                    {formData.departamento ? 'Seleccionar municipio' : 'Primero elige departamento'}
                  </option>
                  {municipiosDisponibles.map(municipio => (
                    <option key={municipio.codigo} value={municipio.codigo}>{municipio.nombre}</option>
                  ))}
                </select>
                {errors.municipio && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.municipio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginTop: '24px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0',
                background: '#fff',
                color: '#666',
                border: '2px solid #d0d0d0',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50px',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#999'
                e.currentTarget.style.color = '#333'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#d0d0d0'
                e.currentTarget.style.color = '#666'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: '#ff6b1a',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50px',
                boxSizing: 'border-box'
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#e85e00'
                }
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#ff6b1a'
                }
              }}
            >
              {isSubmitting ? (editingProductId ? 'Actualizando...' : 'Publicando...') : (editingProductId ? 'Actualizar Producto' : 'Publicar Anuncio')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
