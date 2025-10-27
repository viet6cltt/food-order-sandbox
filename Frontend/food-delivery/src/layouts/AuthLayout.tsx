import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

type Props = {
  children: React.ReactNode
  className?: string
}

const AuthLayout: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-100  ${className}`}>
        <Header />

        <main className="flex items-center justify-center align-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
            {/* Accessible container for auth forms */}
            {children}
            </div>
        </main>

        <Footer />
    </div>
  )
}

export default AuthLayout
