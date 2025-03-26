import React, { useState } from 'react';
import AdminHeader from '../components/Adminpage/AdminHeader';

const AddUser: React.FC = () => {
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
        } else if (formData.password.length < 4) {
            newErrors.password = 'Password must be at least 4 characters long';
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
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            });
            console.log('Form submitted:', formData);
            // Add logic to send data to the backend
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
            <AdminHeader />
            <div className="container mx-auto p-6">
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
                            type="submit"
                            className="bg-indigo-600 text-white py-2 px-6 rounded-md text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Add User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
