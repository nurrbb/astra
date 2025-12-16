import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useSocket } from './hooks/useSocket'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Layout from './components/Layout'
import NotificationModal from './components/NotificationModal'
import { useState, useEffect } from 'react'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  const { notifications, removeNotification } = useSocket()
  const [currentNotification, setCurrentNotification] = useState(null)

  useEffect(() => {
    if (notifications.length > 0) {
      setCurrentNotification(notifications[notifications.length - 1])
    }
  }, [notifications])

  const handleCloseNotification = () => {
    if (currentNotification) {
      removeNotification(currentNotification.id)
      setCurrentNotification(null)
    }
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <PrivateRoute>
              <OrderSuccess />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
      {currentNotification && (
        <NotificationModal
          message={currentNotification.message}
          type={currentNotification.type}
          onClose={handleCloseNotification}
        />
      )}
    </Layout>
  )
}

export default App

