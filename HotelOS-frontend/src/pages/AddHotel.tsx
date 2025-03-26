import React, { useState } from 'react';
import AdminHeader from '../components/Adminpage/AdminHeader';

const AddHotel: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });

    const validate = () => {
        const newErrors: any = {};
        if (!formData.name) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Name must be at least 3 characters long';
        }

        if (!formData.address) {
            newErrors.address = 'Address is required';
        }

        if (!formData.city) {
            newErrors.city = 'City is required';
        }

        if (!formData.state) {
            newErrors.state = 'State is required';
        }

        if (!formData.zipCode) {
            newErrors.zipCode = 'Zip code is required';
        } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
            newErrors.zipCode = 'Zip code must be a valid format (e.g., 12345 or 12345-6789)';
        }

        if (!formData.country) {
            newErrors.country = 'Country is required';
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
                name: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
            });
            console.log('Form submitted:', formData);
            //todo: BACKEND CALL
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
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Hotel</h1>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg p-6 space-y-4"
                >
                    {(['name', 'address', 'city', 'state', 'zipCode', 'country'] as Array<keyof typeof formData>).map((field) => (
                        <div key={field}>
                            <label
                                htmlFor={field}
                                className="block text-sm font-medium text-gray-700"
                            >
                                {field.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                            </label>
                            <input
                                type="text"
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
                            Add Hotel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHotel;
