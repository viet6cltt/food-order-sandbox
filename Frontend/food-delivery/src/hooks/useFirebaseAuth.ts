import { useState, useCallback } from 'react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  type User,
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

// Type for ConfirmationResult - inferred from signInWithPhoneNumber return type
type ConfirmationResult = Awaited<ReturnType<typeof signInWithPhoneNumber>>;

interface UseFirebaseAuthReturn {
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (code: string) => Promise<string>; // Returns ID Token
  getIdToken: () => Promise<string | null>;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  recaptchaVerifier: RecaptchaVerifier | null;
  reset: () => void;
  hasConfirmationResult: boolean; // Thêm để check xem có confirmationResult không
}

/**
 * Hook để xử lý Firebase Phone Authentication
 * 
 * Cách sử dụng:
 * 1. Gọi sendOTP(phoneNumber) để gửi mã OTP
 * 2. Gọi verifyOTP(code) để xác minh mã và lấy ID Token
 * 3. Sử dụng ID Token để đăng ký với backend
 */
export default function useFirebaseAuth(): UseFirebaseAuthReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  // Initialize reCAPTCHA verifier
  const initializeRecaptcha = useCallback(() => {
    if (recaptchaVerifier) {
      return recaptchaVerifier;
    }

    // Tạo reCAPTCHA verifier
    // Container ID sẽ được tạo tự động nếu không có
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible', // hoặc 'normal' để hiển thị checkbox
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        setError('reCAPTCHA đã hết hạn. Vui lòng thử lại.');
      }
    });

    setRecaptchaVerifier(verifier);
    return verifier;
  }, [recaptchaVerifier]);

  // Gửi mã OTP đến số điện thoại
  const sendOTP = useCallback(async (phoneNumber: string) => {
    setLoading(true);
    setError(null);

    try {
      // Đảm bảo số điện thoại có format đúng (ví dụ: +84912345678)
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+84${phoneNumber.replace(/^0/, '')}`;

      const verifier = initializeRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      
      setConfirmationResult(confirmation);
      setLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể gửi mã OTP. Vui lòng thử lại.';
      setError(errorMessage);
      setLoading(false);
      
      // Cleanup recaptcha on error
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch {
          // Ignore cleanup errors
        }
        setRecaptchaVerifier(null);
      }
      
      throw err;
    }
  }, [initializeRecaptcha, recaptchaVerifier]);

  // Xác minh mã OTP và lấy ID Token
  const verifyOTP = useCallback(async (code: string): Promise<string> => {
    if (!confirmationResult) {
      throw new Error('Chưa gửi mã OTP. Vui lòng gửi mã OTP trước.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      setCurrentUser(user);

      // Lấy ID Token
      const idToken = await user.getIdToken();
      setLoading(false);
      
      return idToken;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Mã OTP không đúng. Vui lòng thử lại.';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [confirmationResult]);

  // Lấy ID Token của user hiện tại
  const getIdToken = useCallback(async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    try {
      return await user.getIdToken();
    } catch {
      return null;
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setError(null);
    setConfirmationResult(null);
    setCurrentUser(null);
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch {
        // Ignore cleanup errors
      }
      setRecaptchaVerifier(null);
    }
  }, [recaptchaVerifier]);

  return {
    sendOTP,
    verifyOTP,
    getIdToken,
    currentUser,
    loading,
    error,
    recaptchaVerifier,
    reset,
    hasConfirmationResult: !!confirmationResult,
  };
}

