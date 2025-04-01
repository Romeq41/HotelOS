import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";

interface HotelData {
    id?: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export default function Adminpage_hotel_edit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotelData, setHotelData] = useState<HotelData>({
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUploadMessage, setImageUploadMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/hotels/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${document.cookie.replace(
                            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                            "$1"
                        )}`
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch hotel data");
                const data = await response.json();
                setHotelData(data);
            } catch (err) {
                console.error("Error fetching hotel:", err);
            }
        };

        if (id) {
            fetchHotelData();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHotelData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/hotels/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${document.cookie.replace(
                        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                        "$1"
                    )}`
                },
                body: JSON.stringify(hotelData)
            });

            if (!response.ok) throw new Error("Failed to update hotel");

            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append("file", imageFile);
                const imageResponse = await fetch(`http://localhost:8080/api/hotels/${id}/image_upload`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${document.cookie.replace(
                            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                            "$1"
                        )}`
                    },
                    body: imageFormData
                });
                if (!imageResponse.ok) {
                    const errorText = await imageResponse.text();
                    console.error("Image upload error:", errorText);
                    setImageUploadMessage("Failed to upload image.");
                    throw new Error("Image upload failed.");
                }
                setImageUploadMessage("Image uploaded successfully!");
            }

            navigate("/admin/hotels");
        } catch (error) {
            console.error("Error updating hotel:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header isGradient={false} bg_color="white" textColor='black' />
            <div className="container mt-20 mx-auto py-8 px-4">

                <div className="bg-white shadow-md rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Hotel Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={hotelData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Enter hotel name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={hotelData.address}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Enter address"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={hotelData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Enter city"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={hotelData.state}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Enter state"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Zip Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={hotelData.zipCode}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Enter zip code"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={hotelData.country}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Enter country"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-700">Hotel Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border px-3 py-2 mt-1 block w-full rounded-md sm:text-sm p-2"
                            />
                        </div>

                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/hotels")}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
                {imageUploadMessage && <p className="text-green-500 mt-4">{imageUploadMessage}</p>}
            </div>
        </div>
    );
}