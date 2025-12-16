import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/apiService'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/Input'
import Button from '../components/Button'
import './Profile.css'

const Profile = () => {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      }
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await authService.updateProfile(updateData)
      if (response.success) {
        setSuccess('Profil başarıyla güncellendi')
        login(localStorage.getItem('token'), response.data.user)
        setFormData({ ...formData, password: '' })
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Profil güncellenirken bir hata oluştu.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profil Bilgileri</h2>
        {error && <div className="error-alert">{error}</div>}
        {success && <div className="success-alert">{success}</div>}
        <form onSubmit={handleSubmit}>
          <Input
            label="Ad Soyad"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="E-posta"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Yeni Şifre (Opsiyonel)"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Değiştirmek istemiyorsanız boş bırakın"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Profile

