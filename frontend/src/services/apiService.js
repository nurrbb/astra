import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData)
    return response.data
  },
}

export const productService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.category) params.append('category', filters.category)
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)

    const queryString = params.toString()
    const url = queryString ? `/products?${queryString}` : '/products'
    const response = await api.get(url)
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },
}

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart')
    return response.data
  },
  addItem: async (item) => {
    const response = await api.post('/cart/items', item)
    return response.data
  },
  removeItem: async (productId) => {
    const response = await api.delete(`/cart/items/${productId}`)
    return response.data
  },
  clearCart: async () => {
    const response = await api.delete('/cart')
    return response.data
  },
  checkout: async (paymentMethod) => {
    const response = await api.post('/cart/checkout', { paymentMethod })
    return response.data
  },
}

export const searchService = {
  search: async (query, filters = {}) => {
    const params = new URLSearchParams()
    if (query) params.append('q', query)
    if (filters.category) params.append('category', filters.category)
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)

    const queryString = params.toString()
    const url = queryString ? `/search?${queryString}` : '/search'
    const response = await api.get(url)
    return response.data
  },
  suggest: async (query) => {
    const response = await api.get(`/search/suggest?q=${encodeURIComponent(query)}`)
    return response.data
  },
}

export default api

