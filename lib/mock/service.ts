/**
 * MOCK SERVICE - Simula API endpoints con datos mock
 * Reemplaza las llamadas a base de datos real
 */

import { mockData } from './data';

// 🕐 Simular delays de red
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// 📝 Tipos para respuestas
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 🎭 Mock Service Class
export class MockService {
  // 🔍 Búsqueda
  async searchProducts(query: string, filters?: any): Promise<PaginatedResponse<any>> {
    await delay(500);
    
    let products = [...mockData.products];
    
    // Búsqueda por texto
    if (query) {
      products = products.filter(p => 
        p.titulo.toLowerCase().includes(query.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filtros
    if (filters?.categoria) {
      const category = mockData.categories.find(c => c.slug === filters.categoria);
      if (category) {
        products = products.filter(p => p.categoria_id === category.id);
      }
    }
    
    if (filters?.ciudad) {
      const city = mockData.cities.find(c => c.nombre.toLowerCase() === filters.ciudad.toLowerCase());
      if (city) {
        products = products.filter(p => p.ciudad_id === city.id);
      }
    }
    
    if (filters?.estado) {
      products = products.filter(p => p.estado === filters.estado);
    }
    
    if (filters?.precio_min) {
      products = products.filter(p => p.precio >= filters.precio_min);
    }
    
    if (filters?.precio_max) {
      products = products.filter(p => p.precio <= filters.precio_max);
    }
    
    return {
      data: products,
      total: products.length,
      page: 1,
      limit: 20,
      totalPages: Math.ceil(products.length / 20)
    };
  }

  // 🏪 Tiendas
  async getStores(filters?: any): Promise<PaginatedResponse<any>> {
    await delay(400);
    
    let stores = [...mockData.stores];
    
    if (filters?.ciudad) {
      const city = mockData.cities.find(c => c.nombre.toLowerCase() === filters.ciudad.toLowerCase());
      if (city) {
        stores = stores.filter(s => s.ciudad_id === city.id);
      }
    }
    
    if (filters?.estado) {
      stores = stores.filter(s => s.estado === filters.estado);
    }
    
    return {
      data: stores,
      total: stores.length,
      page: 1,
      limit: 20,
      totalPages: Math.ceil(stores.length / 20)
    };
  }

  async getStoreBySlug(slug: string): Promise<ApiResponse<any>> {
    await delay(300);
    
    const store = mockData.stores.find(s => s.slug === slug);
    
    if (!store) {
      return { success: false, error: 'Tienda no encontrada' };
    }
    
    // Obtener productos de la tienda
    const storeProducts = mockData.products.filter(p => p.tienda_id === store.id);
    
    return {
      success: true,
      data: {
        ...store,
        products: storeProducts
      }
    };
  }

  // 📦 Productos
  async getProduct(id: string): Promise<ApiResponse<any>> {
    await delay(300);
    
    const product = mockData.products.find(p => p.id === id);
    
    if (!product) {
      return { success: false, error: 'Producto no encontrado' };
    }
    
    // Incrementar vistas
    product.vistas += 1;
    
    return { success: true, data: product };
  }

  async getProductsByStore(storeId: string): Promise<ApiResponse<any[]>> {
    await delay(400);
    
    const products = mockData.products.filter(p => p.tienda_id === storeId);
    
    return { success: true, data: products };
  }

  async getProductsByCategory(categorySlug: string): Promise<PaginatedResponse<any>> {
    await delay(400);
    
    const category = mockData.categories.find(c => c.slug === categorySlug);
    
    if (!category) {
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
      };
    }
    
    const products = mockData.products.filter(p => p.categoria_id === category.id);
    
    return {
      data: products,
      total: products.length,
      page: 1,
      limit: 20,
      totalPages: Math.ceil(products.length / 20)
    };
  }

  // 🎪 Feria Virtual
  async getFeriaStands(sector?: string): Promise<ApiResponse<any[]>> {
    await delay(300);
    
    let stands = [...mockData.feriaStands];
    
    if (sector) {
      stands = stands.filter(s => s.sector_slug === sector);
    }
    
    return { success: true, data: stands };
  }

  async getFeriaSectors(): Promise<ApiResponse<any[]>> {
    await delay(200);
    
    return { success: true, data: mockData.feriaSectors };
  }

  async occupyStand(standId: string, userId: string): Promise<ApiResponse<any>> {
    await delay(800);
    
    const stand = mockData.feriaStands.find(s => s.id === standId);
    
    if (!stand) {
      return { success: false, error: 'Puesto no encontrado' };
    }
    
    if (stand.estado === 'ocupado') {
      return { success: false, error: 'Puesto ya está ocupado' };
    }
    
    // Buscar tienda del usuario
    const userStore = mockData.stores.find(s => s.usuario_id === userId);
    
    if (!userStore) {
      return { success: false, error: 'Usuario no tiene tienda' };
    }
    
    // Ocupar puesto
    stand.estado = 'ocupado';
    stand.tienda_id = userStore.id;
    stand.tienda_nombre = userStore.nombre;
    stand.tienda_slug = userStore.slug;
    stand.tienda_logo = userStore.logo_url;
    
    return { 
      success: true, 
      data: stand,
      message: 'Puesto ocupado exitosamente'
    };
  }

  // 🏛️ Categorías
  async getCategories(): Promise<ApiResponse<any[]>> {
    await delay(200);
    
    return { success: true, data: mockData.categories };
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<any>> {
    await delay(200);
    
    const category = mockData.categories.find(c => c.slug === slug);
    
    if (!category) {
      return { success: false, error: 'Categoría no encontrada' };
    }
    
    return { success: true, data: category };
  }

  // 🏙️ Ciudades
  async getCities(): Promise<ApiResponse<any[]>> {
    await delay(150);
    
    return { success: true, data: mockData.cities };
  }

  // 👤 Usuarios
  async getUser(id: string): Promise<ApiResponse<any>> {
    await delay(300);
    
    const user = mockData.users.find(u => u.id === id);
    
    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }
    
    // Obtener tienda del usuario si existe
    const userStore = mockData.stores.find(s => s.usuario_id === id);
    
    return { 
      success: true, 
      data: {
        ...user,
        store: userStore || null
      }
    };
  }

  async updateUserProfile(id: string, data: any): Promise<ApiResponse<any>> {
    await delay(600);
    
    const userIndex = mockData.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return { success: false, error: 'Usuario no encontrado' };
    }
    
    // Actualizar datos
    mockData.users[userIndex] = { ...mockData.users[userIndex], ...data };
    
    return { 
      success: true, 
      data: mockData.users[userIndex],
      message: 'Perfil actualizado exitosamente'
    };
  }

  // ❤️ Favoritos
  async getFavorites(userId: string): Promise<ApiResponse<any[]>> {
    await delay(400);
    
    // Simular productos favoritos (en realidad sería una tabla separada)
    const favoriteProducts = mockData.products.filter(p => p.destacado);
    
    return { success: true, data: favoriteProducts };
  }

  async toggleFavorite(userId: string, productId: string): Promise<ApiResponse<any>> {
    await delay(300);
    
    const product = mockData.products.find(p => p.id === productId);
    
    if (!product) {
      return { success: false, error: 'Producto no encontrado' };
    }
    
    // Simular toggle de favorito
    product.favoritos = product.favoritos + 1;
    
    return { 
      success: true, 
      data: { isFavorite: true, count: product.favoritos },
      message: 'Agregado a favoritos'
    };
  }

  // 📊 Analytics
  async getAnalytics(): Promise<ApiResponse<any>> {
    await delay(500);
    
    return { success: true, data: mockData.analytics };
  }

  // 📝 Logs
  async getLogs(filters?: any): Promise<PaginatedResponse<any>> {
    await delay(400);
    
    let logs = [...mockData.logs];
    
    if (filters?.usuario_id) {
      logs = logs.filter(l => l.usuario_id === filters.usuario_id);
    }
    
    if (filters?.accion) {
      logs = logs.filter(l => l.accion === filters.accion);
    }
    
    if (filters?.fecha_inicio) {
      logs = logs.filter(l => l.fecha >= filters.fecha_inicio);
    }
    
    return {
      data: logs,
      total: logs.length,
      page: 1,
      limit: 20,
      totalPages: Math.ceil(logs.length / 20)
    };
  }

  // 🔐 Autenticación (simulada)
  async login(telefono: string, password: string): Promise<ApiResponse<any>> {
    await delay(800);
    
    const user = mockData.users.find(u => u.telefono === telefono);
    
    if (!user) {
      return { success: false, error: 'Teléfono o contraseña incorrectos' };
    }
    
    // Simular verificación de password
    if (password !== '123456') { // Password mock para pruebas
      return { success: false, error: 'Teléfono o contraseña incorrectos' };
    }
    
    return { 
      success: true, 
      data: user,
      message: 'Login exitoso'
    };
  }

  async register(userData: any): Promise<ApiResponse<any>> {
    await delay(1000);
    
    // Simular registro
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      telefono_verificado: 0,
      activo: 1,
      fecha_registro: new Date().toISOString().split('T')[0]
    };
    
    mockData.users.push(newUser);
    
    return { 
      success: true, 
      data: newUser,
      message: 'Registro exitoso'
    };
  }
}

// 🎭 Exportar instancia única
export const mockService = new MockService();

// 🎯 Hook para usar el mock service
export const useMockService = () => {
  return mockService;
};
