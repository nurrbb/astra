import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import './Cart.css'

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, checkout } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      await updateQuantity(productId, newQuantity)
    } catch (error) {
      alert('Miktar güncellenirken hata oluştu: ' + error.message)
    }
  }

  const handleRemove = async (productId) => {
    if (window.confirm('Bu ürünü sepetten çıkarmak istediğinize emin misiniz?')) {
      try {
        await removeFromCart(productId)
      } catch (error) {
        alert('Ürün sepetten çıkarılırken hata oluştu: ' + error.message)
      }
    }
  }

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      alert('Sepetiniz boş')
      return
    }
    navigate('/checkout')
  }

  if (!isAuthenticated) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <p>Sepeti görüntülemek için giriş yapmalısınız.</p>
          <Button onClick={() => navigate('/login')}>Giriş Yap</Button>
        </div>
      </div>
    )
  }

  if (loading && !cart) {
    return <div className="loading">Yükleniyor...</div>
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <h1>Sepetim</h1>
        <div className="cart-empty">
          <p>Sepetiniz boş</p>
          <Button onClick={() => navigate('/products')} variant="primary">
            Alışverişe Başla
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h1>Sepetim</h1>

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map((item) => {
            const product = item.productId
            const productId =
              typeof product === 'object' ? product._id : product

            return (
              <div key={item._id || productId} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={
                      typeof product === 'object'
                        ? product.imageUrl
                        : '/placeholder.png'
                    }
                    alt={
                      typeof product === 'object' ? product.name : 'Ürün'
                    }
                  />
                </div>
                <div className="cart-item-info">
                  <h3>
                    {typeof product === 'object' ? product.name : 'Ürün'}
                  </h3>
                  <p className="cart-item-category">
                    {typeof product === 'object' ? product.category : ''}
                  </p>
                  <p className="cart-item-price">
                    {item.price} ₺ x {item.quantity} ={' '}
                    {item.price * item.quantity} ₺
                  </p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        handleQuantityChange(productId, item.quantity - 1)
                      }
                      className="quantity-btn"
                      disabled={loading}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(productId, item.quantity + 1)
                      }
                      className="quantity-btn"
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                  <Button
                    onClick={() => handleRemove(productId)}
                    variant="danger"
                    disabled={loading}
                  >
                    Kaldır
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="cart-summary">
          <h2>Sipariş Özeti</h2>
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
          <Button
            onClick={handleCheckout}
            disabled={loading || cart.items.length === 0}
            variant="success"
            className="checkout-btn"
          >
            {loading ? 'İşleniyor...' : 'Ödemeye Geç'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Cart

