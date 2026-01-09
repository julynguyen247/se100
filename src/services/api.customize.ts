import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        const token = localStorage.getItem('access_token');
        const auth = token ? `Bearer ${token}` : '';
        config.headers['Authorization'] = auth;
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        if (response && response?.data) return response.data;
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger

        // Handle 401 Unauthorized - token expired or invalid
        if (error?.response?.status === 401) {
            // Clear all localStorage data
            localStorage.clear();

            // Redirect to login page if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        // Return error data if available, otherwise reject
        if (error && error.response && error.response.data) {
            return error.response.data;
        }
        return Promise.reject(error);
    }
);
export default instance;
