import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './useAuth'

export const useSocket = () => {
  const { isAuthenticated, user } = useAuth()
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const socketRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setSocket(null)
      }
      return
    }

    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

    const newSocket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token'),
        userId: user.id,
      },
      transports: ['websocket', 'polling'],
    })

    newSocket.on('connect', () => {
      console.log('WebSocket bağlantısı kuruldu')
      newSocket.emit('join', { userId: user.id })
    })

    newSocket.on('disconnect', () => {
      console.log('WebSocket bağlantısı kesildi')
    })

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket bağlantı hatası:', error)
    })

    newSocket.on('order_completed', (data) => {
      console.log('Sipariş tamamlandı bildirimi:', data)
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'success',
          message: `Siparişiniz tamamlandı! Sipariş No: ${data.orderId}`,
          data,
        },
      ])
    })

    newSocket.on('invoice_created', (data) => {
      console.log('Fatura oluşturuldu bildirimi:', data)
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'info',
          message: `Faturanız hazırlandı! Fatura No: ${data.invoiceId}`,
          data,
        },
      ])
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [isAuthenticated, user])

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  return {
    socket,
    notifications,
    removeNotification,
  }
}

