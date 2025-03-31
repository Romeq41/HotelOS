import React, { useState } from 'react';
import AdminHeader from '../components/Adminpage/AdminHeader';
import { useParams } from 'react-router-dom';

interface RoomDTO {
    hotelId: string;
    roomNumber: string;
    type: string;
    capacity: string;
    rate: string;
    status: string;
    imagePath?: string; // Add imagePath field
}

export default function AddRoom() {
    const { id } = useParams();
    const [formData, setFormData] = useState<RoomDTO>({
        hotelId: id || '',
        roomNumber: '',
        type: '',
        capacity: '',
        rate: '',
        status: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof RoomDTO, string>>>({});
    const [imageFile, setImageFile] = useState<File | null>(null); // Store the selected image file
    const [imageUploadMessage, setImageUploadMessage] = useState<string | null>(null);

    const validate = () => {
        const newErrors: Partial<Record<keyof RoomDTO, string>> = {};

        if (!formData.hotelId) {
            newErrors.hotelId = 'Hotel ID is required';
        }

        if (!formData.roomNumber) {
            newErrors.roomNumber = 'Room Number is required';
        }

        if (!formData.type) {
            newErrors.type = 'Type is required';
        }

        if (!formData.capacity) {
            newErrors.capacity = 'Capacity is required';
        } else if (isNaN(Number(formData.capacity))) {
            newErrors.capacity = 'Capacity must be a number';
        }

        if (!formData.rate) {
            newErrors.rate = 'Rate is required';
        } else if (isNaN(Number(formData.rate))) {
            newErrors.rate = 'Rate must be a number';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]); // Store the selected image file
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.values(validationErrors).every((error) => !error)) {
            console.log('Form submitted:', formData);

            try {
                // Step 1: Submit room details
                const response = await fetch('http://localhost:8080/api/rooms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Failed to create room');
                }

                const data = await response.json();
                console.log('Room added:', data);

                // Step 2: Upload image if a file is selected
                if (imageFile) {
                    const imageFormData = new FormData();
                    imageFormData.append('file', imageFile);

                    console.log('Uploading image:', imageFile);
                    console.log('Image form data:', imageFormData);
                    console.log('Room ID:', data.roomId);

                    const imageResponse = await fetch(`http://localhost:8080/api/rooms/${data.roomId}/image_upload`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                        },
                        body: imageFormData,
                    });

                    if (!imageResponse.ok) {
                        const errorText = await imageResponse.text();
                        console.error('Image upload error:', errorText);
                        setImageUploadMessage('Failed to upload image.');
                        throw new Error('Failed to upload image');
                    }

                    const imageUploadResult = await imageResponse.text();
                    console.log('Image uploaded:', imageUploadResult);
                    setImageUploadMessage('Image uploaded successfully!');
                }

                // Reset form after successful submission
                setFormData({
                    hotelId: id || '',
                    roomNumber: '',
                    type: '',
                    capacity: '',
                    rate: '',
                    status: '',
                });
                setImageFile(null); // Clear the selected image file
                setErrors({});
            } catch (error) {
                console.error('Error submitting form:', error);
                setImageUploadMessage('Failed to upload image.');
            }
        }
    };

    const getInputClass = (field: keyof RoomDTO) => {
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
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Room</h1>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg p-6 space-y-4"
                >
                    {(['roomNumber', 'type', 'capacity', 'rate', 'status'] as Array<keyof RoomDTO>).map((field) => (
                        <div key={field}>
                            <label
                                htmlFor={field}
                                className="block text-sm font-medium text-gray-700"
                            >
                                {field.replace(/([A-Z])/g, ' $1').replace(/\b\w/g, (c) => c.toUpperCase())}
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
                    <div>
                        <label
                            htmlFor="hotelId"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Hotel ID
                        </label>
                        <input
                            type="text"
                            id="hotelId"
                            name="hotelId"
                            value={formData.hotelId}
                            readOnly
                            className="mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 bg-gray-100 cursor-not-allowed border-gray-400"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="image"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Room Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border-gray-400"
                        />
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            id="submitButton"
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-6 rounded-md text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        >
                            Add Room
                        </button>
                    </div>
                </form>
                {imageUploadMessage && (
                    <p className="text-green-500 mt-4">{imageUploadMessage}</p>
                )}
            </div>
        </div>
    );
}