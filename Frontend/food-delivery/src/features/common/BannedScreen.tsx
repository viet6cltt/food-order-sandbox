import React from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';

const BannedScreen: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <LockClosedIcon className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Tài khoản bị khóa</h1>
        <p className="text-gray-600 mb-8">
          Tài khoản của quý khách đã bị khóa do vi phạm tiêu chuẩn cộng đồng hoặc theo yêu cầu của quản trị viên.
        </p>
        <button
          onClick={() => logout()} // Đăng xuất để xóa token cũ
          className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
        >
          Quay lại trang đăng nhập
        </button>
      </div>
    </div>
  );
};

export default BannedScreen;