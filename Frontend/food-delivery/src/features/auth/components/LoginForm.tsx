import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const LoginForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(phone, password);
      navigate('/');
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error || (err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as Error).message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={`max-w-md mx-auto p-6 bg-white rounded shadow ${className}`}>
      <h2 className="text-2xl font-semibold mb-4">Đăng nhập</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}
      <label className="block mb-2">
        <span className="text-sm font-medium text-gray-700">Số điện thoại</span>
        <input 
          type="tel" 
          required 
          value={phone} 
          onChange={e => setPhone(e.target.value)} 
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        />
      </label>
      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700">Mật khẩu</span>
        <input 
          type="password" 
          required 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        />
      </label>
      <button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
      <div className="mt-4 text-center">
        <Link to="/signup" className="text-blue-600 hover:underline">
          Tạo tài khoản mới
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
