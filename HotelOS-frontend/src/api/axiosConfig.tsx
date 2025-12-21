import axios from 'axios';

const baseURL = 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true, // Important for cookies (JWT)
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
    (config) => {
        // You'll add CSRF token handling here later
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (authentication issues)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Add refresh token logic here if needed
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Redirect to login or handle session expiration
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;