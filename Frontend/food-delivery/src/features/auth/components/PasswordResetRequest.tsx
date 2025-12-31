import React, { useState } from 'react'
import { requestPasswordReset } from '../api';
import { useNavigate } from 'react-router-dom'; // dùng navigate để chuyển màn hình

interface PasswordResetRequestProps {}

const PasswordResetRequest: React.FC<PasswordResetRequestProps> = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError('Vui lòng nhập email')
      return
    }

    setLoading(true)
    try {
      const res = await requestPasswordReset({ email })

      if (res.success) {
        alert('Email đã được gửi, vui lòng kiểm tra email')
        navigate('/login') // quay lại màn login
      } else {
        setError(res.message || 'Có lỗi xảy ra. Vui lòng thử lại')
      }
    } catch (err: unknown) {
      let message = 'Không thể gửi email reset. Vui lòng thử lại.'
      if (err && typeof err === 'object' && 'response' in err) {
        // @ts-ignore
        message = err.response?.data?.error || err.response?.data?.message || message
      } else if (err instanceof Error) {
        message = err.message
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Đặt lại mật khẩu</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border placeholder:text-gray-400 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="example@gmail.com"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
        </button>
      </form>
    </div>
  );
}

export default PasswordResetRequest
