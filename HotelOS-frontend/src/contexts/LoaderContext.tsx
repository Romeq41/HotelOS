import { createContext, useContext, useState, ReactNode } from 'react';
import { Spinner, } from '../components/Loader';

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    showLoader: () => void;
    hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
    children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading, showLoader, hideLoader }}>
            {isLoading && <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <Spinner />
            </div>}
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};