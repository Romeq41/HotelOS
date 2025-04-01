import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Room } from "../interfaces/Room";
import Header from "../components/Header";

export default function Admin_Hotel_Room_details() {
    const { id } = useParams<{ id: string }>();
    console.log(id);
    const navigate = useNavigate();
    const [room, setRoom] = useState<Room | null>(null);

    useEffect(() => {
        const fetchRoom = async () => {
            console.log(`Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`)
            if (id) {
                const res = await fetch(`http://localhost:8080/api/rooms/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });
                const data = await res.json();
                setRoom(data);
                console.log(data);
            }
        };
        fetchRoom();
    }, [id]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <Header isGradient={false} bg_color="white" textColor='black' />
            {/* Title */}
            <div className="container mt-20 mx-auto py-8 px-4">
                {room ? (
                    <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="md:w-1/2">
                            <img
                                src={`http://localhost:8080/api/rooms/${room.roomId}/image` || "https://via.placeholder.com/160"}
                                alt={room.roomNumber}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="md:w-1/2 p-6">
                            <h1 className="text-2xl font-bold mb-4">Room number: {room.roomNumber}</h1>
                            <p className="text-gray-700 mb-2">
                                <strong>ID:</strong> {room.roomId || "Unknown"}
                            </p>

                            <hr className="block my-3" />

                            <p className="text-gray-700 mb-2">
                                <strong>Description:</strong> {room.description || "Unknown"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Type:</strong> {room.type || "Unknown"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Price:</strong> ${room.rate || "Unknown"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Capacity:</strong> {room.capacity || "Unknown"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Status:</strong> {room.status ? "Available" : "Not Available"}
                            </p>

                            <hr className="block my-3" />
                            <button
                                onClick={() => navigate("/admin/hotels/" + room.hotel + "/rooms/" + room.roomId + "/edit")}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2"
                            >
                                Edit Room
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Loading room information...</p>
                )}
            </div>
        </div>
    );
}