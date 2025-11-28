// import axios from 'axios';

// const api = axios.create({ 
//     baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', 
//     timeout: 15000 
// });

// api.interceptors.request.use (
//     cfg => { 
//         const t = localStorage.getItem('token'); 
//         if (t) cfg.headers!['Authorization'] = `Bearer ${t}`; 
//         return cfg; 
//     }
// );

// api.interceptors.response.use (
//     res => res, err => { 
//         if (err.response?.status === 401) { 
//             localStorage.removeItem('token'); 
//             window.location.href = '/login'; 
//         } 

//         return Promise.reject(err);
//     }
// );

// export default api;

// src/services/apiClient.ts

// Loại bỏ hoàn toàn import axios và logic interceptors

const api = {
    // Hàm GET: Trả về dữ liệu rỗng an toàn 
    get: async <T>(url: string): Promise<{ data: T }> => {
        console.log(`[MOCK API] GET request to: ${url}`);
        await new Promise(resolve => setTimeout(resolve, 50));
        return { data: [] as unknown as T };
    },

    // Hàm POST: Trả về đối tượng rỗng an toàn
    post: async <T>(url: string, data: any): Promise<{ data: T }> => {
        console.log(`[MOCK API] POST request to: ${url}`, data);
        await new Promise(resolve => setTimeout(resolve, 50));
        return { data: {} as unknown as T };
    },

    put: async <T>(url: string, data: any): Promise<{ data: T }> => {
        return { data: {} as unknown as T };
    },

    delete: async <T>(url: string): Promise<{ data: T }> => {
        return { data: {} as unknown as T };
    },
};

// CHÚ Ý: Dùng NAMED EXPORT để giải quyết triệt để lỗi "api.get is not a function"
export default api;