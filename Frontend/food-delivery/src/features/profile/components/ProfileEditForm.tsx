import React, { useState, useEffect } from 'react';
import { updateMe, type UpdateUserPayload } from '../api';
import { type UserProfile } from '../../../types/user';

interface ProfileEditFormProps {
  user: UserProfile;
  className?: string;
  onSuccess?: (updatedUser: UserProfile) => void;
  onCancel?: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  className = '',
  onSuccess,
  onCancel,
}) => {
  const [firstname, setFirstname] = useState(user.firstname || '');
  const [lastname, setLastname] = useState(user.lastname || '');
  const [email, setEmail] = useState(user.email || '');
  const [dateOfBirth, setDateOfBirth] = useState(
    user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
  );
  const [street, setStreet] = useState(user.address?.street || '');
  const [city, setCity] = useState(user.address?.city || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFirstname(user.firstname || '');
    setLastname(user.lastname || '');
    setEmail(user.email || '');
    setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '');
    setStreet(user.address?.street || '');
    setCity(user.address?.city || '');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      const payload: UpdateUserPayload = {
        firstname: firstname.trim() || undefined,
        lastname: lastname.trim() || undefined,
        email: email.trim() || undefined,
        dateOfBirth: dateOfBirth || undefined,
        address: {
          street: street.trim() || undefined,
          city: city.trim() || undefined,
        },
      };

      // Remove undefined fields
      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof UpdateUserPayload] === undefined) {
          delete payload[key as keyof UpdateUserPayload];
        }
      });

      if (payload.address) {
        Object.keys(payload.address).forEach((key) => {
          if (payload.address![key as keyof typeof payload.address] === undefined) {
            delete payload.address![key as keyof typeof payload.address];
          }
        });
        if (Object.keys(payload.address).length === 0) {
          delete payload.address;
        }
      }

      const updatedUser = await updateMe(payload);

      // Map to UserProfile format
      const fullName = updatedUser.firstname || updatedUser.lastname
        ? `${updatedUser.firstname || ''} ${updatedUser.lastname || ''}`.trim()
        : updatedUser.username;

      const profile: UserProfile = {
        ...updatedUser,
        fullName,
      };

      setSuccess(true);

      // Call callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(profile);
        }, 1000);
      }
    } catch (err: unknown) {
      let errorMessage = 'Không thể cập nhật thông tin. Vui lòng thử lại.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: string } } };
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chỉnh sửa thông tin</h2>
        <p className="text-gray-600 text-sm">Cập nhật thông tin cá nhân của bạn</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                />
              </svg>
              <span>Thông tin đã được cập nhật thành công!</span>
            </div>
          </div>
        )}

        {/* First Name */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Họ</label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="Nhập họ"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition placeholder:text-gray-400 placeholder:opacity-70"
          />
        </div>

        {/* Last Name */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tên</label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Nhập tên"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition placeholder:text-gray-400 placeholder:opacity-70"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email (tùy chọn)"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition placeholder:text-gray-400 placeholder:opacity-70"
          />
        </div>

        {/* Date of Birth */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày sinh</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition placeholder:text-gray-400 placeholder:opacity-70"
          />
        </div>

        {/* Address Street */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Số nhà, tên đường"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition mb-2 placeholder:text-gray-400 placeholder:opacity-70"
          />
        </div>

        {/* Address City */}
        <div className="mb-8">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Thành phố/Tỉnh"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition placeholder:text-gray-400 placeholder:opacity-70"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0A7 7 0 0114.707 14.707a1 1 0 01-1.414 1.414A9 9 0 014.293 4.293zM15.71 2.29a1 1 0 011.414 1.414A9 9 0 005.707 16.707a1 1 0 01-1.414-1.414A7 7 0 0115.71 2.29z"
                />
              </svg>
            )}
            {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;

