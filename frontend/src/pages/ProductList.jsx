import { useEffect, useState } from 'react'
import { productService } from '../services/apiService'
import ProductCard from '../components/ProductCard'
import Input from '../components/Input'
import './ProductList.css'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceFilter, setPriceFilter] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll()
        const productsData = response.data || []
        setProducts(productsData)
        setFilteredProducts(productsData)

        const uniqueCategories = [
          ...new Set(productsData.map((p) => p.category)),
        ]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      )
    }

    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number)
      if (max) {
        filtered = filtered.filter(
          (product) => product.price >= min && product.price <= max
        )
      } else {
        filtered = filtered.filter((product) => product.price >= min)
      }
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, priceFilter, products])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handlePriceFilterChange = (e) => {
    setPriceFilter(e.target.value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setPriceFilter('')
  }

  if (loading) {
    return <div className="loading">Yükleniyor...</div>
  }

  return (
    <div className="product-list">
      <h1>Ürünler</h1>

      <div className="filters">
        <div className="filter-group">
          <Input
            type="text"
            name="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Ürün ara..."
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={priceFilter}
            onChange={handlePriceFilterChange}
            className="filter-select"
          >
            <option value="">Tüm Fiyatlar</option>
            <option value="0-100">0 - 100 ₺</option>
            <option value="100-500">100 - 500 ₺</option>
            <option value="500-1000">500 - 1000 ₺</option>
            <option value="1000-">1000 ₺ ve üzeri</option>
          </select>
        </div>

        {(searchTerm || selectedCategory || priceFilter) && (
          <button onClick={clearFilters} className="clear-filters-btn">
            Filtreleri Temizle
          </button>
        )}
      </div>

      <div className="results-info">
        <p>
          {filteredProducts.length} ürün bulundu
          {(searchTerm || selectedCategory || priceFilter) &&
            ` (${products.length} toplam)`}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>Filtreleme kriterlerinize uygun ürün bulunamadı.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList

