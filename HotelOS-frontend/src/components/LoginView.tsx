import React, { useEffect, useState } from 'react';
import { useUser } from "../contexts/UserContext.tsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LoginView() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const navigate = useNavigate();
    const { login, isAuth, error } = useUser();

    useEffect(() => {
        if (isAuth) {
            navigate('/');
            console.log("token", document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));
        }
    }, [isAuth, navigate]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{6,}$/;

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setEmailValid(emailRegex.test(value));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordValid(passwordRegex.test(value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailValid && passwordValid) {
            login(email, password);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center">
                <div className="text-center mb-12 text-4xl font-bold">
                    {t("auth.welcomeMessage", "Welcome to HotelOS. Please log in")}
                </div>
                <form className="flex flex-col w-80 p-6 bg-white rounded-lg shadow-md"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="email"
                        placeholder={t("auth.email", "Email")}
                        value={email}
                        onChange={handleEmailChange}
                        className={`p-2 mb-4 border-2 rounded ${emailValid ? 'border-green-500' : 'border-red-500'
                            }`}
                    />
                    {!emailValid && <p className="text-red-500 text-sm mb-2">{t("auth.validationErrors.email", "Please enter a valid email address")}</p>}

                    <input
                        type="password"
                        placeholder={t("auth.password", "Password")}
                        value={password}
                        onChange={handlePasswordChange}
                        className={`p-2 mb-4 border-2 rounded ${passwordValid ? 'border-green-500' : 'border-red-500'
                            }`}
                    />
                    {!passwordValid && <p className="text-red-500 text-sm mb-2">{t("auth.validationErrors.password", "Password must be at least 6 characters")}</p>}

                    <button
                        type="submit"
                        className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 font-bold cursor-pointer"
                    >
                        {t("auth.login", "Login")}
                    </button>
                    <p className="text-center text-sm mt-2">
                        {t("auth.forgotPassword", "Forgot your password?")} <a href="/reset-password" className="text-blue-500 hover:underline">{t("auth.resetPassword", "Reset Password")}</a>
                    </p>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
};