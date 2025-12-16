import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import Button from './Button'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const { addToCart, loading: cartLoading } = useCart()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Sepete eklemek için giriş yapmalısınız.')
      return
    }

    try {
      await addToCart(product._id, 1)
    } catch (error) {
      console.error('Sepete ekleme hatası:', error)
    }
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.imageUrl || '/placeholder.png'} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-category">{product.category}</p>
        <div className="product-footer">
          <p className="product-price">{product.price} ₺</p>
          <Button
            onClick={handleAddToCart}
            disabled={cartLoading || !isAuthenticated}
            variant="primary"
          >
            Sepete Ekle
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

