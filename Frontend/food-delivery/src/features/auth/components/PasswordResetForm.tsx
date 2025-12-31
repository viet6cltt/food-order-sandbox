
import React, { useState } from 'react';
import { resetPassword } from '../api';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PasswordResetForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!token) {
      setError('Token không hợp lệ.');
      return;
    }
    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu phải ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ token, newPassword });
      if (res.success) {
        setSuccessMessage('Mật khẩu đã được cập nhật thành công!');
        setTimeout(() => {
          navigate('/login'); // Redirect về login
        }, 1500);
      } else {
        setError(res.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể cập nhật mật khẩu.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Đặt lại mật khẩu</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Mật khẩu mới</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Nhập mật khẩu mới"
          required
        />

        <label className="block mb-2 font-semibold">Xác nhận mật khẩu</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Nhập lại mật khẩu mới"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
        </button>
      </form>
    </div>
  );
};

export default PasswordResetForm;
