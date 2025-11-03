import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

type Props = {
  children?: React.ReactNode
  className?: string
}

const AppLayout: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${className}`}>
      <Header />

      <div className="flex-1 flex-1 w-full">
        {children}
      </div>

      <Footer />
    </div>
  )
}

export default AppLayout
