import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "../interfaces/User"
import { useLoading } from "./LoaderContext";

interface UserContextType {
    user: User | null;
    isAuth: boolean;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    logout: () => void;
    login: (email: string, password: string) => void;
    register: (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phone: string,
        userType: string,
        zipCode: string,
        city: string,
        address: string,
        position: string,
        hotel: string,
        state: string,
        country: string
    ) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const { showLoader, hideLoader } = useLoading();


    useEffect(() => {
        const fetchUser = async () => {
            showLoader();
            const token = document.cookie.replace(/(?:^|.*;\s*)token\s*=\s*([^;]*).*$|^.*$/, "$1");
            if (token) {
                await fetch("http://localhost:8080/api/auth/authenticate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                })
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error("Not authenticated");
                        }
                        return res.json();
                    })
                    .then((data) => {
                        const user: User = {
                            userId: data.user.userId,
                            email: data.user.email,
                            firstName: data.user.firstName,
                            lastName: data.user.lastName,
                            password: data.user.password,
                            phone: data.user.phone,
                            zipCode: data.user.zipCode,
                            city: data.user.city,
                            address: data.user.address,
                            state: data.user.state,
                            country: data.user.country,
                            position: data.user.position,
                            userType: data.user.userType,
                            hotel: data.user.hotel,
                        };
                        setUser(user);
                        setIsAuth(true);
                    })
                    .catch((error) => {
                        console.error("Error fetching user:", error);
                    })
                    .finally(() => {
                        hideLoader();
                    });
            } else {
                hideLoader();
                console.log("No token found, user is not authenticated.");
            }
        };

        fetchUser();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        showLoader();
        await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => {
                if (!res.ok) {
                    console.error(`HTTP error! status: ${res.status}, statusText: ${res.statusText}`);
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log("Login response:", data);
                if (data.message || data.error) {
                    alert(data.message || data.error);
                    return false;
                }
                setUser(data.user as User);
                setIsAuth(true);

                const expires = new Date();
                expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
                document.cookie = `token=${data.token}; expires=${expires.toUTCString()}; path=/`;
            })
            .catch((error) => {
                console.error("Error during login:", error);
                alert(`An error occurred during login: ${error.message}`);
            })
            .finally(() => {
                hideLoader();
            });
    };

    const logout = () => {
        setUser(null);
        setIsAuth(false);
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        }
        );
    };

    const register = async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phone: string,
        userType: string,
        zipCode: string,
        city: string,
        address: string,
        position: string,
        hotel: string,
        state: string,
        country: string
    ): Promise<User | null> => {
        try {
            showLoader();
            const res = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                    phone,
                    userType,
                    zipCode,
                    city,
                    address,
                    position,
                    hotel,
                    state,
                    country,
                }),
            });

            const data = await res.json();

            if (data.message || data.error) {
                alert(data.message || data.error);
                return null;
            }

            const newUser: User = {
                userId: data.id,
                email: data.email,
                firstName: data.firstname,
                lastName: data.lastname,
                password: data.password,
                phone: data.phone,
                zipCode: data.address_zipcode,
                city: data.address_city,
                address: data.address_number,
                state: data.state,
                country: data.country,
                position: data.position,
                userType: data.role,
                hotel: data.hotel_id,
            };

            setUser(newUser);
            setIsAuth(true);
            localStorage.setItem("user", JSON.stringify(newUser));
            hideLoader();
            return newUser;

        } catch (error) {
            console.error("Error registering user:", error);
            return null;
        }
    };




    return (
        <UserContext.Provider value={{ user, isAuth, setIsAuth, login, logout, register }}>
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
