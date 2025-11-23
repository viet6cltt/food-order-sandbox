import React from 'react'
import useAuth from '../../hooks/useAuth'
import SearchButton from '../ui/SearchButton'
import { useNavigate } from 'react-router-dom'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'

type Props = {
  className?: string
}

const Header: React.FC<Props> = ({ className = '' }) => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate();

  const handleOnClickOwnerRegistration = () => {
    // Logic for owner registration click
    navigate('/owner/register');
  }

  const handleOnClickCartIcon = () => {
    // Logic for cart icon click
    navigate('/cart');
  }

  const handleOnClickProfile = () => {
    // Logic for profile click
    navigate('/profile');
  }

  const handleOnClickLogin = () => {
    // Logic for login click
    navigate('/login');
  }

  const handleOnClickHome = () => {
    // Logic for home click
    navigate('/');
  }

  return (
    <header className={`sticky top-0 z-30 bg-white/50 backdrop-blur-sm shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-left space-x-4">
            <button className="text-xl font-semibold text-green-600" type="button" onClick={handleOnClickHome}>Food Delivery</button>
          </div>

          <div>
            <button type="button" 
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transparent focus:outline-none focus:ring-2 focus:ring-indigo-300" 
                    aria-label="Owner registration"
                    onClick={handleOnClickOwnerRegistration}>
              Owner Registration
            </button>
          </div>

          <div className='flex direction-row items-center space-x-6'>
            <nav className="hidden sm:flex sm:space-x-6" aria-label="Main">
              <SearchButton />
            </nav>

              <div className="flex items-center space-x-4">
                {isAuthenticated && user ? (
                  <div className='flex flex-row items-center space-x-4'>
                    <button type="button" 
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transparent focus:outline-none focus:ring-2 focus:ring-indigo-300" 
                        aria-label="Cart Icon"
                        onClick={handleOnClickCartIcon}>
                        <ShoppingCartIcon className="h-5 w-5" />
                    </button>
                    <button type='button' 
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transparent focus:outline-none focus:ring-2 focus:ring-indigo-300" 
                        aria-label="Profile"
                        onClick={handleOnClickProfile}>
                      <UserIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <button type='button' onClick={handleOnClickLogin}>
                    <span className="text-sm text-gray-700 hover:text-gray-900">Login</span>
                  </button>
                )}
              </div>
          </div>
        </div>
      </div>
      </header>
  )
}

export default Header