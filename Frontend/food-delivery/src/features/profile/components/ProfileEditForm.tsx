import React, { useState, useEffect } from 'react';
import { updateMe, type UpdateUserPayload } from '../api';
import { type UserProfile } from '../../../types/user';
import { toast } from 'react-toastify';

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
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || '');
  const [street, setStreet] = useState(user.address?.street || '');
  const [city, setCity] = useState(user.address?.city || '')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFirstname(user.firstname || '');
    setLastname(user.lastname || '');
    setEmail(user.email || '');
    setDateOfBirth(user.dateOfBirth || '');
    setStreet(user.address?.street || '');
    setCity(user.address?.city || '');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation cơ bản
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      // Xây dựng payload sạch
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

      // Gọi API update
      const updatedUser = await updateMe(payload);

      // Tính toán fullName mới từ dữ liệu server trả về
      const newFullName = updatedUser.firstname || updatedUser.lastname
        ? `${updatedUser.firstname || ''} ${updatedUser.lastname || ''}`.trim()
        : updatedUser.username;

      const profile: UserProfile = {
        ...updatedUser,
        fullName: newFullName,
      };

      setSuccess(true);

      if (onSuccess) {
        toast.success('Cập nhật hồ sơ thành công');
        setTimeout(() => {
          onSuccess(profile);
        }, 800);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Không thể cập nhật thông tin');
      } else {
        setError('Không thể cập nhật thông tin');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 ${className}`}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h2>
          <p className="text-gray-500 text-sm mt-1">Thông tin này sẽ được hiển thị trên các đơn hàng của bạn.</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Alerts */}
        {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 animate-shake">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100">Cập nhật thành công!</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Họ (Firstname)" value={firstname} onChange={setFirstname} placeholder="Vd: Văn" />
          <InputGroup label="Tên (Lastname)" value={lastname} onChange={setLastname} placeholder="Vd: Việt" />
        </div>

        <InputGroup label="Email" type="email" value={email} onChange={setEmail} placeholder="phanvanviet@example.com" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Ngày sinh" type="date" value={dateOfBirth} onChange={setDateOfBirth} />
          <div className="flex flex-col justify-end">
             <p className="text-[10px] text-gray-400 italic mb-2">* Ngày sinh giúp chúng tôi gửi ưu đãi sinh nhật.</p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-50">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Địa chỉ giao hàng mặc định</h3>
          <InputGroup label="Số nhà, tên đường" value={street} onChange={setStreet} placeholder="Vd: 123 Nguyễn Huệ" />
          <InputGroup label="Thành phố / Tỉnh" value={city} onChange={setCity} placeholder="Vd: Hà Nội" />
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-6 py-3.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-green-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Sub-component cho Input để code sạch hơn
const InputGroup = ({ label, value, onChange, type = "text", placeholder = "" } : {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-gray-900 font-medium"
    />
  </div>
);

export default ProfileEditForm;