import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/apiService'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/Input'
import Button from '../components/Button'
import './Auth.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

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
    setLoading(true)

    try {
      const response = await authService.login(formData)
      if (response.success) {
        login(response.data.token, response.data.user)
        navigate('/profile')
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Giriş yapılırken bir hata oluştu.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Giriş Yap</h2>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <Input
            label="E-posta"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ornek@email.com"
            required
          />
          <Input
            label="Şifre"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Şifrenizi girin"
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>
        <p className="auth-link">
          Hesabınız yok mu? <Link to="/register">Kayıt olun</Link>
        </p>
      </div>
    </div>
  )
}

export default Login

