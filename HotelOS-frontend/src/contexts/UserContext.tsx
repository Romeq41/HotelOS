import { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction, useCallback } from "react";
import { LoginRequest, RegisterRequest, User as ApiUser } from "../api/generated/api";
import useApi from "../api/useApi";
import { User, UserDto } from "../interfaces/User";
import { useLoading } from "./LoaderContext";

interface UserContextType {
    user: UserDto | null;
    isAuth: boolean;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: Dispatch<SetStateAction<UserDto | null>>;
    isAuthDone: boolean;
    setIsAuthDone: React.Dispatch<React.SetStateAction<boolean>>;
    logout: () => void;
    login: (email: string, password: string) => Promise<void>;
    register: (payload: RegisterRequest) => Promise<UserDto | null>;
    fetchUser: () => Promise<void>;
    error: any;
    clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { auth: authApi, getToken } = useApi();
    const [user, setUser] = useState<UserDto | null>(null);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const { showLoader, hideLoader } = useLoading();
    const [error, setError] = useState<string | null>(null);
    const [isAuthDone, setIsAuthDone] = useState<boolean>(false);

    const fetchUser = useCallback(async () => {
        showLoader();
        setIsAuthDone(false);
        const token = getToken();
        if (token) {
            try {
                const { data } = await authApi.authenticate({ token });
                if (data && (data as any).user) {
                    const authUser = (data as any).user as UserDto;
                    setUser(authUser);
                    setIsAuth(true);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Authentication failed");
            } finally {
                setIsAuthDone(true);
                hideLoader();
            }
        } else {
            setIsAuthDone(true);
            hideLoader();
        }
    }, [authApi, getToken]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (email: string, password: string): Promise<void> => {
        showLoader();
        setIsAuthDone(false);
        setError(null);
        const payload: LoginRequest = { email, password };
        try {
            const { data } = await authApi.login(payload);
            if (!data || (data as any).error) {
                setError("Login failed. Please check your credentials.");
                setIsAuthDone(true);
                return;
            }

            const authData: any = data;
            const mappedUser: UserDto | null = authData.user ? (authData.user as UserDto) : null;

            if (authData.token) {
                const expires = new Date();
                expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
                document.cookie = `token=${authData.token}; expires=${expires.toUTCString()}; path=/`;
            }

            if (mappedUser) {
                setUser(mappedUser);
                setIsAuth(true);
            }

            setIsAuthDone(true);
        } catch (err) {
            console.error("Error logging in:", err);
            setError("Login failed. Please check your credentials.");
        } finally {
            hideLoader();
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuth(false);
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        }
        );
    };

    const register = async (payload: RegisterRequest): Promise<UserDto | null> => {
        try {
            showLoader();
            setIsAuthDone(false);
            setError(null);

            const { data } = await authApi.register(payload);

            if (!data || (data as any).error) {
                setError("Registration failed. Please check your details.");
                return null;
            }

            const authData: any = data;
            const registeredUser: UserDto | null = authData.user ? (authData.user as UserDto) : null;

            if (authData.token) {
                const expires = new Date();
                expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
                document.cookie = `token=${authData.token}; expires=${expires.toUTCString()}; path=/`;
            }

            if (registeredUser) {
                setUser(registeredUser);
                setIsAuth(true);
            }

            return registeredUser;
        } catch (error) {
            console.error("Error registering user:", error);
            setError("Registration failed. Please try again.");
            return null;
        } finally {
            setIsAuthDone(true);
            hideLoader();
        }
    };




    return (
        <UserContext.Provider value={{
            user,
            isAuth,
            setIsAuth,
            setUser,
            login,
            logout,
            register,
            fetchUser,
            error,
            clearError: () => setError(null),
            isAuthDone,
            setIsAuthDone
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
