import { useCallback, useMemo } from 'react';
import { apiClients, getToken } from './apiConfig';

/**
 * Custom hook for accessing API clients with authentication status
 */
export const useApi = () => {
    const isAuthenticated = useMemo(() => {
        const token = getToken();
        return !!token && token.length > 0;
    }, []);

    const refreshAuth = useCallback(() => {
        // Force re-evaluation of auth status
        window.location.reload(); // Simple approach, you might want to implement a more sophisticated refresh
    }, []);

    return {
        // API clients
        ...apiClients,
        
        // Authentication utilities
        isAuthenticated,
        refreshAuth,
        getToken,
        
        // Individual clients (for explicit usage)
        clients: apiClients
    };
};

export default useApi;
