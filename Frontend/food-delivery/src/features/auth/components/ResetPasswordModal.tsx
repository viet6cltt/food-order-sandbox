import React, { useState, useEffect } from 'react'
import useFirebaseAuth from '../../../hooks/useFirebaseAuth'

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const firebaseAuth = useFirebaseAuth()
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState<'phone' | 'otp' | 'password'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    return () => {
      firebaseAuth.reset()
    }
  }, [])

  useEffect(() => {
    if (firebaseAuth.error) {
      setError(firebaseAuth.error)
    }
  }, [firebaseAuth.error])

  if (!isOpen) return null

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) {
      setError('Vui lòng nhập số điện thoại')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await firebaseAuth.sendOTP(phone)
      if (!firebaseAuth.error) {
        setStep('otp')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể gửi mã OTP. Vui lòng thử lại.'
      setError(errorMessage)
      setStep('phone')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode) {
      setError('Vui lòng nhập mã OTP')
      return
    }

    if (!firebaseAuth.hasConfirmationResult) {
      setStep('phone')
      setOtpCode('')
      setError('Vui lòng gửi mã OTP trước khi xác minh.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await firebaseAuth.verifyOTP(otpCode)
      setStep('password')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Mã OTP không đúng. Vui lòng thử lại.'

      if (errorMessage.includes('Chưa gửi mã OTP') || errorMessage.includes('gửi mã OTP trước')) {
        setStep('phone')
        setOtpCode('')
        setError('Vui lòng gửi mã OTP trước khi xác minh.')
        firebaseAuth.reset()
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới')
      return
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    setLoading(true)

    try {
      // TODO: Replace with real API call
      // const response = await apiClient.post('/api/auth/reset-password', {
      //   phone,
      //   newPassword,
      //   idToken: firebaseAuth.idToken
      // })

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Success
      setPhone('')
      setOtpCode('')
      setNewPassword('')
      setConfirmPassword('')
      setStep('phone')
      firebaseAuth.reset()

      if (onSuccess) {
        onSuccess()
      }

      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err: unknown) {
      let errorMessage = 'Không thể đặt lại mật khẩu. Vui lòng thử lại.'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string; message?: string } } }
        errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.message || errorMessage
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setPhone('')
    setOtpCode('')
    setNewPassword('')
    setConfirmPassword('')
    setStep('phone')
    setError(null)
    firebaseAuth.reset()
    onClose()
  }

  const handleBack = () => {
    setStep('phone')
    setOtpCode('')
    setError(null)
    firebaseAuth.reset()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Đặt lại mật khẩu</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-emerald-500 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex gap-1 mb-6">
            <div className={`flex-1 h-2 rounded-full ${step === 'phone' || step === 'otp' || step === 'password' ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step === 'otp' || step === 'password' ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step === 'password' ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
          </div>

          {/* Step 1: Phone */}
          {step === 'phone' && (
            <form onSubmit={handleSendOTP}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xx xxx xxx"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Nhập số điện thoại được liên kết với tài khoản của bạn
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || firebaseAuth.loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {(loading || firebaseAuth.loading) && (
                  <svg className="animate-spin w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0A7 7 0 0114.707 14.707a1 1 0 01-1.414 1.414A9 9 0 014.293 4.293zM15.71 2.29a1 1 0 011.414 1.414A9 9 0 005.707 16.707a1 1 0 01-1.414-1.414A7 7 0 0115.71 2.29z" />
                  </svg>
                )}
                {loading || firebaseAuth.loading ? 'Đang gửi mã OTP...' : 'Gửi mã OTP'}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">
                  Mã OTP đã được gửi đến số điện thoại <strong className="text-gray-800">{phone}</strong>
                </p>
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                >
                  ← Đổi số điện thoại
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mã OTP</label>
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  placeholder="000000"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading || firebaseAuth.loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {(loading || firebaseAuth.loading) && (
                  <svg className="animate-spin w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0A7 7 0 0114.707 14.707a1 1 0 01-1.414 1.414A9 9 0 014.293 4.293zM15.71 2.29a1 1 0 011.414 1.414A9 9 0 005.707 16.707a1 1 0 01-1.414-1.414A7 7 0 0115.71 2.29z" />
                  </svg>
                )}
                {loading || firebaseAuth.loading ? 'Đang xác minh...' : 'Xác minh OTP'}
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-800 rounded">
                <p className="font-medium flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  Số điện thoại đã xác minh
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showNewPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L9.172 9.172m5.656 5.656l.94-.94m1.414-1.414L9.172 9.172" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L9.172 9.172m5.656 5.656l.94-.94m1.414-1.414L9.172 9.172" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && (
                    <svg className="animate-spin w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0A7 7 0 0114.707 14.707a1 1 0 01-1.414 1.414A9 9 0 014.293 4.293zM15.71 2.29a1 1 0 011.414 1.414A9 9 0 005.707 16.707a1 1 0 01-1.414-1.414A7 7 0 0115.71 2.29z" />
                    </svg>
                  )}
                  {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordModal
