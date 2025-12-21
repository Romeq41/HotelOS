import { Configuration } from './generated/configuration';

// Centralized API configuration using your existing env variables
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_LOGGING = import.meta.env.VITE_API_LOGGING === 'true';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');

// Helper function to get auth token from cookies
const getAuthToken = (): string => {
    return document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
};

// Enhanced configuration with interceptors and logging
const createApiConfiguration = (): Configuration => {
    const config = new Configuration({
        basePath: API_BASE_URL,
        accessToken: getAuthToken,
        baseOptions: {
            // Global request timeout from environment variable
            timeout: API_TIMEOUT,
            // Add any global headers here
            headers: {
                'Accept': 'application/json',
            }
        }
    });

    if (API_LOGGING) {
        console.log('API Configuration initialized:', {
            baseURL: API_BASE_URL,
            timeout: API_TIMEOUT,
            hasToken: !!getAuthToken()
        });
    }

    return config;
};

// Shared configuration for all generated API clients
export const apiConfiguration = createApiConfiguration();

// Export base URL for direct fetch calls if needed
export const API_BASE_PATH = API_BASE_URL;

// Export auth token getter for manual use
export const getToken = getAuthToken;

// Optional: Create pre-configured API instances
import {
    HotelManagementApi,
    UserControllerApi,
    AuthenticationControllerApi,
    ReservationControllerApi,
    RoomManagementApi,
    AmenityControllerApi,
    RoomTypesApi
} from './generated/api';

// Pre-configured API instances ready to use
export const hotelApi = new HotelManagementApi(apiConfiguration);
export const userApi = new UserControllerApi(apiConfiguration);
export const authApi = new AuthenticationControllerApi(apiConfiguration);
export const reservationApi = new ReservationControllerApi(apiConfiguration);
export const roomApi = new RoomManagementApi(apiConfiguration);
export const amenityApi = new AmenityControllerApi(apiConfiguration);
export const roomTypesApi = new RoomTypesApi(apiConfiguration);

// Export all for convenience
export const apiClients = {
    hotel: hotelApi,
    user: userApi,
    auth: authApi,
    reservation: reservationApi,
    room: roomApi,
    amenity: amenityApi,
    roomTypes: roomTypesApi
};
