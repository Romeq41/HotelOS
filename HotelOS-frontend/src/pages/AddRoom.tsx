import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { UserType } from '../interfaces/User';
import Header from '../components/Header';
import { RoomStatus } from '../interfaces/Room';

interface RoomDTO {
    hotelId: string;
    roomNumber: string;
    type: string;
    capacity: string;
    rate: string;
    status: RoomStatus;
    imagePath?: string;
}

export default function AddRoom() {
    const { id } = useParams();
    const [formData, setFormData] = useState<RoomDTO>({
        hotelId: id || '',
        roomNumber: '',
        type: '',
        capacity: '',
        rate: '',
        status: RoomStatus.AVAILABLE
    });
    const { isAuth, user } = useUser();

    if (!isAuth || (user?.userType === UserType.STAFF || user?.userType === UserType.GUEST)) {
        console.log('Unauthorized access. Redirecting to login page...');
        // window.location.href = '/login';
    }

    const [errors, setErrors] = useState<Partial<Record<keyof RoomDTO, string>>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
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
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {

        console.log('Form data before submit:', formData);
        console.log('Image file before submit:', imageFile);
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.values(validationErrors).every((error) => !error)) {
            console.log('Form submitted:', formData);

            try {
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


                setFormData({
                    hotelId: id || '',
                    roomNumber: '',
                    type: '',
                    capacity: '',
                    rate: '',
                    status: RoomStatus.AVAILABLE,
                });
                setImageFile(null);
                setErrors({});

                const submitButton = document.getElementById('submitButton') as HTMLButtonElement;
                if (submitButton) {
                    submitButton.classList.remove('bg-blue-600');
                    submitButton.classList.add('bg-green-600', 'transition', 'duration-300', 'ease-in-out');
                    submitButton.innerText = 'Room Added!';

                    setTimeout(() => {
                        submitButton.classList.remove('bg-green-600');
                        submitButton.classList.add('bg-blue-600');
                        submitButton.innerText = 'Add Room';
                    }, 2000);
                }

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
            <Header isGradient={false} bg_color="white" textColor='black' />
            <div className="container mt-20 mx-auto py-8 px-4">
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
                                {field
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </label>

                            {field === 'status' ? (
                                <select
                                    id={field}
                                    name={field}
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            status: e.target.value as unknown as RoomStatus,
                                        })
                                    }
                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${getInputClass(field)}`}
                                >
                                    <option value={RoomStatus.AVAILABLE}>Available</option>
                                    <option value={RoomStatus.RESERVED}>Reserved</option>
                                    <option value={RoomStatus.OCCUPIED}>Occupied</option>
                                    <option value={RoomStatus.MAINTENANCE}>Under Maintenance</option>
                                </select>
                            ) : (
                                // For all other fields, keep using a text input
                                <input
                                    type="text"
                                    id={field}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${getInputClass(field)}`}
                                />
                            )}

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