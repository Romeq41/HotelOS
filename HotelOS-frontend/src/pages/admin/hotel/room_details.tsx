import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Room } from "../../../interfaces/Room";
import { useLoading } from "../../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../contexts/UserContext";
import { UserType } from "../../../interfaces/User";

export default function Admin_Hotel_Room_details() {
    const { roomId } = useParams<{ hotelId: string; roomId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [room, setRoom] = useState<Room | null>(null);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const { user: currentUser } = useUser();

    const getEditUrl = () => {
        const path = location.pathname;

        if (path.includes('/admin/')) {
            return `/admin/hotels/${room?.hotel?.id}/rooms/${roomId}/edit`;
        } else if (path.includes('/manager/')) {
            return `/manager/hotel/${room?.hotel?.id}/rooms/${roomId}/edit`;
        } else {
            return currentUser?.userType === UserType.ADMIN
                ? `/admin/hotels/${room?.hotel?.id}/rooms/${roomId}/edit`
                : `/manager/hotel/${room?.hotel?.id}/rooms/${roomId}/edit`;
        }
    };

    useEffect(() => {
        const fetchRoom = async () => {
            showLoader();

            if (roomId) {
                try {
                    const res = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                        },
                    });

                    if (!res.ok) {
                        throw new Error('Failed to fetch room data');
                    }

                    const data = await res.json();
                    setRoom(data);
                } catch (error) {
                    console.error("Error fetching room data:", error);
                }
            }
            hideLoader();
        };
        fetchRoom();
    }, [roomId]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
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
                            <h1 className="text-2xl font-bold mb-4">
                                {t('admin.hotels.rooms.details.roomNumber', 'Room number')}: {room.roomNumber}
                            </h1>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.hotels.rooms.details.id', 'ID')}:</strong> {room.roomId || t('admin.hotels.unknown', 'Unknown')}
                            </p>

                            <hr className="block my-3" />

                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.hotels.rooms.details.description', 'Description')}:</strong> {room.description || t('admin.hotels.unknown', 'Unknown')}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.hotels.rooms.details.type', 'Type')}:</strong> {room.roomType || t('admin.hotels.unknown', 'Unknown')}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.hotels.rooms.details.price', 'Price')}:</strong> ${room.price || t('admin.hotels.unknown', 'Unknown')}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.hotels.rooms.details.capacity', 'Capacity')}:</strong> {room.capacity || t('admin.hotels.unknown', 'Unknown')}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.hotels.rooms.details.status', 'Status')}:</strong> {room.status
                                    ? t('admin.hotels.rooms.details.available', 'Available')
                                    : t('admin.hotels.rooms.details.notAvailable', 'Not Available')}
                            </p>

                            <hr className="block my-3" />
                            <button
                                onClick={() => navigate(getEditUrl())}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2"
                            >
                                {t('admin.hotels.rooms.details.editRoom', 'Edit Room')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">{t('admin.hotels.rooms.details.loading', 'Loading room information...')}</p>
                )}
            </div>
        </div>
    );
}