import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'
import SearchButton from '../ui/SearchButton'
import useUser from '../../hooks/useUser'

type Props = {
  className?: string
}

const Header: React.FC<Props> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <header className={`sticky top-0 z-30 bg-white h-16 border-b border-gray-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
           <div className="h-8 w-32 bg-gray-100 animate-pulse rounded" />
           <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-full hidden md:block" />
           <div className="h-8 w-8 bg-gray-100 animate-pulse rounded-full" />
        </div>
      </header>
    );
  }

  return (
    <header className={`sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* LOGO */}
          <div className="flex-shrink-0">
            <button 
              className="text-xl font-bold text-green-600 tracking-tight" 
              onClick={() => navigate('/')}
            >
              Food Delivery
            </button>
          </div>

          {/* SEARCH BUTTON - Thêm vào vị trí trung tâm */}
          <div className="flex-1 max-w-md hidden md:block">
            <SearchButton />
          </div>

          {/* RIGHT SIDE: NAV, CART & PROFILE */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Role-based Navigation */}
            <div className="hidden lg:flex items-center space-x-4 mr-2">
              {isAuthenticated && (
                <>
                  {user?.role === 'customer' && (
                    <button
                      className="text-sm font-medium text-gray-600 hover:text-green-600 transition"
                      onClick={() => navigate('/owner/register')}
                    >
                      Owner Registration
                    </button>
                  )}
                  {user?.role === 'restaurant_owner' && (
                    <div className="flex space-x-4 text-sm font-medium">
                      <button className="hover:text-green-600" onClick={() => navigate('/owner/dashboard')}>Dashboard</button>
                      <button className="hover:text-green-600" onClick={() => navigate('/owner/menu-list')}>Menu</button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile Search Icon (nếu SearchButton của bạn chỉ hiện trên desktop) */}
            <div className="md:hidden">
               <SearchButton isMobileIconOnly /> 
            </div>

            {isAuthenticated ? (
              <>
                {/* Giỏ hàng */}
                <button 
                  onClick={() => navigate('/cart')} 
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition relative"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {/* Có thể thêm badge số lượng item ở đây */}
                </button>
                
                {/* Profile */}
                <button 
                  onClick={() => navigate('/profile')} 
                  className="flex items-center space-x-2 p-1 pr-3 rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200 transition"
                >
                  {user?.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt="avatar" 
                      className="h-8 w-8 rounded-full object-cover border border-gray-200" 
                    />
                  ) : (
                    <div className="bg-green-100 p-1.5 rounded-full">
                      <UserIcon className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-xs text-gray-400 leading-none mb-1">Welcome,</p>
                    <p className="text-sm font-bold text-gray-700 leading-none">
                      {user?.firstname || user?.username}
                    </p>
                  </div>
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-sm font-bold text-white bg-green-600 rounded-full hover:bg-green-700 transition shadow-md shadow-green-100"
              >
                Login
              </button>
            )}
          </div>
          
        </div>
      </div>
    </header>
  );
}

export default Header;