import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Hotel } from "../interfaces/Hotel";
import { Room } from "../interfaces/Room";
import Header from "../components/Header";
import { User, UserType } from "../interfaces/User";

export default function HotelPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [rooms, setRooms] = useState<Room[] | null>(null);

    const [employees, setEmployees] = useState<User[] | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    }
                });
                const data = await res.json();

                const idParsed = parseInt(id || "", 10);

                const filteredEmployees = data.filter((employee: User) => employee.hotel?.id === idParsed);
                setEmployees(filteredEmployees);
            } catch (error) {
                console.error("Failed to fetch employees:", error);
            }
        }


        const fetchHotel = async () => {
            if (!id) return;
            try {
                const res = await fetch(`http://localhost:8080/api/hotels/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    }
                });
                const data = await res.json();
                setHotel(data);
            } catch (error) {
                console.error("Failed to fetch hotel:", error);
            }
        };

        // Fetch rooms for stats (if applicable)
        const fetchRooms = async () => {
            if (!id) return;
            try {
                const res = await fetch(`http://localhost:8080/api/rooms/hotel/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    }
                });
                const roomData = await res.json();

                console.log("Room data:", roomData);
                setRooms(roomData);
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
            }
        };

        fetchEmployees();
        fetchHotel();
        fetchRooms();
    }, [id]);

    const totalRooms = rooms?.length || 0;
    const occupiedRooms = rooms?.filter((room) => room.status?.toLowerCase() === "occupied").length || 0;
    const freeRooms = totalRooms - occupiedRooms;
    const occupiedPercent = totalRooms ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : "0";


    const totalEmployees = employees?.length;
    const managerCount = employees?.filter((emp) => emp.userType === UserType.MANAGER).length;
    const staffCount = employees?.filter((emp) => emp.userType === UserType.STAFF).length;

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 mt-20">
            <Header />
            <div className="container mx-auto py-8 px-4">
                {hotel ? (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left column */}
                            <div className="flex flex-col">
                                <div className="mb-4">
                                    <img
                                        src={
                                            `http://localhost:8080/api/hotels/${hotel.id}/image` ||
                                            "https://via.placeholder.com/160"
                                        }
                                        alt={hotel.name}
                                        className="w-full h-full object-cover max-h-96 min-h-96 rounded"
                                    />
                                </div>
                                <div className="w-full h-fullbg-gray-50 p-4 rounded">
                                    <h2 className="text-xl font-semibold mb-2">Hotel Statistics ({new Date().toLocaleDateString()}) </h2>
                                    <p><strong>Total Rooms:</strong> {totalRooms}</p>
                                    <p><strong>Occupied Rooms:</strong> {occupiedRooms} ({occupiedPercent}%)</p>
                                    <p><strong>Free Rooms:</strong> {freeRooms}</p>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="flex flex-col">
                                <div className="w-full h-full bg-gray-50 p-4 rounded mb-4">
                                    <h2 className="text-xl font-semibold mb-2">{hotel.name}</h2>
                                    <p><strong>ID:</strong> {hotel.id || "Unknown"}</p>
                                    <hr className="my-2" />
                                    <p><strong>Country:</strong> {hotel.country || "Unknown"}</p>
                                    <p><strong>State:</strong> {hotel.state || "Unknown"}</p>
                                    <p><strong>City:</strong> {hotel.city || "Unknown"}</p>
                                    <p><strong>Address:</strong> {hotel.address || "Unknown"}</p>
                                    <p><strong>Zip-code:</strong> {hotel.zipCode || "Unknown"}</p>
                                    <div className="mt-3">
                                        <button
                                            onClick={() => navigate(`/admin/hotels/${hotel.id}/edit`)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                                        >
                                            Edit Hotel
                                        </button>
                                        <button
                                            onClick={() => navigate(`/admin/hotels/${hotel.id}/rooms`)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            See Rooms
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded">
                                    <h2 className="text-xl font-semibold mb-2">Employees Statistics</h2>
                                    <p><strong>Total Employees:</strong> {totalEmployees}</p>
                                    <p><strong>Managers:</strong> {managerCount}</p>
                                    <p><strong>Staff:</strong> {staffCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Loading hotel information...</p>
                )}
            </div>
        </div>
    );
}