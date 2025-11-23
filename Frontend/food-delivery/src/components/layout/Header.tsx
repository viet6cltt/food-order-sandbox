import React from 'react'
import useAuth from '../../hooks/useAuth'
import SearchButton from '../ui/SearchButton'
import { useNavigate } from 'react-router-dom'

type Props = {
  className?: string
}

function getInitials(name?: string, email?: string) {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
    return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase()
  }
  if (email) return email.slice(0, 1).toUpperCase()
  return '?' 
}

const Header: React.FC<Props> = ({ className = '' }) => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate();

  const handleOnClickOwnerRegistration = () => {
    // Logic for owner registration click
    navigate('/owner/register');
  }

  return (
    <header className={`sticky top-0 z-30 bg-white/50 backdrop-blur-sm shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-left space-x-4">
            <a href="/" className="text-xl font-semibold text-indigo-600">Food Delivery</a>
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
                  <a
                    href="/profile"
                    aria-label="Profile"
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-medium">
                      {getInitials(user.name, user.email)}
                    </div>
                    <span className="hidden sm:inline text-sm text-gray-700">{user.name ?? 'Profile'}</span>
                  </a>
                ) : (
                  <a href="/login" className="text-sm text-gray-700 hover:text-gray-900">Login</a>
                )}
              </div>
          </div>
        </div>
      </div>
      </header>
  )
}

export default Header