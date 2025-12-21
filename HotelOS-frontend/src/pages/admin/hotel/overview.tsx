import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { HotelDto } from "../../../api/generated/api";
import { useLoading } from "../../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";
import { useApi } from "../../../api/useApi";
import { UniversalSlider } from "../../../components/UniversalSlider";
import { message } from "antd";

export default function Admin_Hotel_overview() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState<HotelDto | null>(null);
    const [hotelImages, setHotelImages] = useState<any[]>([]);
    // Responsive slider height to ensure proper image placement
    const [sliderHeight, setSliderHeight] = useState<number>(360);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const { hotel: hotelApi } = useApi();

    useEffect(() => {
        const fetchHotel = async () => {
            showLoader();
            if (id) {
                try {
                    const response = await hotelApi.getHotelById(Number(id));
                    const hotelData = response.data as HotelDto;
                    setHotel(hotelData);

                    // Try to fetch hotel images
                    try {
                        const imagesResponse = await hotelApi.getAllHotelImages(Number(id));
                        const images = imagesResponse.data as any[];

                        console.log("Raw images response:", images);

                        if (images && images.length > 0) {
                            // Sort images so primary image comes first
                            const sortedImages = images.sort((a, b) => {
                                if (a.isPrimary === true) return -1;
                                if (b.isPrimary === true) return 1;
                                return 0;
                            });
                            console.log("Sorted images:", sortedImages);
                            setHotelImages(sortedImages);
                        } else {
                            console.log(t("admin.hotels.overview.noImagesFound", "No hotel images found"));
                        }
                    } catch (imageError) {
                        console.log(t("admin.hotels.overview.noImagesFound", "No hotel images found"));
                        // Fallback to placeholder
                        const fallbackImage = {
                            url: "https://via.placeholder.com/600x400",
                            isPrimary: true,
                            id: null
                        };
                        setHotelImages([fallbackImage]);
                    }
                } catch (error: any) {
                    console.error(t("admin.hotels.overview.fetchErrorLog", "Error fetching hotel:"), error);

                    if (error.response?.status === 401 || error.response?.status === 403) {
                        message.error(t("common.unauthorized", "Unauthorized access"));
                        navigate("/login");
                        return;
                    }

                    message.error(t("admin.hotels.overview.fetchError", "Failed to load hotel data"));
                }
            }
            hideLoader();
        };

        fetchHotel();
    }, [id]);

    // Adjust slider height based on viewport to avoid extra whitespace
    useEffect(() => {
        const updateHeight = () => {
            const w = window.innerWidth;
            if (w >= 1280) setSliderHeight(460);
            else if (w >= 1024) setSliderHeight(420);
            else if (w >= 768) setSliderHeight(380);
            else setSliderHeight(320);
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="container mt-20 mx-auto py-8 px-4">
                {hotel ? (
                    <div className="flex flex-col md:flex-row items-start gap-4 bg-white shadow-md rounded-lg overflow-hidden p-4">
                        {/* Left: Images */}
                        <div className="md:w-1/2 relative rounded-lg overflow-hidden border border-gray-200">
                            {hotelImages.length > 0 ? (
                                <div className="w-full h-full">
                                    <UniversalSlider
                                        images={hotelImages.map(img => ({
                                            url: img.url || "https://via.placeholder.com/600x400",
                                            alt: hotel.name || 'Hotel Image',
                                            isPrimary: img.isPrimary
                                        }))}
                                        height={sliderHeight}
                                        autoplay={true}
                                        autoplaySpeed={4000}
                                        arrows={true}
                                        dots={true}
                                        infinite={hotelImages.length > 1}
                                        className="w-full h-full"
                                        imageClassName="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <img
                                    src="https://via.placeholder.com/600x400"
                                    alt={hotel.name}
                                    className="w-full object-cover"
                                    style={{ height: sliderHeight }}
                                />
                            )}
                        </div>
                        {/* Right: Details */}
                        <div className="md:w-1/2 p-4 md:p-6 flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-3">
                                <h1 className="text-2xl font-bold leading-tight">{hotel.name}</h1>
                                <span className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                    <span className="opacity-80">#</span>{hotel.id ?? t("admin.hotels.overview.unknown", "Unknown")}
                                </span>
                            </div>

                            {/* Pricing */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{t("admin.hotels.fields.basePrice", "Base Price")}:</span>
                                <span className="text-lg font-semibold text-emerald-600">${hotel.basePrice ?? '—'}</span>
                            </div>

                            {/* Address & Location */}
                            <div>
                                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{t("admin.hotels.overview.location", "Location")}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                                        <div className="text-xs uppercase text-gray-500">{t("admin.hotels.fields.country", "Country")}</div>
                                        <div className="text-gray-800">{hotel.addressInformation?.country || t("admin.hotels.overview.unknown", "Unknown")}</div>
                                    </div>
                                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                                        <div className="text-xs uppercase text-gray-500">{t("admin.hotels.fields.state", "State")}</div>
                                        <div className="text-gray-800">{hotel.addressInformation?.state || t("admin.hotels.overview.unknown", "Unknown")}</div>
                                    </div>
                                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                                        <div className="text-xs uppercase text-gray-500">{t("admin.hotels.fields.city", "City")}</div>
                                        <div className="text-gray-800">{hotel.addressInformation?.city || t("admin.hotels.overview.unknown", "Unknown")}</div>
                                    </div>
                                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 sm:col-span-2">
                                        <div className="text-xs uppercase text-gray-500">{t("admin.hotels.fields.address", "Address")}</div>
                                        <div className="text-gray-800">{hotel.addressInformation?.address || t("admin.hotels.overview.unknown", "Unknown")}</div>
                                    </div>
                                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                                        <div className="text-xs uppercase text-gray-500">{t("admin.hotels.fields.zipCode", "Zip-code")}</div>
                                        <div className="text-gray-800">{hotel.addressInformation?.zipCode || t("admin.hotels.overview.unknown", "Unknown")}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact */}
                            <div>
                                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{t("admin.hotels.overview.contact", "Contact")}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <a
                                        href={hotel.contactInformation?.email ? `mailto:${hotel.contactInformation.email}` : undefined}
                                        className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 transition-colors"
                                    >
                                        <div className="text-xs uppercase text-gray-500">{t("admin.hotels.fields.email", "Email")}</div>
                                        <div className="text-blue-700 break-all">{hotel.contactInformation?.email || t("admin.hotels.overview.unknown", "Unknown")}</div>
                                    </a>
                                    <a
                                        href={hotel.contactInformation?.phoneNumber ? `tel:${hotel.contactInformation.phoneNumber}` : undefined}
                                        className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 transition-colors"
                                    >
                                        <div className="text-xs uppercase text-gray-500">{t("admin.hotels.fields.phoneNumber", "Phone Number")}</div>
                                        <div className="text-blue-700">{hotel.contactInformation?.phoneNumber || t("admin.hotels.overview.unknown", "Unknown")}</div>
                                    </a>
                                </div>
                            </div>

                            {/* Description */}
                            {hotel.description && (
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{t("admin.hotels.fields.description", "Description")}</h2>
                                    <p className="text-gray-700 leading-relaxed bg-gray-50 border border-gray-200 rounded-lg p-3">{hotel.description}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-2 pt-3 border-t border-gray-200 flex flex-wrap gap-2">
                                <button
                                    onClick={() => navigate("/admin/hotels/" + hotel.id + "/edit")}
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                >
                                    ✏️ {t("admin.hotels.editHotel", "Edit Hotel")}
                                </button>
                                <button
                                    onClick={() => navigate("/admin/hotels/" + hotel.id + "/rooms")}
                                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 border border-gray-300 transition-colors"
                                >
                                    🛏️ {t("admin.hotels.seeRooms", "See Rooms")}
                                </button>
                                <button
                                    onClick={() => navigate("/admin/hotels/" + hotel.id + "/reservations")}
                                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 border border-gray-300 transition-colors"
                                >
                                    📅 {t("admin.hotels.seeReservations", "See Reservations")}
                                </button>
                                <button
                                    onClick={() => navigate("/admin/hotels/" + hotel.id + "/users")}
                                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 border border-gray-300 transition-colors"
                                >
                                    👥 {t("admin.hotels.seeEmployees", "See Employees")}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white shadow-md rounded-lg p-6 animate-pulse">
                            <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="h-64 bg-gray-200 rounded" />
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                                    <div className="h-10 bg-gray-200 rounded mt-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}