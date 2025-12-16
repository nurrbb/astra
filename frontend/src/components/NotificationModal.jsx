import { useEffect } from 'react'
import Button from './Button'
import './NotificationModal.css'

const NotificationModal = ({ message, onClose, type = 'success' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div
        className={`notification-modal notification-${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="notification-header">
          <h3>
            {type === 'success' ? '✓ Başarılı' : 'ℹ Bilgi'}
          </h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="notification-body">
          <p>{message}</p>
        </div>
        <div className="notification-footer">
          <Button onClick={onClose} variant="primary">
            Tamam
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotificationModal

