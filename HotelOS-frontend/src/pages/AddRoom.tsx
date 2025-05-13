import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { UserType } from '../interfaces/User';
import { RoomStatus } from '../interfaces/Room';
import { useLoading } from '../contexts/LoaderContext';

interface ValidationErrors {
    roomNumber?: string;
    capacity?: string;
    type?: string;
    rate?: string;
    status?: string;
    hotelId?: string;
}

interface RoomDTO {
    hotel: { id: string };
    roomNumber: number;
    type: string;
    capacity: string;
    rate: string;
    status: RoomStatus;
    description?: string;
    imagePath?: string;
}

export default function AddRoom() {
    const { hotelId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RoomDTO>({
        hotel: { id: hotelId || '' },
        roomNumber: 0,
        type: '',
        capacity: '',
        rate: '',
        status: RoomStatus.AVAILABLE,
        description: ''
    });

    const { isAuth, user } = useUser();
    const { showLoader, hideLoader } = useLoading();

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUploadMessage, setImageUploadMessage] = useState<string | null>(null);

    if (!isAuth || (user?.userType === UserType.STAFF || user?.userType === UserType.GUEST)) {
        console.log('Unauthorized access. Redirecting to login page...');
        // window.location.href = '/login';
    }

    const validate = (): ValidationErrors => {
        const newErrors: ValidationErrors = {};

        if (!formData.hotel.id) {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'roomNumber') {
            setFormData({
                ...formData,
                [name]: value === '' ? 0 : parseInt(value, 10)
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        console.log(formData);
        const hasErrors = Object.values(validationErrors).some((error) => error);
        if (hasErrors) return;

        showLoader();
        try {
            const response = await fetch('http://localhost:8080/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                },
                body: JSON.stringify({
                    ...formData,
                    capacity: Number(formData.capacity),
                    rate: Number(formData.rate),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create room');
            }

            const data = await response.json();
            console.log('Room added:', data);

            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('file', imageFile);

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

                setImageUploadMessage('Image uploaded successfully!');
            }

            setFormData({
                hotel: { id: hotelId || '' },
                roomNumber: 0,
                type: '',
                capacity: '',
                rate: '',
                status: RoomStatus.AVAILABLE,
                description: ''
            });
            setImageFile(null);
            setErrors({});

            navigate(`/admin/hotels/${hotelId}/rooms`);
        } catch (error) {
            console.error('Error submitting form:', error);
            setImageUploadMessage('Failed to create room or upload image');
        }
        hideLoader();
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="container mt-20 mx-auto py-8 px-4">
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Add New Room</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Room Number */}
                        <div>
                            <label className="block text-gray-700" htmlFor="roomNumber">
                                Room Number
                            </label>
                            <input
                                type="number"
                                name="roomNumber"
                                value={formData.roomNumber || ''}
                                onChange={handleChange}
                                min="1"
                                className={`w-full border rounded px-3 py-2 ${errors.roomNumber ? "border-red-500" : "border-gray-400"}`}
                            />
                            {errors.roomNumber && (
                                <p className="text-red-500 text-sm mt-1">{errors.roomNumber}</p>
                            )}
                        </div>

                        {/* Capacity */}
                        <div>
                            <label className="block text-gray-700" htmlFor="capacity">
                                Capacity
                            </label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity || ''}
                                onChange={handleChange}
                                min="1"
                                className={`w-full border rounded px-3 py-2 ${errors.capacity ? "border-red-500" : "border-gray-400"}`}
                            />
                            {errors.capacity && (
                                <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
                            )}
                        </div>

                        {/* Room Type */}
                        <div>
                            <label className="block text-gray-700" htmlFor="type">
                                Room Type
                            </label>
                            <input
                                type="text"
                                name="type"
                                value={formData.type || ''}
                                onChange={handleChange}
                                className={`w-full border rounded px-3 py-2 ${errors.type ? "border-red-500" : "border-gray-400"}`}
                            />
                            {errors.type && (
                                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-gray-700" htmlFor="description">
                                Description
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 border-gray-400"
                            />
                        </div>

                        {/* Rate */}
                        <div>
                            <label className="block text-gray-700" htmlFor="rate">
                                Rate
                            </label>
                            <input
                                type="number"
                                name="rate"
                                value={formData.rate || ''}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className={`w-full border rounded px-3 py-2 ${errors.rate ? "border-red-500" : "border-gray-400"}`}
                            />
                            {errors.rate && (
                                <p className="text-red-500 text-sm mt-1">{errors.rate}</p>
                            )}
                        </div>

                        {/* Hotel ID (read-only) */}
                        <div>
                            <label className="block text-gray-700" htmlFor="hotelId">
                                Hotel ID
                            </label>
                            <input
                                type="text"
                                name="hotelId"
                                value={formData.hotel.id || ''}
                                readOnly
                                className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed border-gray-400"
                            />
                            {errors.hotelId && (
                                <p className="text-red-500 text-sm mt-1">{errors.hotelId}</p>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="mt-4">
                        <label className="block text-gray-700" htmlFor="status">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`w-full border rounded px-3 py-2 ${errors.status ? "border-red-500" : "border-gray-400"}`}
                        >
                            <option value={RoomStatus.AVAILABLE}>Available</option>
                            <option value={RoomStatus.RESERVED}>Reserved</option>
                            <option value={RoomStatus.OCCUPIED}>Occupied</option>
                            <option value={RoomStatus.MAINTENANCE}>Under Maintenance</option>
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                        )}
                    </div>

                    {/* Image upload */}
                    <div className="mt-4">
                        <label htmlFor="image" className="block text-gray-700">
                            Room Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border px-3 py-2 mt-1 block w-full rounded-md border-gray-400"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-center">
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