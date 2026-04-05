/**
 * MOCK DATA COMPLETO - PROYECTO DONE!
 * Datos realistas para desarrollo sin base de datos
 */

// 🎭 Usuarios Mock
export const mockUsers = [
  {
    id: 'user-1',
    nombre: 'Juan Pérez García',
    telefono: '77712345',
    email: 'juan.perez@email.com',
    passwordHash: '$2b$12$hashed_password_here',
    ciudad_id: 1,
    ciudad_nombre: 'La Paz',
    departamento_nombre: 'La Paz',
    telefono_verificado: 1,
    activo: 1,
    fecha_registro: '2024-01-15',
    avatar: '/avatars/juan.jpg'
  },
  {
    id: 'user-2',
    nombre: 'María López Sánchez',
    telefono: '66654321',
    email: 'maria.lopez@email.com',
    passwordHash: '$2b$12$hashed_password_here',
    ciudad_id: 2,
    ciudad_nombre: 'Santa Cruz',
    departamento_nombre: 'Santa Cruz',
    telefono_verificado: 1,
    activo: 1,
    fecha_registro: '2024-01-20',
    avatar: '/avatars/maria.jpg'
  },
  {
    id: 'user-3',
    nombre: 'Carlos Rodríguez Mamani',
    telefono: '77798765',
    email: 'carlos.rodriguez@email.com',
    passwordHash: '$2b$12$hashed_password_here',
    ciudad_id: 3,
    ciudad_nombre: 'Cochabamba',
    departamento_nombre: 'Cochabamba',
    telefono_verificado: 1,
    activo: 1,
    fecha_registro: '2024-02-01',
    avatar: '/avatars/carlos.jpg'
  },
  {
    id: 'user-4',
    nombre: 'Ana María Torres',
    telefono: '66623456',
    email: 'ana.torres@email.com',
    passwordHash: '$2b$12$hashed_password_here',
    ciudad_id: 4,
    ciudad_nombre: 'El Alto',
    departamento_nombre: 'La Paz',
    telefono_verificado: 1,
    activo: 1,
    fecha_registro: '2024-02-10',
    avatar: '/avatars/ana.jpg'
  },
  {
    id: 'user-5',
    nombre: 'Roberto Silva Vargas',
    telefono: '77745678',
    email: 'roberto.silva@email.com',
    passwordHash: '$2b$12$hashed_password_here',
    ciudad_id: 5,
    ciudad_nombre: 'Oruro',
    departamento_nombre: 'Oruro',
    telefono_verificado: 1,
    activo: 1,
    fecha_registro: '2024-02-15',
    avatar: '/avatars/roberto.jpg'
  }
];

// 🏪 Tiendas Mock
export const mockStores = [
  {
    id: 'store-1',
    usuario_id: 'user-1',
    nombre: 'Tienda Juan - Celulares y Más',
    slug: 'tienda-juan-celulares',
    logo: '/logos/tienda-juan.png',
    descripcion: 'Venta de celulares nuevos y usados, accesorios y reparaciones. Más de 5 años de experiencia.',
    telefono: '77712345',
    email: 'tienda-juan@email.com',
    whatsapp: '77712345',
    direccion: 'Calle 16 de Julio #123, La Paz',
    ciudad_id: 1,
    ciudad_nombre: 'La Paz',
    departamento_nombre: 'La Paz',
    estado: 'activo',
    productos_count: 45,
    calificacion: 4.8,
    reseñas_count: 127,
    creado_en: '2024-01-20',
    logo_url: 'https://picsum.photos/seed/tienda1/200/200.jpg',
    banner_url: 'https://picsum.photos/seed/banner1/800/300.jpg'
  },
  {
    id: 'store-2',
    usuario_id: 'user-2',
    nombre: 'Tech Store Santa Cruz',
    slug: 'tech-store-santa-cruz',
    logo: '/logos/tech-store.png',
    descripcion: 'Tecnología de última generación. Ofrecemos garantía y servicio técnico especializado.',
    telefono: '66654321',
    email: 'techstore@email.com',
    whatsapp: '66654321',
    direccion: 'Av. Santos Dumont #456, Santa Cruz',
    ciudad_id: 2,
    ciudad_nombre: 'Santa Cruz',
    departamento_nombre: 'Santa Cruz',
    estado: 'activo',
    productos_count: 120,
    calificacion: 4.6,
    reseñas_count: 89,
    creado_en: '2024-01-25',
    logo_url: 'https://picsum.photos/seed/tienda2/200/200.jpg',
    banner_url: 'https://picsum.photos/seed/banner2/800/300.jpg'
  },
  {
    id: 'store-3',
    usuario_id: 'user-3',
    nombre: 'Cochabamba Tech',
    slug: 'cochabamba-tech',
    logo: '/logos/cocha-tech.png',
    descripcion: 'Especialistas en computación y gadgets. Reparación y venta de accesorios.',
    telefono: '77798765',
    email: 'cochatech@email.com',
    whatsapp: '77798765',
    direccion: 'Calle Jordan #789, Cochabamba',
    ciudad_id: 3,
    ciudad_nombre: 'Cochabamba',
    departamento_nombre: 'Cochabamba',
    estado: 'activo',
    productos_count: 67,
    calificacion: 4.7,
    reseñas_count: 45,
    creado_en: '2024-02-05',
    logo_url: 'https://picsum.photos/seed/tienda3/200/200.jpg',
    banner_url: 'https://picsum.photos/seed/banner3/800/300.jpg'
  },
  {
    id: 'store-4',
    usuario_id: 'user-4',
    nombre: 'El Alto Digital',
    slug: 'el-alto-digital',
    logo: '/logos/el-alto.png',
    descripcion: 'Electrónica y tecnología a precios competitivos. Envíos a todo Bolivia.',
    telefono: '66623456',
    email: 'altodigital@email.com',
    whatsapp: '66623456',
    direccion: 'Plaza 6 de Agosto #234, El Alto',
    ciudad_id: 4,
    ciudad_nombre: 'El Alto',
    departamento_nombre: 'La Paz',
    estado: 'activo',
    productos_count: 89,
    calificacion: 4.5,
    reseñas_count: 67,
    creado_en: '2024-02-12',
    logo_url: 'https://picsum.photos/seed/tienda4/200/200.jpg',
    banner_url: 'https://picsum.photos/seed/banner4/800/300.jpg'
  },
  {
    id: 'store-5',
    usuario_id: 'user-5',
    nombre: 'Oruro Tech Center',
    slug: 'oruro-tech-center',
    logo: '/logos/oruro-tech.png',
    descripcion: 'Servicio técnico autorizado. Venta de repuestos y accesorios originales.',
    telefono: '77745678',
    email: 'orurotech@email.com',
    whatsapp: '77745678',
    direccion: 'Calle Bolívar #567, Oruro',
    ciudad_id: 5,
    ciudad_nombre: 'Oruro',
    departamento_nombre: 'Oruro',
    estado: 'activo',
    productos_count: 34,
    calificacion: 4.9,
    reseñas_count: 23,
    creado_en: '2024-02-18',
    logo_url: 'https://picsum.photos/seed/tienda5/200/200.jpg',
    banner_url: 'https://picsum.photos/seed/banner5/800/300.jpg'
  }
];

// 📱 Categorías Mock
export const mockCategories = [
  {
    id: 1,
    nombre: 'Celulares',
    slug: 'celulares',
    icono: '📱',
    descripcion: 'Smartphones y celulares de todas las marcas',
    productos_count: 156
  },
  {
    id: 2,
    nombre: 'Laptops',
    slug: 'laptops',
    icono: '💻',
    descripcion: 'Computadoras portátiles y notebooks',
    productos_count: 89
  },
  {
    id: 3,
    nombre: 'Tablets',
    slug: 'tablets',
    icono: '📋',
    descripcion: 'Tablets y iPads',
    productos_count: 45
  },
  {
    id: 4,
    nombre: 'Accesorios',
    slug: 'accesorios',
    icono: '🎧',
    descripcion: 'Audífonos, cargadores, cases y más',
    productos_count: 234
  },
  {
    id: 5,
    nombre: 'Smartwatches',
    slug: 'smartwatches',
    icono: '⌚',
    descripcion: 'Relojes inteligentes y fitness trackers',
    productos_count: 67
  },
  {
    id: 6,
    nombre: 'Cámaras',
    slug: 'camaras',
    icono: '📷',
    descripcion: 'Cámaras fotográficas y de video',
    productos_count: 34
  },
  {
    id: 7,
    nombre: 'Gaming',
    slug: 'gaming',
    icono: '🎮',
    descripcion: 'Consolas, videojuegos y accesorios gaming',
    productos_count: 78
  },
  {
    id: 8,
    nombre: 'Audio',
    slug: 'audio',
    icono: '🔊',
    descripcion: 'Parlantes, sistemas de audio y equipos de música',
    productos_count: 56
  }
];

// 📦 Productos Mock
export const mockProducts = [
  {
    id: 'prod-1',
    tienda_id: 'store-1',
    categoria_id: 1,
    titulo: 'iPhone 15 Pro Max 256GB',
    descripcion: 'El iPhone más avanzado con chip A17 Pro, sistema de cámaras Pro y titanio. Incluye cargador y cable.',
    precio: 9999.00,
    precio_original: 10999.00,
    estado: 'nuevo',
    condicion: 'excelente',
    marca: 'Apple',
    modelo: 'iPhone 15 Pro Max',
    imagenes: [
      'https://picsum.photos/seed/iphone15pro/400/300.jpg',
      'https://picsum.photos/seed/iphone15pro2/400/300.jpg',
      'https://picsum.photos/seed/iphone15pro3/400/300.jpg'
    ],
    imagen_principal: 'https://picsum.photos/seed/iphone15pro/400/300.jpg',
    ciudad_id: 1,
    ciudad_nombre: 'La Paz',
    departamento_nombre: 'La Paz',
    telefono_contacto: '77712345',
    whatsapp: '77712345',
    destacado: true,
    activo: true,
    vistas: 1247,
    favoritos: 89,
    fecha_publicacion: '2024-03-15',
    actualizado: '2024-03-15',
    tienda_nombre: 'Tienda Juan - Celulares y Más',
    tienda_slug: 'tienda-juan-celulares',
    categoria_nombre: 'Celulares',
    calificacion_producto: 4.9,
    reseñas_producto: 23
  },
  {
    id: 'prod-2',
    tienda_id: 'store-2',
    categoria_id: 1,
    titulo: 'Samsung Galaxy S24 Ultra 512GB',
    descripcion: 'Pantalla Dynamic AMOLED 2X de 6.8", S Pen incluido, cámara de 200MP. Batería de 5000mAh.',
    precio: 8999.00,
    precio_original: 9999.00,
    estado: 'nuevo',
    condicion: 'excelente',
    marca: 'Samsung',
    modelo: 'Galaxy S24 Ultra',
    imagenes: [
      'https://picsum.photos/seed/s24ultra/400/300.jpg',
      'https://picsum.photos/seed/s24ultra2/400/300.jpg'
    ],
    imagen_principal: 'https://picsum.photos/seed/s24ultra/400/300.jpg',
    ciudad_id: 2,
    ciudad_nombre: 'Santa Cruz',
    departamento_nombre: 'Santa Cruz',
    telefono_contacto: '66654321',
    whatsapp: '66654321',
    destacado: true,
    activo: true,
    vistas: 892,
    favoritos: 67,
    fecha_publicacion: '2024-03-10',
    actualizado: '2024-03-14',
    tienda_nombre: 'Tech Store Santa Cruz',
    tienda_slug: 'tech-store-santa-cruz',
    categoria_nombre: 'Celulares',
    calificacion_producto: 4.7,
    reseñas_producto: 18
  },
  {
    id: 'prod-3',
    tienda_id: 'store-1',
    categoria_id: 1,
    titulo: 'iPhone 14 Pro 128GB',
    descripcion: 'iPhone 14 Pro en excelentes condiciones, poco uso. Incluye caja original y accesorios.',
    precio: 6499.00,
    precio_original: 7999.00,
    estado: 'usado',
    condicion: 'muy bueno',
    marca: 'Apple',
    modelo: 'iPhone 14 Pro',
    imagenes: [
      'https://picsum.photos/seed/iphone14pro/400/300.jpg',
      'https://picsum.photos/seed/iphone14pro2/400/300.jpg'
    ],
    imagen_principal: 'https://picsum.photos/seed/iphone14pro/400/300.jpg',
    ciudad_id: 1,
    ciudad_nombre: 'La Paz',
    departamento_nombre: 'La Paz',
    telefono_contacto: '77712345',
    whatsapp: '77712345',
    destacado: false,
    activo: true,
    vistas: 567,
    favoritos: 34,
    fecha_publicacion: '2024-02-28',
    actualizado: '2024-03-12',
    tienda_nombre: 'Tienda Juan - Celulares y Más',
    tienda_slug: 'tienda-juan-celulares',
    categoria_nombre: 'Celulares',
    calificacion_producto: 4.6,
    reseñas_producto: 12
  },
  {
    id: 'prod-4',
    tienda_id: 'store-3',
    categoria_id: 2,
    titulo: 'MacBook Air M2 256GB',
    descripcion: 'MacBook Air con chip M2, 13 pulgadas, 8GB RAM, 256GB SSD. Perfecto para trabajo y estudios.',
    precio: 7999.00,
    precio_original: 8999.00,
    estado: 'nuevo',
    condicion: 'excelente',
    marca: 'Apple',
    modelo: 'MacBook Air M2',
    imagenes: [
      'https://picsum.photos/seed/macbookair/400/300.jpg',
      'https://picsum.photos/seed/macbookair2/400/300.jpg'
    ],
    imagen_principal: 'https://picsum.photos/seed/macbookair/400/300.jpg',
    ciudad_id: 3,
    ciudad_nombre: 'Cochabamba',
    departamento_nombre: 'Cochabamba',
    telefono_contacto: '77798765',
    whatsapp: '77798765',
    destacado: true,
    activo: true,
    vistas: 445,
    favoritos: 56,
    fecha_publicacion: '2024-03-08',
    actualizado: '2024-03-15',
    tienda_nombre: 'Cochabamba Tech',
    tienda_slug: 'cochabamba-tech',
    categoria_nombre: 'Laptops',
    calificacion_producto: 4.8,
    reseñas_producto: 8
  },
  {
    id: 'prod-5',
    tienda_id: 'store-2',
    categoria_id: 4,
    titulo: 'AirPods Pro 2nda Generación',
    descripcion: 'AirPods Pro con cancelación activa de ruido, audio espacial y sonido adaptativo. Caja y accesorios incluidos.',
    precio: 1299.00,
    precio_original: 1599.00,
    estado: 'nuevo',
    condicion: 'excelente',
    marca: 'Apple',
    modelo: 'AirPods Pro 2',
    imagenes: [
      'https://picsum.photos/seed/airpodspro/400/300.jpg',
      'https://picsum.photos/seed/airpodspro2/400/300.jpg'
    ],
    imagen_principal: 'https://picsum.photos/seed/airpodspro/400/300.jpg',
    ciudad_id: 2,
    ciudad_nombre: 'Santa Cruz',
    departamento_nombre: 'Santa Cruz',
    telefono_contacto: '66654321',
    whatsapp: '66654321',
    destacado: false,
    activo: true,
    vistas: 789,
    favoritos: 123,
    fecha_publicacion: '2024-03-01',
    actualizado: '2024-03-10',
    tienda_nombre: 'Tech Store Santa Cruz',
    tienda_slug: 'tech-store-santa-cruz',
    categoria_nombre: 'Accesorios',
    calificacion_producto: 4.7,
    reseñas_producto: 34
  }
];

// 🏛️ Ciudades Mock - Datos INE 2024
export const mockCities = [
  { id: 1, nombre: 'Sucre', departamento: 'Chuquisaca' },
  { id: 2, nombre: 'La Paz', departamento: 'La Paz' },
  { id: 3, nombre: 'Cochabamba', departamento: 'Cochabamba' },
  { id: 4, nombre: 'El Alto', departamento: 'La Paz' },
  { id: 5, nombre: 'Santa Cruz de la Sierra', departamento: 'Santa Cruz' },
  { id: 6, nombre: 'Oruro', departamento: 'Oruro' },
  { id: 7, nombre: 'Potosí', departamento: 'Potosí' },
  { id: 8, nombre: 'Tarija', departamento: 'Tarija' },
  { id: 9, nombre: 'Trinidad', departamento: 'Beni' },
  { id: 10, nombre: 'Cobija', departamento: 'Pando' }
];

// 🎪 Feria Virtual Mock (Eliminado - ahora usa /feria-virtual)
// export const mockFeriaSectors = [] // Eliminado
// export const mockFeriaStands = [] // Eliminado

// 🏪 Puestos de Feria (Eliminado - ahora usa /feria-virtual)
// export const mockFeriaStands = [] // Eliminado

// 🏙️ Departamentos (Eliminado - ahora usa /feria-virtual)
// export const mockDepartments = [] // Eliminado

// 📊 Analytics Mock
export const mockAnalytics = {
  totalUsers: 1547,
  totalStores: 89,
  totalProducts: 456,
  totalViews: 45678,
  todayViews: 1234,
  todayRegistrations: 23,
  topCategories: [
    { name: 'Celulares', count: 156 },
    { name: 'Accesorios', count: 89 },
    { name: 'Laptops', count: 67 }
  ],
  topCities: [
    { name: 'La Paz', count: 234 },
    { name: 'Santa Cruz', count: 189 },
    { name: 'Cochabamba', count: 123 }
  ],
  weeklyStats: [
    { day: 'Lun', views: 1234, sales: 45 },
    { day: 'Mar', views: 1456, sales: 52 },
    { day: 'Mie', views: 1678, sales: 61 },
    { day: 'Jue', views: 1890, sales: 73 },
    { day: 'Vie', views: 2123, sales: 89 },
    { day: 'Sab', views: 2345, sales: 102 },
    { day: 'Dom', views: 1567, sales: 67 }
  ]
};

// 📝 Logs Mock
export const mockLogs = [
  {
    id: 1,
    usuario_id: 'user-1',
    accion: 'login',
    descripcion: 'Usuario inició sesión',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0...',
    fecha: '2024-03-15 10:30:00'
  },
  {
    id: 2,
    usuario_id: 'user-2',
    accion: 'crear_tienda',
    descripcion: 'Usuario creó nueva tienda',
    ip_address: '192.168.1.101',
    user_agent: 'Mozilla/5.0...',
    fecha: '2024-03-15 11:15:00'
  },
  {
    id: 3,
    usuario_id: 'user-3',
    accion: 'publicar_producto',
    descripcion: 'Usuario publicó nuevo producto',
    ip_address: '192.168.1.102',
    user_agent: 'Mozilla/5.0...',
    fecha: '2024-03-15 14:20:00'
  }
];

// Exportar todo junto
export const mockData = {
  users: mockUsers,
  stores: mockStores,
  categories: mockCategories,
  products: mockProducts,
  cities: mockCities,
  // feriaStands: mockFeriaStands, // Eliminado - usa /feria-virtual
  // feriaSectors: mockFeriaSectors, // Eliminado - usa /feria-virtual
  analytics: mockAnalytics,
  logs: mockLogs
};
