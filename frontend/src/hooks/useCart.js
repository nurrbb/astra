import { useState, useEffect, useCallback } from 'react'
import { cartService } from '../services/apiService'
import { useAuth } from './useAuth'

export const useCart = () => {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null)
      return
    }

    try {
      setLoading(true)
      const response = await cartService.getCart()
      setCart(response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Sepet yüklenirken hata oluştu')
      console.error('Sepet yükleme hatası:', err)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Sepete eklemek için giriş yapmalısınız')
    }

    try {
      setLoading(true)
      const response = await cartService.addItem({ productId, quantity })
      setCart(response.data)
      setError(null)
      return response
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Sepete ekleme başarısız'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      throw new Error('Sepet işlemleri için giriş yapmalısınız')
    }

    try {
      setLoading(true)
      const response = await cartService.removeItem(productId)
      setCart(response.data)
      setError(null)
      return response
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Sepetten çıkarma başarısız'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }

    const currentItem = cart?.items?.find(
      (item) => item.productId._id === productId || item.productId === productId
    )

    if (!currentItem) {
      return addToCart(productId, quantity)
    }

    const difference = quantity - currentItem.quantity
    if (difference > 0) {
      return addToCart(productId, difference)
    } else if (difference < 0) {
      return addToCart(productId, difference)
    }
  }

  const clearCart = async () => {
    if (!isAuthenticated) {
      return
    }

    try {
      setLoading(true)
      await cartService.clearCart()
      setCart({ items: [], totalAmount: 0 })
      setError(null)
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Sepet temizleme başarısız'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const checkout = async (paymentMethod = 'credit_card') => {
    if (!isAuthenticated) {
      throw new Error('Ödeme için giriş yapmalısınız')
    }

    try {
      setLoading(true)
      const response = await cartService.checkout(paymentMethod)
      setCart({ items: [], totalAmount: 0 })
      setError(null)
      return response
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Ödeme işlemi başarısız'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    refreshCart: fetchCart,
  }
}

