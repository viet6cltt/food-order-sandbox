import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../../layouts/AuthLayout';
import { completeProfile } from '../api';
import useAuth from '../../../hooks/useAuth';

const CompleteProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  const userId = useMemo(() => searchParams.get('userId') || '', [searchParams]);

  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError('Thiếu userId từ OAuth. Vui lòng đăng nhập lại.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setLoading(true);
      const res = await completeProfile({ userId, phone, username, password });
      const accessToken = res.data?.accessToken;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      await refreshUser();
      navigate('/redirect');
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error).message ||
        'Hoàn tất hồ sơ thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Hoàn tất thông tin</h1>
            <p className="text-gray-600">Vui lòng bổ sung thông tin để tiếp tục</p>
          </div>

          <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <span>{error}</span>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tên người dùng</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full px-4 py-3 border-2 border-gray-200 placeholder:text-gray-400 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                className="w-full px-4 py-3 border-2 border-gray-200 placeholder:text-gray-400 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 placeholder:text-gray-400 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 placeholder:text-gray-400 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Hoàn tất'}
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default CompleteProfileScreen;
