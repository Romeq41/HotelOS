import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminHeader from "../components/Adminpage/AdminHeader";
import { Room } from "../interfaces/Room";
import { Hotel } from "../interfaces/Hotel";

export default function Admin_Hotel_Room_Details_Edit() {
    const { hotelId, roomId } = useParams<{ hotelId: string, roomId: string }>();
    const navigate = useNavigate();
    const [room, setRoom] = useState<Room | null>(null);
    const [formData, setFormData] = useState<(Room) | null>(null);
    const [hotels, setHotels] = useState<Hotel[] | null>(null);

    useEffect(() => {
        const fetchHotelsData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/hotels', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                setHotels(data);
            } catch (error) {
                console.error('Error fetching hotels data:', error);
            }
        };

        const fetchRoom = async () => {
            if (roomId) {
                const res = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });
                const data: Room = await res.json();
                setRoom(data);
                setFormData({
                    roomId: data.roomId || "",
                    roomNumber: data.roomNumber || "",
                    capacity: data.capacity || 0,
                    type: data.type || "",
                    rate: data.rate || 0,
                    hotelId: data.hotelId || "",
                    description: data.description || "",
                    status: data.status || "",
                });
            }
        };

        fetchHotelsData();
        fetchRoom();
    }, [hotelId, roomId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "hotel") {
            setFormData((prev: any) => (prev ? { ...prev, hotelId: value } : null));
        } else {
            setFormData((prev: any) => (prev ? { ...prev, [name]: value } : null));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (roomId && formData) {
            await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                },
                body: JSON.stringify(formData),
            });

            navigate("/admin/hotels/" + hotelId + "/rooms");

            console.log("Room updated successfully");
        }
    };

    return (

        // console.log("formData", formData),
        // console.log("hotels", hotels),
        console.log(hotelId, roomId),
        <div className="flex flex-col min-h-screen bg-gray-100" >
            <AdminHeader />
            < div className="container mx-auto py-8 px-4" >
                {
                    formData ? (
                        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6" >
                            <h1 className="text-2xl font-bold mb-4"> Edit Room id: {roomId} </h1>
                            < div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                                <div>
                                    <label className="block text-gray-700" > Room Number </label>
                                    < input
                                        type="text"
                                        name="roomNumber"
                                        value={formData.roomNumber || ""}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700" > Capacity </label>
                                    < input
                                        type="text"
                                        name="capacity"
                                        value={formData.capacity || ""}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                < div >
                                    <label className="block text-gray-700" > Room Type </label>
                                    < input
                                        type="text"
                                        name="type"
                                        value={formData.type || ""}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                < div >
                                    <label className="block text-gray-700" > Description </label>
                                    < input
                                        type="text"
                                        name="description"
                                        value={formData.description || ""}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                < div >
                                    <label className="block text-gray-700" > Rate </label>
                                    < input
                                        type="number"
                                        name="rate"
                                        value={formData.rate || ""}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                < div >
                                    <label className="block text-gray-700" > Hotel </label>
                                    < select
                                        name="hotel"
                                        value={formData.hotelId || ""}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        {(() => {
                                            const selectedHotel: Hotel | undefined = hotels?.find(hotel => hotel.id === room?.hotelId);
                                            return (
                                                <option value={room?.hotelId || ""}>
                                                    {selectedHotel ? `${selectedHotel.id}: ${selectedHotel.name}, ${selectedHotel.city}, ${selectedHotel.state}` : "Select a hotel"}
                                                </option>
                                            );
                                        })()}
                                        {
                                            hotels && hotels.length > 0 ? (
                                                hotels.map((hotel: Hotel) => (
                                                    <option key={hotel.id} value={hotel.id} >
                                                        {hotel.id + ": " + hotel.name + ", " + hotel.city + ", " + hotel.state}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled >
                                                    No hotels available
                                                </option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            < div className="mt-4" >
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-center text-gray-500" > Loading Room information...</p>
                    )
                }
            </div>
        </div>
    );
}