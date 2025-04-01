import React, { useState } from 'react';
import Header from '../components/Header';

export default function AddUser() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const validate = () => {
        const newErrors = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        };
        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email must be a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.values(validationErrors).every((error) => error === '')) {
            console.log('Form submitted:', formData);

            const handleUserAdd = async () => {
                try {
                    const response = await fetch('http://localhost:8080/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    console.log('User added:', data);

                    const submitButton = document.getElementById('submitButton') as HTMLButtonElement;
                    if (submitButton) {
                        submitButton.classList.remove('bg-blue-600');
                        submitButton.classList.add('bg-green-600', 'transition', 'duration-300', 'ease-in-out');
                        submitButton.innerText = 'User Added!';

                        setTimeout(() => {
                            submitButton.classList.remove('bg-green-600');
                            submitButton.classList.add('bg-blue-600');
                            submitButton.innerText = 'Add User';
                        }, 2000);
                    }
                } catch (error) {
                    console.error('Error adding user:', error);
                }
            }

            handleUserAdd();

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            });
            setErrors({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            });


        }
    };

    const getInputClass = (field: keyof typeof formData) => {
        if (errors[field]) {
            return 'border-red-500 focus:border-red-500 focus:ring-red-500';
        }
        if (formData[field]) {
            return 'border-green-500 focus:border-green-500 focus:ring-green-500';
        }
        return 'border-gray-400 focus:border-indigo-500 focus:ring-indigo-500';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header isGradient={false} bg_color="white" textColor='black' />
            <div className="container mt-20 mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Add User</h1>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg p-6 space-y-4"
                >
                    {(['firstName', 'lastName', 'email', 'password'] as Array<keyof typeof formData>).map((field) => (
                        <div key={field}>
                            <label
                                htmlFor={field}
                                className="block text-sm font-medium text-gray-700"
                            >
                                {field.replace(/([A-Z])/g, ' $1').replace(/\b\w/g, (c) => c.toUpperCase())}
                            </label>
                            <input
                                type={field === 'password' ? 'password' : 'text'}
                                id={field}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${getInputClass(field)}`}
                            />
                            {errors[field] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                            )}
                        </div>
                    ))}
                    <div className="flex justify-center mt-6">
                        <button
                            id="submitButton"
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-6 rounded-md text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        >
                            Add User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
