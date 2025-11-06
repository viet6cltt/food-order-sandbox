//Template form to test AuthLayout -> change the UI and state to finish 

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // API not available yet — simulate success and navigate to home
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 700);
  };

  return (
    <form onSubmit={onSubmit} className={`max-w-md mx-auto p-6 bg-white rounded shadow ${className}`}>
      <h2 className="text-2xl font-semibold mb-4">Đăng nhập</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <label className="block mb-2">
        <span className="text-sm">Email</span>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
      </label>
      <label className="block mb-4">
        <span className="text-sm">Mật khẩu</span>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
      </label>
      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
      <button>
        <a href="/signup" className="w-full text-center mt-4 block text-blue-600 hover:underline">
          Tạo tài khoản mới
        </a>
      </button>
    </form>
  );
};

export default LoginForm;
