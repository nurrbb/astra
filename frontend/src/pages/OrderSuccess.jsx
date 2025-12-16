import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../components/Button'
import './OrderSuccess.css'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { orderId, amount } = location.state || {}

  useEffect(() => {
    if (!orderId) {
      navigate('/')
    }
  }, [orderId, navigate])

  if (!orderId) {
    return null
  }

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <div className="success-icon">✓</div>
        <h1>Siparişiniz Alındı!</h1>
        <p className="success-message">
          Siparişiniz başarıyla oluşturuldu. En kısa sürede hazırlanacak ve
          size bildirilecektir.
        </p>
        <div className="order-details">
          <div className="detail-row">
            <span>Sipariş Numarası:</span>
            <span className="order-id">{orderId}</span>
          </div>
          <div className="detail-row">
            <span>Toplam Tutar:</span>
            <span className="order-amount">{amount?.toFixed(2)} ₺</span>
          </div>
        </div>
        <div className="success-actions">
          <Button onClick={() => navigate('/products')} variant="primary">
            Alışverişe Devam Et
          </Button>
          <Button onClick={() => navigate('/profile')} variant="secondary">
            Profilime Git
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess

