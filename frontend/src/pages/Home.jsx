import { useEffect, useState } from 'react'
import { productService } from '../services/apiService'
import './Home.css'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll()
        setProducts(response.data || [])
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div className="loading">Yükleniyor...</div>
  }

  return (
    <div className="home">
      <h1>Ürünler</h1>
      {products.length === 0 ? (
        <p>Henüz ürün bulunmamaktadır.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-category">{product.category}</p>
                <p className="product-price">{product.price} ₺</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home

