import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../../layouts/AuthLayout';
import useAuth from '../../../hooks/useAuth';

const OAuthSuccessScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  const accessToken = useMemo(() => searchParams.get('accessToken') || '', [searchParams]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        if (!accessToken) {
          setError('Thiếu accessToken từ OAuth. Vui lòng đăng nhập lại.');
          return;
        }

        localStorage.setItem('accessToken', accessToken);
        await refreshUser();
        navigate('/redirect');
      } catch {
        setError('Không thể hoàn tất đăng nhập. Vui lòng thử lại.');
      }
    };

    run();
  }, [accessToken, navigate, refreshUser]);

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          {error ? (
            <>
              <h1 className="text-xl font-bold text-gray-800 mb-2">Đăng nhập thất bại</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                onClick={() => navigate('/auth/login')}
              >
                Về trang đăng nhập
              </button>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-800 mb-2">Đang đăng nhập...</h1>
              <p className="text-gray-600">Vui lòng chờ trong giây lát.</p>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default OAuthSuccessScreen;
