import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../components/Adminpage/AdminHeader";
import { User } from "../interfaces/User";
import { Hotel } from "../interfaces/Hotel";

export default function Admin_User_Edit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<User | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [hotels, setHotels] = useState<Hotel[] | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUploadMessage, setImageUploadMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                const response = await fetch(`http://localhost:8080/api/users/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${document.cookie.replace(
                            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                            "$1"
                        )}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user.");
                }
                const userData: User = await response.json();
                setUser(userData);
                setFormData(userData);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        const fetchHotels = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/hotels", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${document.cookie.replace(
                            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                            "$1"
                        )}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch hotels.");
                }
                const hotelsData: Hotel[] = await response.json();
                setHotels(hotelsData);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        fetchUser();
        fetchHotels();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (!formData) return;

        if (name === "hotel") {
            setFormData((prev) => (prev ? { ...prev, hotel: { ...prev.hotel, id: value } } : prev));
            return;
        }

        setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData || !id) return;

        const userDto: User = {
            userId: id,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            userType: formData.userType,
            hotel: {
                id: formData.hotel?.id || null
            },
            position: formData.position,
            country: formData.country,
            state: formData.state,
            city: formData.city,
            address: formData.address,
            zipCode: formData.zipCode,
            password: formData.password
        };

        console.log("Form submitted:", userDto);

        try {
            const response = await fetch(`http://localhost:8080/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${document.cookie.replace(
                        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                        "$1"
                    )}`
                },
                body: JSON.stringify(userDto)
            });

            if (!response.ok) {
                throw new Error("Failed to update user.");
            }

            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append("file", imageFile);

                const imageResponse = await fetch(
                    `http://localhost:8080/api/users/${id}/image_upload`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${document.cookie.replace(
                                /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                                "$1"
                            )}`
                        },
                        body: imageFormData
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

            console.log("User updated successfully");
            navigate("/admin/users");
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <AdminHeader />
            <div className="container mx-auto py-8 px-4">
                {formData ? (
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700">UserType</label>
                                <select
                                    name="userType"
                                    value={formData.userType || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="GUEST">User</option>
                                    <option value="STAFF">Staff</option>
                                    <option value="MANAGER">Manager</option>
                                    {/* <option value="ADMIN">ADMIN</option> */}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700">Hotel</label>
                                <select
                                    name="hotel"
                                    value={formData.hotel?.id || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value={user?.hotel?.id || ""}>
                                        Current hotel:{" "}
                                        {user?.hotel
                                            ? `id: ${user.hotel.id}, ${user.hotel.name}`
                                            : "NONE"}
                                    </option>
                                    {hotels && hotels.length > 0 ? (
                                        hotels.map((hotel) => (
                                            <option key={hotel.id} value={hotel.id}>
                                                {hotel.id + ": " + hotel.name + ", " + hotel.city + ", " + hotel.state}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            No hotels available
                                        </option>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            {/* Add more user fields here if needed */}
                            <div>
                                <label className="block text-gray-700">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Zip Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Image upload input */}
                        <div className="mt-4">
                            <label className="block text-gray-700" htmlFor="image">
                                User Image
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

                        {/* Submit button */}
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
                    <p className="text-center text-gray-500">Loading user data...</p>
                )}
                {imageUploadMessage && (
                    <p className="text-green-500 mt-4">{imageUploadMessage}</p>
                )}
            </div>
        </div>
    );
}