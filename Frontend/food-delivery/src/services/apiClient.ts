import axios from 'axios';

const api = axios.create({ 
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', 
    timeout: 15000 
});

api.interceptors.request.use (
    cfg => { 
        const t = localStorage.getItem('token'); 
        if (t) cfg.headers!['Authorization'] = `Bearer ${t}`; 
        return cfg; 
    }
);

api.interceptors.response.use (
    res => res, err => { 
        if (err.response?.status === 401) { 
            localStorage.removeItem('token');   
            window.location.href = '/login'; 
        } 

        return Promise.reject(err);
    }
);

export default api;