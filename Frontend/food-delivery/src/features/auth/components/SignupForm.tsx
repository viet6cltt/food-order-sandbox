import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useFirebaseAuth from '../../../hooks/useFirebaseAuth';

const SignupForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const firebaseAuth = useFirebaseAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      firebaseAuth.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Firebase auth errors
  useEffect(() => {
    if (firebaseAuth.error) {
      setError(firebaseAuth.error);
    }
  }, [firebaseAuth.error]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await firebaseAuth.sendOTP(phone);
      // Chỉ chuyển step khi sendOTP thành công và không có lỗi
      if (!firebaseAuth.error) {
        setStep('otp');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể gửi mã OTP. Vui lòng thử lại.';
      setError(errorMessage);
      // Đảm bảo ở lại step phone nếu có lỗi
      setStep('phone');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setError('Vui lòng nhập mã OTP');
      return;
    }

    // Kiểm tra trước khi verify
    if (!firebaseAuth.hasConfirmationResult) {
      setStep('phone');
      setOtpCode('');
      setError('Vui lòng gửi mã OTP trước khi xác minh.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await firebaseAuth.verifyOTP(otpCode);
      setIdToken(token);
      setStep('register');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Mã OTP không đúng. Vui lòng thử lại.';
      
      // Nếu lỗi là "Chưa gửi mã OTP", quay lại step phone và reset
      if (errorMessage.includes('Chưa gửi mã OTP') || errorMessage.includes('gửi mã OTP trước')) {
        setStep('phone');
        setOtpCode('');
        setError('Vui lòng gửi mã OTP trước khi xác minh.');
        firebaseAuth.reset();
      } else {
        // Các lỗi khác (OTP sai, expired, etc.) - giữ ở step OTP
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !idToken) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register(username, password, idToken);
      navigate('/');
    } catch (err: unknown) {
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string; message?: string } } };
        errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setOtpCode('');
    setError(null);
    firebaseAuth.reset();
  };

  return (
    <div className={`max-w-md mx-auto p-6 bg-white rounded shadow ${className}`}>
      <h2 className="text-2xl font-semibold mb-4">Đăng ký</h2>

      {/* reCAPTCHA container - ẩn, sẽ được Firebase tự động tạo */}
      <div id="recaptcha-container"></div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}

      {/* Step 1: Nhập số điện thoại */}
      {step === 'phone' && (
        <form onSubmit={handleSendOTP}>
          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">Số điện thoại</span>
            <input 
              type="tel" 
              required 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
            <p className="mt-1 text-xs text-gray-500">
              Chúng tôi sẽ gửi mã OTP đến số điện thoại này để xác minh
            </p>
          </label>

          <button 
            type="submit" 
            disabled={loading || firebaseAuth.loading} 
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading || firebaseAuth.loading ? 'Đang gửi mã OTP...' : 'Gửi mã OTP'}
          </button>
        </form>
      )}

      {/* Step 2: Nhập mã OTP */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP}>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Mã OTP đã được gửi đến số điện thoại <strong>{phone}</strong>
            </p>
            <button
              type="button"
              onClick={handleBack}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Đổi số điện thoại
            </button>
          </div>

          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">Mã OTP</span>
            <input 
              type="text" 
              required 
              value={otpCode} 
              onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))} 
              maxLength={6}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </label>

          <button 
            type="submit" 
            disabled={loading || firebaseAuth.loading} 
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading || firebaseAuth.loading ? 'Đang xác minh...' : 'Xác minh OTP'}
          </button>
        </form>
      )}

      {/* Step 3: Điền thông tin đăng ký */}
      {step === 'register' && (
        <form onSubmit={handleRegister}>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded text-sm">
            <p className="font-medium">✓ Số điện thoại đã được xác minh: <strong>{phone}</strong></p>
          </div>

          <label className="block mb-2">
            <span className="text-sm font-medium text-gray-700">Tên người dùng</span>
            <input 
              type="text" 
              required 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">Mật khẩu</span>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              minLength={6}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </label>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Đang đăng ký...' : 'Hoàn tất đăng ký'}
          </button>
        </form>
      )}

      <div className="mt-4 text-center">
        <Link to="/login" className="text-green-600 hover:underline">
          Đã có tài khoản? Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
