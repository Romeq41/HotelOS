import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Hotel } from "../interfaces/Hotel";
import AdminHeader from "../components/Adminpage/AdminHeader";

export default function HotelPage() {
    const { id } = useParams<{ id: string }>();
    console.log(id);
    const navigate = useNavigate();
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        const fetchHotel = async () => {
            console.log(`Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`)
            if (id) {
                const res = await fetch(`http://localhost:8080/api/hotels/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });
                const data = await res.json();
                setHotel(data);
                console.log(data);
            }
        };
        fetchHotel();
    }, [id]);

    return (

        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <AdminHeader />
            {/* Title */}
            <div className="container mx-auto py-8 px-4">
                {hotel ? (
                    <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="md:w-1/2">
                            <img
                                src={hotel.image || "https://via.placeholder.com/160"}
                                alt={hotel.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="md:w-1/2 p-6">
                            <h1 className="text-2xl font-bold mb-4">{hotel.name}</h1>
                            <p className="text-gray-700 mb-2">
                                <strong>ID:</strong> {hotel.id || "Unknown"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Country:</strong> {hotel.country || "Unknown"}
                                <strong>State:</strong> {hotel.state || "Unknown"}
                                <strong>City:</strong> {hotel.city || "Unknown"}
                                <strong>Address:</strong> {hotel.address || "Unknown"}
                                <strong>Zip-code:</strong> {hotel.zipCode || "Unknown"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Number of Rooms:</strong>
                                {/* {hotel.rooms || "N/A"} */}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Occupation:</strong>
                                {/* {hotel.occupation || "N/A"} */}
                            </p>
                            <p className="text-gray-700 mb-4">
                                <strong>Description:</strong>
                                {/* {hotel.description || "No description available."} */}
                            </p>
                            <button
                                onClick={() => navigate("/booking")}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Loading hotel information...</p>
                )}
            </div>
        </div>
    );
}