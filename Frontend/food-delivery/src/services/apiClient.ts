import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
  withCredentials: true,
});

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (err: Error) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (config.headers) {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        // accessToken null → vẫn gửi request, interceptor response sẽ xử lý
        delete config.headers['Authorization'];
      }
    }

    if (config.method?.toLowerCase() === 'get' && config.headers) {
      config.headers['Cache-Control'] = 'no-cache';
      config.headers['Pragma'] = 'no-cache';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (err: unknown) => {
    if (!axios.isAxiosError(err) || !err.config) {
      // Không phải AxiosError → reject thẳng
      return Promise.reject(err);
    }

    const error = err;
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    
    // nếu 403, refreshToken hết hạn — remove token and emit logout event
    if (status === 403) {
      console.error('403 Forbidden: Access denied or invalid session.');
      localStorage.removeItem('accessToken');
      try {
        window.dispatchEvent(new Event('auth:logout'));
      } catch (e) {
        // ignore
      }
      return Promise.reject(error);
    }

    // Nếu 401 → thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh')) {
        // Nếu refresh token cũng fail → logout
        localStorage.removeItem('accessToken');
        isRefreshing = false;
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Nếu đang refresh → đẩy request vào queue
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data?.data?.accessToken;
        if (!newAccessToken) throw new Error('No access token returned');

        localStorage.setItem('accessToken', newAccessToken);

        // Update header mặc định cho các request mới
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        // Giải quyết queue
        processQueue(null, newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr: unknown) {
        // Refresh thất bại → reject queue requests
        processQueue(
          refreshErr instanceof Error ? refreshErr : new Error(String(refreshErr)),
          null
        );

        // Remove token and logout immediately
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isLoggedIn');
        isRefreshing = false;

        try {
          window.dispatchEvent(new Event('auth:logout'));
        } catch (e) { /* ignore */ }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Các lỗi khác reject thẳng
    return Promise.reject(error);
  }
);

export default api;
