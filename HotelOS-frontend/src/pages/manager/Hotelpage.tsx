import { useNavigate, useParams } from "react-router-dom";
import { use, useEffect, useState } from "react";
import { HotelDto, HotelStatisticsDto } from "../../api/generated/api";
import { useLoading } from "../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";
import { useApi } from "../../api/useApi";

export interface ImageData {
    imageId: number;
    altText: string | null;
    imageUrl: string;
}

export default function HotelPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState<HotelDto | null>(null);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const { hotel: hotelApi } = useApi();
    const [hotelImage, setHotelImage] = useState<ImageData>();

    const [statistics, setStatistics] = useState<HotelStatisticsDto>({
        hotelId: 0,
        staffCount: 0,
        managerCount: 0,
        totalUserCount: 0,
        currentlyOccupiedCount: 0,
        currentlyAvailableCount: 0,
        totalRoomCount: 0,
        reservationsCount: 0,
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            showLoader();
            try {
                if (!id) return;
                const { data } = await hotelApi.getHotelStatistics(Number(id));
                setStatistics(data as any);
            } catch (error) {
                console.error("Failed to fetch employees:", error);
            }
            hideLoader();
        }

        const fetchHotel = async () => {
            if (!id) return;
            showLoader();
            try {
                const { data } = await hotelApi.getHotelById(Number(id));
                setHotel(data as HotelDto);

                const imageData = await hotelApi.getHotelImage(Number(id));
                console.log(imageData);
                setHotelImage(imageData.data as ImageData);

            } catch (error) {
                console.error("Failed to fetch hotel:", error);
            }
            hideLoader();
        };

        fetchStatistics();
        fetchHotel();
    }, [id]);

    const totalRooms = statistics.totalRoomCount ?? 0;
    const occupiedRooms = statistics.currentlyOccupiedCount ?? 0;
    const freeRooms = statistics.currentlyAvailableCount ?? 0;
    const occupiedPercent = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    const totalEmployees = statistics.totalUserCount ?? 0;
    const managerCount = statistics.managerCount ?? 0;
    const staffCount = statistics.staffCount ?? 0;

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 mt-20">
            <div className="container mx-auto py-8 px-4">
                {hotel ? (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left column */}
                            <div className="flex flex-col">
                                <div className="mb-4">
                                    <img
                                        src={
                                            hotelImage?.imageUrl ||
                                            "https://via.placeholder.com/160"
                                        }
                                        alt={hotel.name}
                                        className="w-full h-full object-cover max-h-96 min-h-96 rounded"
                                    />
                                </div>
                                <div className="w-full h-fullbg-gray-50 p-4 rounded">
                                    <h2 className="text-xl font-semibold mb-2">
                                        {t('admin.hotels.details.statistics', 'Hotel Statistics')} ({new Date().toLocaleDateString()})
                                    </h2>
                                    <p>
                                        <strong>{t('admin.hotels.statistics.totalRooms', 'Total Rooms')}:</strong> {totalRooms}
                                    </p>
                                    <p>
                                        <strong>{t('admin.hotels.statistics.occupiedRooms', 'Occupied Rooms')}:</strong> {occupiedRooms} ({occupiedPercent}%)
                                    </p>
                                    <p>
                                        <strong>{t('admin.hotels.statistics.freeRooms', 'Free Rooms')}:</strong> {freeRooms}
                                    </p>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="flex flex-col">
                                <div className="w-full h-full bg-gray-50 p-4 rounded mb-4">
                                    <h2 className="text-xl font-semibold mb-2">{hotel.name}</h2>
                                    <p>
                                        <strong>{t('admin.hotels.details.id', 'ID')}:</strong> {hotel.id || t('common.unknown', 'Unknown')}
                                    </p>
                                    <hr className="my-2" />
                                    <p>
                                        <strong>{t('admin.hotels.details.country', 'Country')}:</strong> {hotel.addressInformation?.country || t('common.unknown', 'Unknown')}
                                    </p>
                                    <p>
                                        <strong>{t('admin.hotels.details.state', 'State')}:</strong> {hotel.addressInformation?.state || t('common.unknown', 'Unknown')}
                                    </p>
                                    <p>
                                        <strong>{t('admin.hotels.details.city', 'City')}:</strong> {hotel.addressInformation?.city || t('common.unknown', 'Unknown')}
                                    </p>
                                    <p>
                                        <strong>{t('admin.hotels.details.address', 'Address')}:</strong> {hotel.addressInformation?.address || t('common.unknown', 'Unknown')}
                                    </p>
                                    <p>
                                        <strong>{t('admin.hotels.details.zipCode', 'Zip-code')}:</strong> {hotel.addressInformation?.zipCode || t('common.unknown', 'Unknown')}
                                    </p>
                                    <div className="mt-3">
                                        <button
                                            onClick={() => navigate("/manager/hotel/" + hotel.id + "/edit")}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2"
                                        >
                                            {t("admin.hotels.editHotel", "Edit Hotel")}
                                        </button>

                                        <button
                                            onClick={() => navigate("/manager/hotel/" + hotel.id + "/rooms")}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2"
                                        >
                                            {t("admin.hotels.seeRooms", "See Rooms")}
                                        </button>
                                        <button
                                            onClick={() => navigate("/manager/hotel/" + hotel.id + "/reservations")}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2"
                                        >
                                            {t("admin.hotels.seeReservations", "See Reservations")}
                                        </button>
                                        <button
                                            onClick={() => navigate("/manager/hotel/" + hotel.id + "/staff")}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2"
                                        >
                                            {t("admin.hotels.seeEmployees", "See Employees")}
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded">
                                    <h2 className="text-xl font-semibold mb-2">
                                        {t('admin.hotels.details.employeesStats', 'Employees Statistics')}
                                    </h2>
                                    <p>
                                        <strong>{t('admin.hotels.statistics.totalEmployees', 'Total Employees')}:</strong> {totalEmployees}
                                    </p>
                                    <p>
                                        <strong>{t('admin.hotels.statistics.managers', 'Managers')}:</strong> {managerCount}
                                    </p>
                                    <p>
                                        <strong>{t('admin.hotels.statistics.staff', 'Staff')}:</strong> {staffCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        {t('admin.hotels.loading', 'Loading hotel information...')}
                    </p>
                )}
            </div>
        </div>
    );
}