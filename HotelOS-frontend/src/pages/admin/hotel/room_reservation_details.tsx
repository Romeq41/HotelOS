import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Reservation } from "../../../interfaces/Reservation";
import { useLoading } from "../../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";

export default function Admin_Hotel_Room_Reservation_Details() {
    const { hotelId, reservationId } = useParams<{ hotelId: string; reservationId: string }>();
    console.log(hotelId, reservationId);
    const navigate = useNavigate();
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchReservation = async () => {
            console.log(`Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`);
            if (reservationId) {
                showLoader();
                try {
                    const res = await fetch(`http://localhost:8080/api/reservations/${reservationId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                        },
                    });

                    if (!res.ok) {
                        throw new Error('Failed to fetch reservation data');
                    }

                    const data = await res.json();
                    setReservation(data);
                    console.log(data);
                } catch (error) {
                    console.error("Error fetching reservation:", error);
                } finally {
                    hideLoader();
                }
            }
        };
        fetchReservation();
    }, [hotelId, reservationId]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="container mt-20 mx-auto py-8 px-4">
                {reservation ? (
                    <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="md:w-full p-6">
                            <h1 className="text-2xl font-bold mb-4">
                                {t('admin.reservations.details.title', 'Reservation Details')}
                            </h1>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.reservations.details.id', 'ID')}:</strong> {reservation.reservationId || t('admin.reservations.unknown', 'Unknown')}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.reservations.details.guestName', 'Guest Name')}:</strong> {reservation.reservationName || t('admin.reservations.unknown', 'Unknown')}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.reservations.details.roomNumber', 'Room Number')}:</strong> {reservation.room?.roomNumber || t('admin.reservations.unknown', 'Unknown')}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.reservations.details.checkInDate', 'Check-in Date')}:</strong> {reservation.checkInDate ? new Date(reservation.checkInDate).toLocaleDateString() : t('admin.reservations.unknown', 'Unknown')}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.reservations.details.checkOutDate', 'Check-out Date')}:</strong> {reservation.checkOutDate ? new Date(reservation.checkOutDate).toLocaleDateString() : t('admin.reservations.unknown', 'Unknown')}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.reservations.details.status', 'Status')}:</strong> {
                                    reservation.status ?
                                        t(`admin.reservations.status.${reservation.status.toLowerCase()}`, reservation.status) :
                                        t('admin.reservations.unknown', 'Unknown')
                                }
                            </p>

                            <hr className="block my-3" />
                            <button
                                onClick={() => navigate(`/admin/hotels/${hotelId}/reservations/${reservationId}/edit`)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2"
                            >
                                {t('admin.reservations.editReservation', 'Edit Reservation')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        {t('admin.reservations.loading', 'Loading reservation information...')}
                    </p>
                )}
            </div>
        </div>
    );
}