//Template form to test AuthLayout -> change the UI and state to finish 

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'owner'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // No backend yet — simulate registration success and navigate home
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 700);
  };

  return (
    <form onSubmit={onSubmit} className={` ${className}`}>
      <h2 className="text-2xl font-semibold mb-4">Đăng ký</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <label className="block mb-2">  
        <span className="text-sm">Tên</span>
        <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
      </label>
      <label className="block mb-2">
        <span className="text-sm">Email</span>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
      </label>
      <label className="block mb-2">
        <span className="text-sm">Mật khẩu</span>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
      </label>
      <label className="block mb-4">
        <span className="text-sm">Vai trò</span>
        <select value={role} onChange={e => setRole(e.target.value as 'customer' | 'owner')} className="mt-1 block w-full border rounded px-3 py-2">
          <option value="customer">Customer</option>
          <option value="owner">Owner</option>
        </select>
      </label>
      <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">
        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
      </button>
    </form>
  );
};

export default SignupForm;
