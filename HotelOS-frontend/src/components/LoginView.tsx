import React, { useEffect, useState } from 'react';
import { useUser } from "../contexts/UserContext.tsx";
import { useNavigate } from "react-router-dom";

export default function LoginView() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const navigate = useNavigate();
    const { login, isAuth } = useUser();

    useEffect(() => {
        if (isAuth) {
            navigate('/');
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
            console.log('Email:', email);
            console.log('Password:', password);
            login(email, password);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center">
                <div className="text-center mb-12 text-4xl font-bold">
                    Welcome to HotelOS. Please log in
                </div>
                <form className="flex flex-col w-80 p-6 bg-white rounded-lg shadow-md"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`p-2 mb-4 border-2 rounded ${emailValid ? 'border-green-500' : 'border-red-500'
                            }`}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        className={`p-2 mb-4 border-2 rounded ${passwordValid ? 'border-green-500' : 'border-red-500'
                            }`}
                    />
                    <button
                        type="submit"
                        className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 font-bold cursor-pointer"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};