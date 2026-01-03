import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserIcon, ArrowLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import useUser from '../../hooks/useUser';

type Props = {
  className?: string;
};

const AuthHeader: React.FC<Props> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useUser();

  const isLoginPage = location.pathname === '/auth/login';

  const handleLogoClick = () => {
    if (isAuthenticated) {
      if (user?.role === 'admin') navigate('/admin/dashboard');
      else if (user?.role === 'restaurant_owner') navigate('/owner/restaurant-list');
      else navigate('/');
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <header className="h-16 border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
           <div className="h-7 w-36 bg-gray-100 animate-pulse rounded-lg" />
           <div className="h-9 w-9 bg-gray-100 animate-pulse rounded-full" />
        </div>
      </header>
    );
  }

  return (
    <header className={`sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50 transition-all ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LEFT: Logo & Breadcrumb-like feel */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogoClick}
              className="flex items-center group"
            >
              <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent tracking-tight">
                FOOD<span className="text-gray-900">ORDER</span>
              </span>
            </button>
            
            <div className="hidden sm:flex items-center text-gray-300 pointer-events-none">
              <ChevronRightIcon className="h-4 w-4" />
              <span className="ml-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                Xác thực
              </span>
            </div>
          </div>

          {/* RIGHT: Context-aware actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button 
                onClick={() => navigate('/profile')}
                className="group flex items-center gap-2 p-1 pr-4 rounded-full bg-gray-50 border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all duration-300"
              >
                <div className="relative">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} className="h-8 w-8 rounded-full object-cover border border-white shadow-sm" alt="avatar" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-gray-100">
                      <UserIcon className="h-5 w-5 text-gray-400 group-hover:text-green-500" />
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="text-left leading-none">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Tài khoản</p>
                  <p className="text-sm font-bold text-gray-700">{user?.firstname || user?.username}</p>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-6">
                <button
                  onClick={() => navigate(isLoginPage ? '/auth/signup' : '/auth/login')}
                  className="text-sm font-bold text-gray-600 hover:text-green-600 transition-colors"
                >
                  {isLoginPage ? 'Đăng ký' : 'Đăng nhập'}
                </button>
                
                <button 
                  onClick={() => navigate('/')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-95"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Về trang chủ
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

export default AuthHeader;