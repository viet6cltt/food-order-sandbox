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
  <header
    className={`sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-sm ${className}`}
  >
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 md:grid-cols-[220px_1fr_auto] items-center h-16 gap-4">

        {/* LOGO */}
        <div className="flex items-center">
          <button
            onClick={handleLogoClick}
            className="text-xl md:text-2xl font-black tracking-tight text-emerald-600 hover:opacity-90 transition"
          >
            Food<span className="text-gray-900">Order</span>
          </button>
        </div>

        {/* SEARCH (DESKTOP) */}
        <div className="hidden md:flex justify-center">
          <div className="w-full max-w-2xl">
            <SearchButton />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">

          {/* NAV LINKS (XL) */}
          <nav className="hidden xl:flex items-center gap-4 pr-4 mr-2 border-r border-gray-200">
            {isAuthenticated && user?.role === 'customer' && (
              <button
                onClick={() => navigate('/owner/register')}
                className="text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-emerald-600 transition"
              >
                Mở quán
              </button>
            )}

            {isAuthenticated && user?.role === 'restaurant_owner' && (
              <button
                onClick={() => navigate('/owner/menu-list')}
                className="text-xs font-semibold uppercase tracking-wide text-gray-700 hover:text-emerald-600 transition"
              >
                Menu
              </button>
            )}
          </nav>

          {isAuthenticated ? (
            <>
              {/* CTA OWNER */}
              {(user?.role === 'customer' || user?.role === 'restaurant_owner') && (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => navigate('/owner/register')}
                    className="px-4 py-1.5 text-sm font-semibold rounded-full
                      bg-emerald-50 text-emerald-700 border border-emerald-200
                      hover:bg-emerald-100 hover:border-emerald-300 transition"
                  >
                    Mở quán
                  </button>

                  {user?.role === 'restaurant_owner' && (
                    <button
                      onClick={() => navigate('/owner/dashboard')}
                      className="px-4 py-1.5 text-sm font-semibold rounded-full
                        bg-white border border-gray-300 text-gray-700
                        hover:bg-gray-50 transition"
                    >
                      Quán của bạn
                    </button>
                  )}
                </div>
              )}

              {/* CART */}
              {user?.role !== 'admin' && user?.role !== 'restaurant_owner' && (
                <button
                  onClick={() => navigate('/cart')}
                  className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px]
                      rounded-full bg-emerald-600 text-white text-[10px]
                      font-bold flex items-center justify-center px-1">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* USER */}
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full
                  border border-gray-200 hover:bg-gray-100 transition"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                )}

                <div className="hidden lg:block text-left leading-tight max-w-[110px]">
                  <p className="text-[10px] uppercase text-gray-400 font-semibold">
                    Xin chào
                  </p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user?.firstname || user?.username}
                  </p>
                </div>
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/auth/login')}
              className="px-6 py-2 text-sm font-semibold rounded-full
                bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
            >
              Đăng nhập
            </button>
          )}

          {/* SEARCH MOBILE */}
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