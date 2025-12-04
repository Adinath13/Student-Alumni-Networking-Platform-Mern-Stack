import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    withCredentials: true,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🌐 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
});

instance.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, response.status);
        return response;
    },
    (error) => {
        console.error('❌ API Error:');
        console.error('   URL:', error.config?.url);
        console.error('   Method:', error.config?.method);
        console.error('   Status:', error.response?.status);
        console.error('   Message:', error.response?.data?.message || error.message);
        console.error('   Full Error:', error);

        if (error.response?.status === 401) {
            console.log('🔒 Unauthorized - clearing token');
            localStorage.removeItem('token');
        }

        return Promise.reject(error);
    }
);

export default instance;
