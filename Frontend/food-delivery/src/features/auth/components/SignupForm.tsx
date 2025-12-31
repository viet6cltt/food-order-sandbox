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

  useEffect(() => {
    return () => {
      firebaseAuth.reset();
    };
  }, []);

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
      if (!firebaseAuth.error) {
        setStep('otp');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể gửi mã OTP. Vui lòng thử lại.';
      setError(errorMessage);
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
      
      if (errorMessage.includes('Chưa gửi mã OTP') || errorMessage.includes('gửi mã OTP trước')) {
        setStep('phone');
        setOtpCode('');
        setError('Vui lòng gửi mã OTP trước khi xác minh.');
        firebaseAuth.reset();
      } else {
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
    <div className={`min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 ${className}`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-emerald-600 text-white rounded-full p-3 mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L9 5.414V16a1 1 0 102 0V5.414l6.293 6.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tạo tài khoản</h1>
          <p className="text-gray-600">Đăng ký để bắt đầu đặt hàng</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* reCAPTCHA container */}
          <div id="recaptcha-container" className="hidden"></div>

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

          {/* Step Indicator */}
          <div className="flex gap-1 mb-8">
            <div className={`flex-1 h-2 rounded-full ${step === 'phone' || step === 'otp' || step === 'register' ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step === 'otp' || step === 'register' ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step === 'register' ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
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
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="09xx xxx xxx"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Chúng tôi sẽ gửi mã OTP đến số điện thoại này để xác minh
                </p>
              </div>

              <button 
                type="submit" 
                disabled={loading || firebaseAuth.loading} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading || firebaseAuth.loading && <svg className="animate-spin w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0A7 7 0 0014.707 14.707a1 1 0 01-1.414 1.414A9 9 0 014.293 4.293zM15.71 2.29a1 1 0 011.414 1.414A9 9 0 005.707 16.707a1 1 0 01-1.414-1.414A7 7 0 0115.71 2.29z" /></svg>}
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
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 mb-4"
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
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))} 
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
                {loading || firebaseAuth.loading && <svg className="animate-spin w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0A7 7 0 0114.707 14.707a1 1 0 01-1.414 1.414A9 9 0 014.293 4.293zM15.71 2.29a1 1 0 011.414 1.414A9 9 0 005.707 16.707a1 1 0 01-1.414-1.414A7 7 0 0115.71 2.29z" /></svg>}
                {loading || firebaseAuth.loading ? 'Đang xác minh...' : 'Xác minh OTP'}
              </button>
            </form>
          )}

          {/* Step 3: Register */}
          {step === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-800 rounded">
                <p className="font-medium flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  Số điện thoại đã xác minh: <strong>{phone}</strong>
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên người dùng</label>
                <input 
                  type="text" 
                  required 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="Nhập tên người dùng"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  minLength={6}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <svg className="animate-spin w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0A7 7 0 0114.707 14.707a1 1 0 01-1.414 1.414A9 9 0 014.293 4.293zM15.71 2.29a1 1 0 011.414 1.414A9 9 0 005.707 16.707a1 1 0 01-1.414-1.414A7 7 0 0115.71 2.29z" /></svg>}
                {loading ? 'Đang đăng ký...' : 'Hoàn tất đăng ký'}
              </button>
            </form>
          )}
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
