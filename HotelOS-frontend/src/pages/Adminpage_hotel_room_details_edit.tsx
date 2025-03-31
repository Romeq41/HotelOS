import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../components/Adminpage/AdminHeader";
import { Room } from "../interfaces/Room";
import { Hotel } from "../interfaces/Hotel";

interface ValidationErrors {
    roomNumber?: string;
    capacity?: string;
    type?: string;
    rate?: string;
    status?: string;
}

export default function Admin_Hotel_Room_Details_Edit() {
    const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Room | null>(null);
    const [hotels, setHotels] = useState<Hotel[] | null>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUploadMessage, setImageUploadMessage] = useState<string | null>(null);

    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        const fetchHotelsData = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/hotels", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${document.cookie.replace(
                            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                            "$1"
                        )}`,
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch hotels.");
                const data = await response.json();
                setHotels(data);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        const fetchRoom = async () => {
            if (roomId) {
                try {
                    const res = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${document.cookie.replace(
                                /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                                "$1"
                            )}`,
                        },
                    });
                    if (!res.ok) throw new Error("Failed to fetch room.");
                    const roomData: Room = await res.json();

                    setFormData(roomData);
                } catch (error) {
                    console.error("Error fetching room:", error);
                }
            }
        };

        fetchHotelsData();
        fetchRoom();
    }, [hotelId, roomId]);

    const validate = (): ValidationErrors => {
        const newErrors: ValidationErrors = {};
        if (!formData?.roomNumber) {
            newErrors.roomNumber = "Room Number is required.";
        }
        if (!formData?.capacity && formData?.capacity !== 0) {
            newErrors.capacity = "Capacity is required.";
        } else if (isNaN(Number(formData?.capacity))) {
            newErrors.capacity = "Capacity must be a number.";
        }
        if (!formData?.type) {
            newErrors.type = "Type is required.";
        }
        if (!formData?.rate && formData?.rate !== 0) {
            newErrors.rate = "Rate is required.";
        } else if (isNaN(Number(formData?.rate))) {
            newErrors.rate = "Rate must be a number.";
        }
        if (!formData?.status) {
            newErrors.status = "Status is required.";
        }

        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "hotel") {
            setFormData((prev) =>
                prev ? { ...prev, hotelId: value } : null
            );
            return;
        }
        setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
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

        const hasErrors = Object.values(validationErrors).some((error) => error);
        if (hasErrors || !formData || !roomId) return;

        try {
            const response = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${document.cookie.replace(
                        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                        "$1"
                    )}`,
                },
                body: JSON.stringify({
                    ...formData,
                    capacity: Number(formData.capacity),
                    rate: Number(formData.rate),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update room.");
            }


            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append("file", imageFile);
                const imageResponse = await fetch(
                    `http://localhost:8080/api/rooms/${roomId}/image_upload`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${document.cookie.replace(
                                /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                                "$1"
                            )}`,
                        },
                        body: imageFormData,
                    }
                );

                if (!imageResponse.ok) {
                    const errorText = await imageResponse.text();
                    console.error("Image upload error:", errorText);
                    setImageUploadMessage("Failed to upload image.");
                    throw new Error("Image upload failed.");
                }
                setImageUploadMessage("Image uploaded successfully!");
            }

            console.log("Room updated successfully");

            navigate(`/admin/hotels/${hotelId}/rooms`);
        } catch (error) {
            console.error("Error updating room:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <AdminHeader />
            <div className="container mx-auto py-8 px-4">

                {formData ? (
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                        <h1 className="text-2xl font-bold mb-4">Edit Room ID: {roomId}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Room Number */}
                            <div>
                                <label className="block text-gray-700" htmlFor="roomNumber">
                                    Room Number
                                </label>
                                <input
                                    type="text"
                                    name="roomNumber"
                                    value={formData.roomNumber || ""}
                                    onChange={handleChange}
                                    className={`w-full border rounded px-3 py-2 ${errors.roomNumber ? "border-red-500" : "border-gray-400"
                                        }`}
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
                                    type="text"
                                    name="capacity"
                                    value={formData.capacity || ""}
                                    onChange={handleChange}
                                    className={`w-full border rounded px-3 py-2 ${errors.capacity ? "border-red-500" : "border-gray-400"
                                        }`}
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
                                    value={formData.type || ""}
                                    onChange={handleChange}
                                    className={`w-full border rounded px-3 py-2 ${errors.type ? "border-red-500" : "border-gray-400"
                                        }`}
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
                                    value={formData.description || ""}
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
                                    value={formData.rate || ""}
                                    onChange={handleChange}
                                    className={`w-full border rounded px-3 py-2 ${errors.rate ? "border-red-500" : "border-gray-400"
                                        }`}
                                />
                                {errors.rate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.rate}</p>
                                )}
                            </div>

                            {/* Hotel */}
                            <div>
                                <label className="block text-gray-700" htmlFor="hotel">
                                    Hotel
                                </label>
                                <select
                                    name="hotel"
                                    value={formData.hotelId || ""}
                                    onChange={handleChange}
                                    className={`w-full border rounded px-3 py-2 ${errors.roomNumber ? "border-red-500" : "border-gray-400"
                                        }`}
                                >
                                    {/* Use selectedHotel for default, if needed */}
                                    {hotels && hotels.length > 0 ? (
                                        hotels.map((hotel) => (
                                            <option key={hotel.id} value={hotel.id}>
                                                {hotel.id + ": " + hotel.name + ", " + hotel.city + ", " + hotel.state}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No hotels available</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="mt-4">
                            <label className="block text-gray-700" htmlFor="status">
                                Status
                            </label>
                            <input
                                type="text"
                                name="status"
                                value={formData.status || ""}
                                onChange={handleChange}
                                className={`w-full border rounded px-3 py-2 ${errors.status ? "border-red-500" : "border-gray-400"
                                    }`}
                            />
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
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
                                className="border px-3 py-2 mt-1 block w-full rounded-md sm:text-sm p-2"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-center text-gray-500">Loading Room information...</p>
                )}

                {imageUploadMessage && (
                    <p className="text-green-500 mt-4">{imageUploadMessage}</p>
                )}
            </div>
        </div>
    );
}