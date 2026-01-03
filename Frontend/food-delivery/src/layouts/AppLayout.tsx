import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import useAuth from '../hooks/useAuth' // Giả định đường dẫn hook của bạn

type Props = {
  children?: React.ReactNode
  className?: string
}

const AppLayout: React.FC<Props> = ({ children, className = '' }) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // 1. Chỉ kiểm tra khi đã tải xong dữ liệu (isLoading === false)
    // 2. Kiểm tra nếu user đã đăng nhập và có status là BANNED
    if (!isLoading && isAuthenticated && user?.status === 'banned') {
      // 3. Tránh vòng lặp: Nếu đang ở trang /banned rồi thì không điều hướng nữa
      if (location.pathname !== '/banned') {
        navigate('/banned', { replace: true })
      }
    }
  }, [user, isAuthenticated, isLoading, navigate, location.pathname])

  // Nếu đang tải thông tin user, có thể hiện loading để tránh bị "nháy" giao diện
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${className}`}>
      {/* Nếu bị khóa, thường chúng ta sẽ ẩn luôn Header/Footer 
          để user không tương tác được gì khác.
      */}
      {user?.status !== 'banned' && <Header />}

      <div className="flex-1 w-full flex flex-col">
        {children}
      </div>

      {user?.status !== 'banned' && <Footer />}
    </div>
  )
}

export default AppLayout