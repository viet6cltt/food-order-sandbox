import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'
import SearchButton from '../ui/SearchButton'
import useUser from '../../hooks/useUser'
import * as cartApi from '../../features/cart/api'

type Props = {
  className?: string
}

const Header: React.FC<Props> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useUser();
  const [cartCount, setCartCount] = useState(0)

  const shouldShowCart = Boolean(isAuthenticated && user?.role !== 'admin' && user?.role !== 'restaurant_owner')

  useEffect(() => {
    if (!shouldShowCart) {
      setCartCount(0)
      return
    }

    let mounted = true

    async function loadCartCount() {
      try {
        const cart = await cartApi.getCart()
        const next = cart?.totalItems ?? cart?.items?.reduce((sum, it) => sum + (it?.qty ?? 0), 0) ?? 0
        if (mounted) setCartCount(next)
      } catch {
        if (mounted) setCartCount(0)
      }
    }

    loadCartCount()

    function onCartUpdated(event: Event) {
      const custom = event as CustomEvent<{ totalItems?: number }>
      const next = typeof custom.detail?.totalItems === 'number' ? custom.detail.totalItems : undefined
      if (typeof next === 'number') setCartCount(next)
      else loadCartCount()
    }

    window.addEventListener('cart:updated', onCartUpdated)
    return () => {
      mounted = false
      window.removeEventListener('cart:updated', onCartUpdated)
    }
  }, [shouldShowCart])

  const handleLogoClick = () => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (isAuthenticated && user?.role === 'restaurant_owner') {
      navigate('/owner/dashboard');
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <header className={`sticky top-0 z-30 bg-white h-16 border-b border-gray-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
           <div className="h-8 w-32 bg-gray-100 animate-pulse rounded" />
           <div className="h-10 w-full max-w-md bg-gray-100 animate-pulse rounded-full hidden md:block" />
           <div className="h-8 w-8 bg-gray-100 animate-pulse rounded-full" />
        </div>
      </header>
    );
  }

  return (
    <header className={`sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm ${className}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* SỬ DỤNG GRID ĐỂ CHIA TỈ LỆ CỐ ĐỊNH */}
        <div className="grid grid-cols-2 md:grid-cols-[200px_1fr_auto] items-center h-16 gap-4">
          
          {/* 1. LOGO - LUÔN SÁT TRÁI */}
          <div className="flex justify-start">
            <button 
              className="text-xl md:text-2xl font-black text-green-600 tracking-tighter uppercase" 
              onClick={handleLogoClick}
            >
              Food<span className="text-gray-800">Order</span>
            </button>
          </div>

          {/* 2. SEARCH BAR - CHIẾM TRỌN PHẦN GIỮA (1fr) */}
          <div className="hidden md:block w-full">
            <div className="w-full max-w-2xl mx-auto">
               {/* Đảm bảo bên trong component SearchButton này phải có class w-full */}
               <SearchButton />
            </div>
          </div>

          {/* 3. ACTIONS - LUÔN SÁT PHẢI */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-4">
            
            {/* Nav Links (Chỉ hiện trên màn hình lớn) */}
            <nav className="hidden xl:flex items-center space-x-4 border-r border-gray-200 pr-4 mr-2">
              {isAuthenticated && user?.role === 'customer' && (
                <button
                  className="text-xs font-bold text-gray-500 hover:text-green-600 transition uppercase"
                  onClick={() => navigate('/owner/register')}
                >
                  Mở quán
                </button>
              )}

              {isAuthenticated && user?.role === 'restaurant_owner' && (
                <button
                  className="text-xs font-bold text-gray-700 hover:text-green-600 transition uppercase"
                  onClick={() => navigate('/owner/menu-list')}
                >
                  Menu
                </button>
              )}
            </nav>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {user?.role !== 'admin' &&  user?.role !== 'restaurant_owner' && (
                  <button 
                    onClick={() => navigate('/cart')} 
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition relative group"
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-green-600 text-white text-[10px] font-bold leading-[18px] text-center">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </button>
                )}
                
                <button 
                  onClick={() => navigate('/profile')} 
                  className="flex items-center space-x-2 p-1 pl-1 pr-3 rounded-full hover:bg-gray-100 border border-gray-100 transition"
                >
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} className="h-8 w-8 rounded-full object-cover" alt="" />
                  ) : (
                    <div className="bg-green-100 p-1.5 rounded-full">
                      <UserIcon className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                  <div className="hidden lg:block text-left leading-tight">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Chào bạn,</p>
                    <p className="text-sm font-bold text-gray-800 truncate max-w-[100px]">
                      {user?.firstname || user?.username}
                    </p>
                  </div>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-sm font-bold text-white bg-green-600 rounded-full hover:bg-green-700 transition"
              >
                ĐĂNG NHẬP
              </button>
            )}

            {/* Icon Search Mobile */}
            <div className="md:hidden">
                <SearchButton isMobileIconOnly />
            </div>
          </div>
          
        </div>
      </div>
    </header>
  );
}

export default Header;