import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoading } from "../../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../contexts/UserContext";
// UserType no longer needed here; using permissionContext from routeUtils
import { getEditUrl, getPermissionContext } from "../../../utils/routeUtils";
import { useApi } from "../../../api/useApi";
import { RoomDto } from "../../../api/generated/api";
import { UniversalSlider } from "../../../components/UniversalSlider";
import { message } from "antd";

export default function Admin_Hotel_Room_details() {
    const { roomId } = useParams<{ hotelId: string; roomId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [room, setRoom] = useState<RoomDto | null>(null);
    const [roomImages, setRoomImages] = useState<any[]>([]);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const { user: currentUser } = useUser();
    const { room: roomApi } = useApi();

    const permissionContext = getPermissionContext(location.pathname) ?? currentUser?.userType;
    const computeEditUrl = () => {
        const hotelCtx = room?.hotel?.id ?? '';
        return getEditUrl(permissionContext, hotelCtx, 'rooms', roomId || '');
    };

    useEffect(() => {
        const fetchRoom = async () => {
            showLoader();

            if (roomId) {
                try {
                    const response = await roomApi.getRoomById(Number(roomId));
                    const roomData = response.data as RoomDto;
                    setRoom(roomData);

                    // Try to fetch room images
                    try {
                        const imagesResponse = await roomApi.getAllRoomImages(Number(roomId));
                        const images = imagesResponse.data as any[];

                        console.log("Raw room images response:", images);

                        if (images && images.length > 0) {
                            // Sort images so primary image comes first
                            const sortedImages = images.sort((a, b) => {
                                if (a.isPrimary === true) return -1;
                                if (b.isPrimary === true) return 1;
                                return 0;
                            });
                            console.log("Sorted room images:", sortedImages);
                            setRoomImages(sortedImages);
                        } else {
                            console.log(t("admin.hotels.rooms.details.noImagesFound", "No room images found"));
                        }
                    } catch (imageError) {
                        console.log(t("admin.hotels.rooms.details.noImagesFound", "No room images found"));
                        // Fallback to placeholder
                        const fallbackImage = {
                            url: "https://via.placeholder.com/600x400",
                            isPrimary: true,
                            id: null
                        };
                        setRoomImages([fallbackImage]);
                    }
                } catch (error: any) {
                    console.error("Error fetching room data:", error);

                    if (error.response?.status === 401 || error.response?.status === 403) {
                        message.error(t('common.unauthorized', 'Unauthorized access'));
                        navigate('/login');
                        return;
                    }

                    message.error(t('admin.hotels.rooms.details.fetchError', 'Failed to load room data'));
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
                    <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden min-h-[500px]">
                        <div className="md:w-1/2 relative min-h-[300px] md:min-h-full flex">
                            {roomImages.length > 0 ? (
                                <div className="w-full h-full">
                                    <UniversalSlider
                                        images={roomImages.map(img => ({
                                            url: img.url || "https://via.placeholder.com/600x400",
                                            alt: `Room ${room.roomNumber}` || 'Room Image',
                                            isPrimary: img.isPrimary
                                        }))}
                                        height="100%"
                                        autoplay={true}
                                        autoplaySpeed={4000}
                                        arrows={true}
                                        dots={true}
                                        infinite={roomImages.length > 1}
                                        className="w-full h-full"
                                        imageClassName="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <img
                                    src="https://via.placeholder.com/600x400"
                                    alt={`Room ${room.roomNumber}`}
                                    className="w-full h-full object-cover"
                                />
                            )}
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
                                <strong>{t('admin.hotels.rooms.details.type', 'Type')}:</strong> {room.roomType.name || t('admin.hotels.unknown', 'Unknown')}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.hotels.rooms.details.price', 'Price')}:</strong> {
                                    room.price !== null && room.price !== undefined
                                        ? `$${room.price.toFixed(2)}`
                                        : t('admin.hotels.unknown', 'Unknown')
                                }
                            </p>
                            {room.priceModifier && (
                                <p className="text-gray-700 mb-2">
                                    <strong>{t('admin.hotels.rooms.details.priceModifier', 'Price Modifier')}:</strong> {room.priceModifier}x
                                </p>
                            )}
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.hotels.rooms.details.capacity', 'Capacity')}:</strong> {room.capacity || t('admin.hotels.unknown', 'Unknown')}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.hotels.rooms.details.status', 'Status')}:</strong> {room.status || t('admin.hotels.unknown', 'Unknown')}
                            </p>

                            <hr className="block my-3" />
                            <button
                                onClick={() => navigate(computeEditUrl())}
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