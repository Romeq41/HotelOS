import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RegisterRequest } from "../api/generated/api";

export default function RegisterView() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { register, isAuth, error, clearError } = useUser();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);

    useEffect(() => {
        if (isAuth) {
            navigate("/");
        }
    }, [isAuth, navigate]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{6,}$/;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        const isEmailOk = emailRegex.test(email);
        const isPasswordOk = passwordRegex.test(password);
        const isFirstOk = firstName.trim().length > 0;
        const isLastOk = lastName.trim().length > 0;

        setEmailValid(isEmailOk);
        setPasswordValid(isPasswordOk);
        setFirstNameValid(isFirstOk);
        setLastNameValid(isLastOk);

        if (!isEmailOk || !isPasswordOk || !isFirstOk || !isLastOk) {
            return;
        }

        const payload: RegisterRequest = {
            email,
            password,
            firstName,
            lastName,
        };

        const newUser = await register(payload);
        if (newUser) {
            navigate("/");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center">
                <div className="text-center mb-12 text-4xl font-bold">
                    {t("auth.registerTitle", "Create your HotelOS account")}
                </div>
                <form className="flex flex-col w-96 p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <input
                                type="text"
                                placeholder={t("auth.firstName", "First name")}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={`p-2 w-full border-2 rounded ${firstNameValid ? "border-green-500" : "border-red-500"}`}
                            />
                            {!firstNameValid && (
                                <p className="text-red-500 text-sm mt-1">{t("auth.validationErrors.firstName", "First name is required")}</p>
                            )}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder={t("auth.lastName", "Last name")}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={`p-2 w-full border-2 rounded ${lastNameValid ? "border-green-500" : "border-red-500"}`}
                            />
                            {!lastNameValid && (
                                <p className="text-red-500 text-sm mt-1">{t("auth.validationErrors.lastName", "Last name is required")}</p>
                            )}
                        </div>
                    </div>

                    <input
                        type="email"
                        placeholder={t("auth.email", "Email")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`p-2 mb-2 border-2 rounded ${emailValid ? "border-green-500" : "border-red-500"}`}
                    />
                    {!emailValid && (
                        <p className="text-red-500 text-sm mb-2">{t("auth.validationErrors.email", "Please enter a valid email address")}</p>
                    )}

                    <input
                        type="password"
                        placeholder={t("auth.password", "Password")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`p-2 mb-2 border-2 rounded ${passwordValid ? "border-green-500" : "border-red-500"}`}
                    />
                    {!passwordValid && (
                        <p className="text-red-500 text-sm mb-2">{t("auth.validationErrors.password", "Password must be at least 6 characters")}</p>
                    )}

                    <button
                        type="submit"
                        className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 font-bold cursor-pointer"
                    >
                        {t("auth.register", "Register")}
                    </button>

                    <p className="text-center text-sm mt-2">
                        {t("auth.haveAccount", "Already have an account?")} <Link to="/login" className="text-blue-500 hover:underline">{t("auth.login", "Login")}</Link>
                    </p>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
}
