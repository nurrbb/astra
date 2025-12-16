import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/Input'
import Button from '../components/Button'
import './Checkout.css'

const Checkout = () => {
  const { cart, checkout, loading } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    shippingAddress: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    paymentMethod: 'credit_card',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart')
    }
  }, [cart, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.shippingAddress || !formData.city || !formData.postalCode) {
      setError('Lütfen kargo adresi bilgilerini doldurun')
      return
    }

    if (formData.paymentMethod === 'credit_card') {
      if (
        !formData.cardNumber ||
        !formData.cardName ||
        !formData.cardExpiry ||
        !formData.cardCvv
      ) {
        setError('Lütfen kart bilgilerini doldurun')
        return
      }
    }

    try {
      const response = await checkout(formData.paymentMethod)
      navigate('/order-success', {
        state: {
          orderId: response.data.orderId,
          amount: cart.totalAmount,
        },
      })
    } catch (err) {
      setError(err.message || 'Ödeme işlemi başarısız')
    }
  }

  if (!cart || cart.items.length === 0) {
    return null
  }

  return (
    <div className="checkout-container">
      <h1>Ödeme</h1>

      <div className="checkout-content">
        <div className="checkout-form-section">
          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2>Kargo Adresi</h2>
              <Input
                label="Adres"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                placeholder="Sokak, cadde, bina no"
                required
              />
              <div className="form-row">
                <Input
                  label="Şehir"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="İstanbul"
                  required
                />
                <Input
                  label="Posta Kodu"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="34000"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Ödeme Yöntemi</h2>
              <div className="payment-method-selector">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === 'credit_card'}
                    onChange={handleChange}
                  />
                  <span>Kredi Kartı</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={formData.paymentMethod === 'bank_transfer'}
                    onChange={handleChange}
                  />
                  <span>Banka Havalesi</span>
                </label>
              </div>

              {formData.paymentMethod === 'credit_card' && (
                <div className="card-form">
                  <Input
                    label="Kart Numarası"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                  <Input
                    label="Kart Üzerindeki İsim"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="Ad Soyad"
                    required
                  />
                  <div className="form-row">
                    <Input
                      label="Son Kullanma Tarihi"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                    <Input
                      label="CVV"
                      name="cardCvv"
                      type="password"
                      value={formData.cardCvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} variant="success" className="submit-btn">
              {loading ? 'İşleniyor...' : `Ödeme Yap (${cart.totalAmount.toFixed(2)} ₺)`}
            </Button>
          </form>
        </div>

        <div className="checkout-summary">
          <h2>Sipariş Özeti</h2>
          <div className="summary-items">
            {cart.items.map((item) => {
              const product =
                typeof item.productId === 'object'
                  ? item.productId
                  : { name: 'Ürün', imageUrl: '/placeholder.png' }
              return (
                <div key={item._id || product._id} className="summary-item">
                  <img src={product.imageUrl} alt={product.name} />
                  <div className="summary-item-info">
                    <p>{product.name}</p>
                    <p className="summary-item-quantity">
                      {item.quantity} x {item.price} ₺
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="summary-total">
            <div className="summary-row">
              <span>Ara Toplam:</span>
              <span>{cart.totalAmount.toFixed(2)} ₺</span>
            </div>
            <div className="summary-row">
              <span>Kargo:</span>
              <span>Ücretsiz</span>
            </div>
            <div className="summary-row total">
              <span>Toplam:</span>
              <span>{cart.totalAmount.toFixed(2)} ₺</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

