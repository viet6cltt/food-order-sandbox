import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getOAuthUrl } from '../api';
import useAuth from '../../../hooks/useAuth';
import { toast } from 'react-toastify';

const LoginForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(phone, password);
      navigate('/redirect');
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error).message ||
        'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async () => {
    try {
      const returnUrl = window.location.origin + '/';
      const res = await getOAuthUrl('google', returnUrl);

      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error('Không lấy được URL đăng nhập Google');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi lấy OAuth URL');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4 ${className}`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-emerald-600 text-white rounded-full p-3 mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L9 5.414V16a1 1 0 102 0V5.414l6.293 6.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Food Delivery</h1>
          <p className="text-gray-600">Đăng nhập để bắt đầu đặt hàng</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Phone Input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="09xx xxx xxx"
              className="w-full px-4 py-3 border-2 border-gray-200 placeholder:text-gray-400 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">Mật khẩu</label>
              <Link to="/reset-password-request" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Quên mật khẩu?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mb-4 flex items-center justify-center gap-2"
          >
            {loading && <svg className="animate-spin w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0A7 7 0 0014.707 14.707a1 1 0 01-1.414 1.414A9 9 0 014.293 4.293zM15.71 2.29a1 1 0 011.414 1.414A9 9 0 005.707 16.707a1 1 0 01-1.414-1.414A7 7 0 0115.71 2.29z" /></svg>}
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500 font-medium">Hoặc tiếp tục bằng</span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-1 gap-3 mb-8">
          <button
            type="button"
            onClick={handleOAuthLogin}
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-gray-300 hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <image
                href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDEySi4xMlYxNC41Nkg3LjA5QzYuNjMgMTUuODkgNS4xMyAxNi42MyAzLjI4IDE2LjYzQzEuNzEgMTYuNjMgMC4zOCAxNS40OCAwLjI1IDE0TDAgMTIuODhWMTEuMDZMMC4yMyAxMC4xMkMwLjM1IDguNjMgMS42OSA3LjM4IDMuMjggNy4zOEM1LjA1IDcuMzggNi40NCA4LjMxIDcuMDYgOS43M0wxMi41IDcuMDZDMTEuOCA0LjQxIDkuMTggMi41NiA2IDIuNTZDMi43NyAyLjU2IDAgNS4yIDAgOC4xMkMwIDExLjA0IDIuNzcgMTMuNjggNiAxMy42OEM3LjE4IDEzLjY4IDguMzEgMTMuMzggOS4yOCAxMi43M0wxMyAxNS41MUMxMS41IDE2LjM3IDkuNzEgMTYuOCA3Ljc1IDE2LjhDMy41NSAxNi44IDAuMDMgMTMuMjggMC4wMyA5LjA4QzAgNC44OCAzLjU1IDEuMzYgNy43NSAxLjM2QzEwLjA0IDEuMzYgMTIuMSAyLjI2IDE0LjM1IDMuODhMMTkuMDMgMS41NUMyMS4wMyAwLjU0IDIzLjI2IDAgMjQgMFYyNC41SDE4LjA2VjE4LjQ4SDE0LjM1VjI0LjVIMTJWMTIuMjVIMjIuNTZaIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+"
              />
            </svg>
            Google
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
