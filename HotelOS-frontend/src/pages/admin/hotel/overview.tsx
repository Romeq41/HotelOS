import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Hotel } from "../../../interfaces/Hotel";
import { useLoading } from "../../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";

export default function Admin_Hotel_overview() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchHotel = async () => {
            showLoader();
            if (id) {
                try {
                    const res = await fetch(`http://localhost:8080/api/hotels/${id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                        },
                    });

                    if (!res.ok) {
                        throw new Error("Failed to fetch hotel data");
                    }

                    const data = await res.json();
                    setHotel(data);
                } catch (error) {
                    console.error("Error fetching hotel:", error);
                }
            }
            hideLoader();
        };

        fetchHotel();
    }, [id]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="container mt-20 mx-auto py-8 px-4">
                {hotel ? (
                    <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="md:w-1/2">
                            <img
                                src={`http://localhost:8080/api/hotels/${hotel.id}/image` || "https://via.placeholder.com/160"}
                                alt={hotel.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="md:w-1/2 p-6">
                            <h1 className="text-2xl font-bold mb-4">{hotel.name}</h1>
                            <p className="text-gray-700 mb-2">
                                <strong>{t("admin.hotels.overview.id", "ID")}:</strong> {hotel.id || t("admin.hotels.overview.unknown", "Unknown")}
                            </p>

                            <hr className="block my-3" />

                            <p className="text-gray-700 mb-2">
                                <strong>{t("admin.hotels.fields.country", "Country")}:</strong> {hotel.country || t("admin.hotels.overview.unknown", "Unknown")}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t("admin.hotels.fields.state", "State")}:</strong> {hotel.state || t("admin.hotels.overview.unknown", "Unknown")}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t("admin.hotels.fields.city", "City")}:</strong> {hotel.city || t("admin.hotels.overview.unknown", "Unknown")}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t("admin.hotels.fields.address", "Address")}:</strong> {hotel.address || t("admin.hotels.overview.unknown", "Unknown")}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t("admin.hotels.fields.zipCode", "Zip-code")}:</strong> {hotel.zipCode || t("admin.hotels.overview.unknown", "Unknown")}
                            </p>

                            <hr className="block my-3" />

                            <button
                                onClick={() => navigate("/admin/hotels/" + hotel.id + "/edit")}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2"
                            >
                                {t("admin.hotels.editHotel", "Edit Hotel")}
                            </button>

                            <button
                                onClick={() => navigate("/admin/hotels/" + hotel.id + "/rooms")}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2"
                            >
                                {t("admin.hotels.seeRooms", "See Rooms")}
                            </button>
                            <button
                                onClick={() => navigate("/admin/hotels/" + hotel.id + "/reservations")}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2"
                            >
                                {t("admin.hotels.seeReservations", "See Reservations")}
                            </button>
                            <button
                                onClick={() => navigate("/admin/hotels/" + hotel.id + "/users")}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2"
                            >
                                {t("admin.hotels.seeEmployees", "See Employees")}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">{t("admin.hotels.overview.loading", "Loading hotel information...")}</p>
                )}
            </div>
        </div>
    );
}