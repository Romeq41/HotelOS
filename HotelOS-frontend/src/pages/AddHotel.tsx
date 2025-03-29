import React, { useState } from 'react';
import AdminHeader from '../components/Adminpage/AdminHeader';

export default function AddHotel() {
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
        } else if (!/^\d{2}-\d{3}$/.test(formData.zipCode)) {
            newErrors.zipCode = 'Zip code must be a valid format (e.g., 87-148)';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.values(validationErrors).every((error) => error === '')) {
            console.log('Form submitted:', formData);



            try {
                console.log('Sending request to server...');
                console.log(`Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`);
                console.log('Form data:', formData);
                // Send form data to the server
                const response = await fetch('http://localhost:8080/api/hotels', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                    body: JSON.stringify(formData),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                if (response.status === 200) {
                    const data = await response.json();
                    console.log('Hotel added:', data);

                    setFormData({
                        name: '',
                        address: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: '',
                    });

                    const submitButton = document.getElementById('submitButton') as HTMLButtonElement;
                    if (submitButton) {
                        submitButton.classList.remove('bg-blue-600');
                        submitButton.classList.add('bg-green-600', 'transition', 'duration-300', 'ease-in-out');
                        submitButton.innerText = 'Hotel Added!';

                        setTimeout(() => {
                            submitButton.classList.remove('bg-green-600');
                            submitButton.classList.add('bg-blue-600');
                            submitButton.innerText = 'Add Hotel';
                        }, 2000);
                    }

                }

            } catch (error) {
                console.error('Error adding Hotel:', error);
            }
        };
    }

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
                            id="submitButton"
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-6 rounded-md text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        >
                            Add Hotel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
