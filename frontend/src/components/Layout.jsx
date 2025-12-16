import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Layout.css'

const Layout = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            Astra
          </Link>
          <nav className="nav">
            <Link to="/products" className="nav-link">
              Ürünler
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="nav-link">
                  Sepet
                </Link>
                <Link to="/profile" className="nav-link">
                  {user?.name || 'Profil'}
                </Link>
                <button onClick={handleLogout} className="btn-logout">
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Giriş
                </Link>
                <Link to="/register" className="nav-link">
                  Kayıt Ol
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
    </div>
  )
}

export default Layout

