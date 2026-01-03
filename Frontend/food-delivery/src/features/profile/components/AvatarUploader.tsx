import React, { useEffect, useRef, useState } from 'react';

type AvatarUploaderProps = {
  avatarUrl?: string;
  disabled?: boolean;
  uploading?: boolean;
  onFileSelected: (file: File) => void | Promise<void>;
};

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  avatarUrl,
  disabled = false,
  uploading = false,
  onFileSelected,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const displayUrl = localPreview || avatarUrl || '';

  const pickFile = () => {
    if (disabled || uploading) return;
    inputRef.current?.click();
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    try {
      await onFileSelected(file);
      setLocalPreview(null);
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
        {displayUrl ? (
          <img src={displayUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500 font-bold">A</span>
        )}
      </div>

      <div className="flex-1">
        <button
          type="button"
          onClick={pickFile}
          disabled={disabled || uploading}
          className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition disabled:opacity-60"
        >
          {uploading ? 'Đang upload...' : 'Chọn ảnh'}
        </button>
        <p className="text-xs text-gray-500 mt-2">Chọn 1 ảnh (JPG/PNG/GIF).</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default AvatarUploader;
