import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Reservation } from "../interfaces/Reservation";
import Header from "../components/Header";

export default function Admin_Hotel_Room_Reservation_Details() {
    const { hotelId, reservationId } = useParams<{ hotelId: string; reservationId: string }>();
    console.log(hotelId, reservationId);
    const navigate = useNavigate();
    const [reservation, setReservation] = useState<Reservation | null>(null);

    useEffect(() => {
        const fetchReservation = async () => {
            console.log(`Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`);
            if (reservationId) {
                const res = await fetch(`http://localhost:8080/api/reservations/${reservationId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });
                const data = await res.json();
                setReservation(data);
                console.log(data);
            }
        };
        fetchReservation();
    }, [hotelId, reservationId]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <Header isGradient={false} bg_color="white" textColor='black' />
            {/* Title */}
            <div className="container mt-20 mx-auto py-8 px-4">
                {reservation ? (
                    <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="md:w-full p-6">
                            <h1 className="text-2xl font-bold mb-4">Reservation Details</h1>
                            <p className="text-gray-700 mb-2">
                                <strong>ID:</strong> {reservation.reservationId || "Unknown"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Guest Name:</strong> {reservation.reservationName || "Unknown"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Room Number:</strong> {reservation.room.roomNumber || "Unknown"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Check-in Date:</strong> {reservation.checkInDate ? new Date(reservation.checkInDate).toLocaleDateString() : "Unknown"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Check-out Date:</strong> {reservation.checkOutDate ? new Date(reservation.checkOutDate).toLocaleDateString() : "Unknown"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Status:</strong> {reservation.status || "Unknown"}
                            </p>

                            <hr className="block my-3" />
                            <button
                                // /admin/hotels/:hotelId/reservations/:reservationId/edit
                                onClick={() => navigate(`/admin/hotels/${hotelId}/reservations/${reservationId}/edit`)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2"
                            >
                                Edit Reservation
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Loading reservation information...</p>
                )}
            </div>
        </div>
    );
}