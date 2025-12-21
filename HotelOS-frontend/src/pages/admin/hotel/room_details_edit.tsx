import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useLoading } from "../../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../contexts/UserContext";
import { UserType } from "../../../interfaces/User";
import { useApi } from "../../../api/useApi";
import { RoomDto, HotelDto, RoomDtoStatusEnum, PageHotelDto, RoomTypeDto } from "../../../api/generated/api";
import {
    Form,
    Input,
    Select,
    Button,
    Upload,
    Spin,
    Row,
    Col,
    Card,
    message,
    Space,
    InputNumber,
    Tooltip
} from "antd";
import { UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

export default function Admin_Hotel_Room_Details_Edit() {
    const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user: currentUser } = useUser();
    const [form] = Form.useForm();
    const [room, setRoom] = useState<RoomDto | null>(null);
    const [selectedHotel, setSelectedHotel] = useState<HotelDto | null>(null);
    const [hotels, setHotels] = useState<HotelDto[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomTypeDto[]>([]);
    const [hotelPage, setHotelPage] = useState(0);
    const [totalHotelPages, setTotalHotelPages] = useState(0);
    const [hotelSearchQuery, setHotelSearchQuery] = useState("");
    const [hotelLoading, setHotelLoading] = useState(false);
    const [primaryImage, setPrimaryImage] = useState<UploadFile | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const { room: roomApi, hotel: hotelApi, roomTypes: roomTypesApi } = useApi();
    const PAGE_SIZE = 10;
    const { Option } = Select;

    // Calculate price based on hotel base price, room price modifier, and room type factor
    const calculatePrice = (basePrice: number, priceModifier?: number, roomTypeFactor?: number) => {
        const modifier = priceModifier || 1;
        const typeFactor = roomTypeFactor || 1;
        const calculatedPrice = basePrice * modifier * typeFactor;
        console.log(`Price calculation: ${basePrice} × ${modifier} × ${typeFactor} = ${calculatedPrice}`);
        return calculatedPrice;
    };

    // Format room type name for display
    const formatRoomTypeName = (roomType: RoomTypeDto): string => {
        if (!roomType.name) return 'Unknown';

        // Convert from SNAKE_CASE to Title Case
        const formattedName = roomType.name
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());

        return formattedName;
    };

    // Watch for changes in price modifier or hotel selection to update calculated price
    useEffect(() => {
        const priceModifier = form.getFieldValue('priceModifier') || 1;
        const roomTypeId = form.getFieldValue('roomType');
        const selectedRoomType = roomTypes.find(rt => rt.id === roomTypeId);
        console.log(selectedHotel, priceModifier, selectedRoomType);

        if (selectedHotel?.basePrice !== undefined && priceModifier) {
            const calculatedPrice = calculatePrice(
                selectedHotel.basePrice,
                priceModifier,
                selectedRoomType?.priceFactor
            );
            form.setFieldValue('price', calculatedPrice);
        }
    }, [selectedHotel, roomTypes, form]);

    // Handle hotel selection change
    const handleHotelChange = async (hotelId: number) => {
        console.log('Hotel change detected, id:', hotelId);

        // If no change, and we already have the hotel, keep using it
        if (selectedHotel && selectedHotel.id === hotelId) {
            console.log('Hotel unchanged, using existing selected hotel:', selectedHotel);
            updatePriceCalculation(selectedHotel);
            return;
        }

        // First check if we already have the complete hotel data in our hotels array
        const selected = hotels.find(hotel => hotel.id === hotelId);

        if (selected) {
            console.log('Hotel selected from list:', selected);
            setSelectedHotel(selected);
            updatePriceCalculation(selected);
        } else {
            // If the hotel isn't in our list (rare case), fetch it directly
            try {
                const response = await hotelApi.getHotelById(hotelId);
                const hotelData = response.data as HotelDto;

                console.log('Fetched hotel details:', hotelData);
                setSelectedHotel(hotelData);
                updatePriceCalculation(hotelData);
            } catch (error) {
                console.error('Error fetching hotel details:', error);
                message.error(t('admin.hotels.rooms.edit.hotelFetchError', 'Failed to load hotel details'));
            }
        }
    };

    // Helper function to update price calculation based on hotel
    const updatePriceCalculation = (hotel: HotelDto) => {
        if (!hotel) return;

        const priceModifier = form.getFieldValue('priceModifier') || 1;
        const roomTypeId = form.getFieldValue('roomType');
        const selectedRoomType = roomTypes.find(rt => rt.id === roomTypeId);

        console.log('Updating price with hotel:', hotel.name);
        console.log('Current room type:', selectedRoomType?.name);
        console.log('Room type factor:', selectedRoomType?.priceFactor);

        const calculatedPrice = calculatePrice(
            hotel.basePrice || 0,
            priceModifier,
            selectedRoomType?.priceFactor
        );
        form.setFieldValue('price', calculatedPrice);
    };

    // Handle price modifier change
    const handlePriceModifierChange = (value: number | null) => {
        if (selectedHotel?.basePrice !== undefined) {
            const modifier = value || 1;
            const roomTypeId = form.getFieldValue('roomType');
            const selectedRoomType = roomTypes.find(rt => rt.id === roomTypeId);

            console.log('Price modifier changed:', modifier);
            console.log('Current room type factor:', selectedRoomType?.priceFactor);

            const calculatedPrice = calculatePrice(
                selectedHotel.basePrice,
                modifier,
                selectedRoomType?.priceFactor
            );
            form.setFieldValue('price', calculatedPrice);
        }
    };

    // Handle room type change
    const handleRoomTypeChange = (roomTypeId: number) => {
        if (selectedHotel?.basePrice !== undefined) {
            const priceModifier = form.getFieldValue('priceModifier') || 1;
            const selectedRoomType = roomTypes.find(rt => rt.id === roomTypeId);

            console.log('Room type changed:', selectedRoomType?.name);
            console.log('Room type factor:', selectedRoomType?.priceFactor);

            const calculatedPrice = calculatePrice(
                selectedHotel.basePrice,
                priceModifier,
                selectedRoomType?.priceFactor
            );
            form.setFieldValue('price', calculatedPrice);
        }
    };

    // Helper function to determine the correct base path
    const getBasePath = () => {
        const path = location.pathname;
        if (path.includes('/admin/')) {
            return '/admin/hotels';
        } else if (path.includes('/manager/')) {
            return '/manager/hotel';
        }
        // Default fallback based on user role
        return currentUser?.userType === UserType.ADMIN
            ? '/admin/hotels'
            : '/manager/hotel';
    };

    // Function to fetch room types - moved outside useEffect for reusability
    const fetchRoomTypes = async () => {
        try {
            const response = await roomTypesApi.getAllRoomTypes();
            const roomTypesData = response.data as RoomTypeDto[] | RoomTypeDto;
            // Handle both single item and array responses
            const roomTypesArray = Array.isArray(roomTypesData) ? roomTypesData : [roomTypesData];
            console.log('Fetched room types:', roomTypesArray);
            setRoomTypes(roomTypesArray);
        } catch (error: any) {
            console.error("Error fetching room types:", error);
            message.error(t('admin.hotels.rooms.edit.roomTypesFetchError', 'Failed to load room types'));
        }
    };

    // Pre-fetch all hotels to ensure we have complete data
    const preloadHotels = async () => {
        try {
            // Load at least 100 hotels to make sure we have most of them
            const response = await hotelApi.getAllHotels(0, 100, undefined, undefined, undefined);
            const data = response.data as PageHotelDto;

            // Ensure each hotel has a unique ID and is properly processed
            const uniqueHotels = (data.content || []).filter((hotel, index, self) =>
                hotel.id !== undefined && self.findIndex(h => h.id === hotel.id) === index
            );

            setHotels(uniqueHotels);
            console.log("Preloaded hotels:", uniqueHotels);
        } catch (error) {
            console.error("Error preloading hotels:", error);
        }
    };

    useEffect(() => {
        const fetchRoom = async () => {
            if (!roomId) return;
            showLoader();
            await preloadHotels(); // Preload hotels first
            try {
                const response = await roomApi.getRoomById(Number(roomId));
                const roomData = response.data as RoomDto;
                setRoom(roomData);

                // Set the selected hotel if it exists
                if (roomData.hotel) {
                    console.log('Setting selected hotel from room data:', roomData.hotel);

                    // First check if the hotel exists in our preloaded hotels array (most complete data)
                    const preloadedHotel = hotels.find(h => h.id === roomData.hotel?.id);
                    if (preloadedHotel) {
                        console.log('Found hotel in preloaded data:', preloadedHotel);
                        setSelectedHotel(preloadedHotel);
                    } else {
                        // Start with what we have
                        setSelectedHotel(roomData.hotel);

                        // Make sure we have a complete hotel object with all needed fields
                        if ((!roomData.hotel.basePrice || !roomData.hotel.name) && roomData.hotel.id) {
                            try {
                                console.log('Fetching complete hotel data for id:', roomData.hotel.id);
                                const hotelResponse = await hotelApi.getHotelById(roomData.hotel.id);
                                const completeHotelData = hotelResponse.data as HotelDto;
                                console.log('Fetched complete hotel data:', completeHotelData);
                                setSelectedHotel(completeHotelData);
                            } catch (error) {
                                console.error('Failed to fetch complete hotel data:', error);
                            }
                        }
                    }
                } form.setFieldsValue({
                    roomNumber: roomData.roomNumber,
                    roomType: roomData.roomType?.id, // Extract the ID from roomType object
                    description: roomData.description,
                    capacity: roomData.capacity,
                    price: roomData.price,
                    priceModifier: roomData.priceModifier,
                    status: roomData.status,
                    hotel: roomData.hotel?.id
                });

                // Calculate initial `price` if hotel and priceModifier exist
                if (roomData.hotel?.basePrice && roomData.priceModifier) {
                    const calculatedPrice = calculatePrice(
                        roomData.hotel.basePrice,
                        roomData.priceModifier,
                        roomData.roomType?.priceFactor
                    );
                    form.setFieldValue('price', calculatedPrice);
                }

                // Fetch room images (primary and additional)
                try {
                    const imagesResponse = await roomApi.getAllRoomImages(Number(roomId));
                    const images = imagesResponse.data as any[];
                    if (images && images.length > 0) {
                        // Separate primary and additional images
                        const primaryImg = images.find(img => img.isPrimary);
                        const additionalImages = images.filter(img => !img.isPrimary);

                        // Set primary image
                        if (primaryImg) {
                            setPrimaryImage({
                                uid: `primary-${primaryImg.id}`,
                                name: t("admin.hotels.edit.primaryImageName", "primary-image.jpg"),
                                status: 'done' as const,
                                url: primaryImg.url,
                                response: { id: primaryImg.id, isPrimary: true }
                            });
                        }

                        // Set additional images
                        if (additionalImages.length > 0) {
                            const additionalImagesList = additionalImages.map((img, index) => ({
                                uid: img.id?.toString() || `additional-${index}`,
                                name: t("admin.hotels.edit.additionalImageName", "room-image-{{index}}.jpg", { index: index + 1 }),
                                status: 'done' as const,
                                url: img.url,
                                response: { id: img.id, isPrimary: false }
                            }));
                            setFileList(additionalImagesList);
                        }
                    }
                } catch (error) {
                    // No images found
                }

                if (roomData.hotel?.id && !hotelId) {
                    const basePath = getBasePath();
                    navigate(`${basePath}/${roomData.hotel.id}/rooms/${roomId}/edit`, { replace: true });
                }
            } catch (error: any) {
                console.error("Error fetching room:", error);

                if (error.response?.status === 401 || error.response?.status === 403) {
                    message.error(t('common.unauthorized', 'Unauthorized access'));
                    navigate('/login');
                    return;
                }

                message.error(t('admin.hotels.rooms.edit.fetchError', 'Failed to load room data'));
            }
            hideLoader();
        };

        fetchRoom();
        fetchHotels(0, "");
        fetchRoomTypes();
    }, [roomId]);

    // Refresh room types when returning to the page (e.g., after adding a new room type)
    useEffect(() => {
        const handleFocus = () => {
            fetchRoomTypes();
        };

        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const fetchHotels = async (page: number, nameQuery: string) => {
        setHotelLoading(true);
        try {
            const response = await hotelApi.getAllHotels(
                page,
                PAGE_SIZE,
                nameQuery || undefined,
                undefined,
                undefined
            );

            const data = response.data as PageHotelDto;

            if (page === 0) {
                setHotels(data.content || []);
            } else {
                // Filter out duplicates before adding new hotels
                const newHotels = data.content || [];
                const existingIds = new Set(hotels.map(h => h.id));
                const uniqueNewHotels = newHotels.filter(hotel => !existingIds.has(hotel.id));

                setHotels(prev => [...prev, ...uniqueNewHotels]);
            }

            setHotelPage(data.number || 0);
            setTotalHotelPages(data.totalPages || 0);
        } catch (error: any) {
            console.error("Error fetching hotels:", error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                message.error(t('common.unauthorized', 'Unauthorized access'));
                navigate('/login');
                return;
            }

            message.error(t('admin.hotels.rooms.edit.hotelFetchError', 'Failed to load hotels'));
        }
        setHotelLoading(false);
    };

    // Track the last scroll position to prevent duplicate triggers
    const [lastScrollPosition, setLastScrollPosition] = useState(0);

    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const currentPosition = target.scrollTop;

        // Only trigger if we're close to the bottom and not the same as last position
        if (Math.abs(currentPosition - lastScrollPosition) > 10 &&
            target.scrollHeight - (target.scrollTop + target.offsetHeight) < 20 &&
            hotelPage < totalHotelPages - 1 &&
            !hotelLoading) {

            setLastScrollPosition(currentPosition);
            console.log(`Loading more hotels on scroll. Page: ${hotelPage + 1}`);
            fetchHotels(hotelPage + 1, hotelSearchQuery);
        }
    };

    const handleHotelSearch = (value: string) => {
        setHotelSearchQuery(value);
        fetchHotels(0, value);
    };

    // Primary image upload props
    const primaryImageUploadProps: UploadProps = {
        onRemove: async (file) => {
            if (file.url && file.response?.id) {
                try {
                    await roomApi.deleteRoomImage(Number(roomId), file.response.id);
                    message.success(t("admin.hotels.edit.imageDeleteSuccess", "Primary image deleted successfully"));
                    setPrimaryImage(null);
                } catch (error) {
                    message.error(t("admin.hotels.edit.imageDeleteError", "Failed to delete primary image"));
                    return false;
                }
            } else {
                setPrimaryImage(null);
            }
        },
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error(t("admin.hotels.edit.imageTypeError", "You can only upload image files!"));
                return Upload.LIST_IGNORE;
            }
            const isLessThan5MB = file.size / 1024 / 1024 < 5;
            if (!isLessThan5MB) {
                message.error(t("admin.hotels.edit.imageSizeError", "Image must be smaller than 5MB!"));
                return Upload.LIST_IGNORE;
            }
            setPrimaryImage({
                uid: `primary-${Date.now()}`,
                name: file.name,
                status: 'uploading',
                originFileObj: file,
            });
            return false;
        },
        fileList: primaryImage ? [primaryImage] : [],
        maxCount: 1,
        listType: "picture-card",
    };

    // Additional images upload props
    const uploadProps: UploadProps = {
        onRemove: async (file) => {
            if (file.url && file.response?.id) {
                try {
                    await roomApi.deleteRoomImage(Number(roomId), file.response.id);
                    message.success(t("admin.hotels.edit.imageDeleteSuccess", "Image deleted successfully"));
                } catch (error) {
                    message.error(t("admin.hotels.edit.imageDeleteError", "Failed to delete image"));
                    return false;
                }
            }
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error(t("admin.hotels.edit.imageTypeError", "You can only upload image files!"));
                return Upload.LIST_IGNORE;
            }
            const isLessThan5MB = file.size / 1024 / 1024 < 5;
            if (!isLessThan5MB) {
                message.error(t("admin.hotels.edit.imageSizeError", "Image must be smaller than 5MB!"));
                return Upload.LIST_IGNORE;
            }
            setFileList(prevList => [...prevList, {
                uid: `${Date.now()}-${Math.random()}`,
                name: file.name,
                status: 'uploading',
                originFileObj: file,
            }]);
            return false;
        },
        fileList,
        multiple: true,
        listType: "picture-card",
        maxCount: 9,
    };

    const onFinish = async (values: any) => {
        console.log("Form submitted", values);
        console.log("Current selected hotel:", selectedHotel);
        console.log("Available hotels:", hotels);
        if (!roomId) return;
        setLoading(true);
        showLoader();
        try {
            // Find the selected room type
            const selectedRoomType = roomTypes.find(rt => rt.id === values.roomType);
            if (!selectedRoomType) {
                message.error(t('admin.hotels.rooms.edit.roomTypeError', 'Invalid room type selected'));
                setLoading(false);
                hideLoader();
                return;
            }

            // Get the proper hotel object
            const hotelValue = Number(values.hotel || hotelId);

            // Try different approaches to get the complete hotel object
            let hotelObject = null;

            // If hotel hasn't changed, use the original room's hotel
            if (room && room.hotel && room.hotel.id === hotelValue) {
                console.log('Using original room\'s hotel (no change detected):', room.hotel);
                hotelObject = room.hotel;
            }
            // Try selectedHotel if available and matching
            else if (selectedHotel && selectedHotel.id === hotelValue) {
                console.log('Using selected hotel from state:', selectedHotel);
                hotelObject = selectedHotel;
            }
            // Try to find in the hotels list
            else {
                const foundHotel = hotels.find(h => h.id === hotelValue);
                if (foundHotel) {
                    console.log('Found hotel in hotels list:', foundHotel);
                    hotelObject = foundHotel;
                }
            }

            // Final fallback - try to fetch the hotel directly if we couldn't find it
            if (!hotelObject) {
                try {
                    console.log('Attempting to fetch hotel directly:', hotelValue);
                    const hotelResponse = await hotelApi.getHotelById(hotelValue);
                    hotelObject = hotelResponse.data as HotelDto;
                    console.log('Fetched hotel directly:', hotelObject);
                } catch (error) {
                    console.error('Failed to fetch hotel:', error);
                }
            }

            if (!hotelObject) {
                message.error(t('admin.hotels.rooms.edit.hotelError', 'Hotel information is missing'));
                setLoading(false);
                hideLoader();
                return;
            }

            console.log('Using hotel for update:', hotelObject);            // Create the RoomDto object from form values
            const roomDto: RoomDto = {
                roomId: Number(roomId),
                roomNumber: Number(values.roomNumber),
                roomType: selectedRoomType, // Use the full RoomTypeDto object
                description: values.description,
                capacity: Number(values.capacity),
                price: Number(values.price),
                priceModifier: values.priceModifier ? Number(values.priceModifier) : undefined,
                status: values.status,
                hotel: hotelObject // Use the complete hotel object
            };

            // Log the room DTO we're sending to the API
            console.log('Sending room data to API:', JSON.stringify(roomDto, null, 2));

            // Update room using the API
            await roomApi.updateRoom(Number(roomId), roomDto);

            // Handle primary image upload
            if (primaryImage && !primaryImage.url) {
                const primaryFile = primaryImage.originFileObj as File;
                if (primaryFile) {
                    try {
                        await roomApi.uploadPrimaryRoomImage(Number(roomId), primaryFile);
                        message.success(t("admin.hotels.edit.primaryImageUploadSuccess", "Primary image uploaded successfully"));
                    } catch (imageError) {
                        message.warning(t("admin.hotels.edit.primaryImageUploadError", "Room updated but failed to upload primary image"));
                    }
                }
            }

            // Handle additional images upload
            const newImages = fileList.filter(file => !file.url);
            if (newImages.length > 0) {
                const files = newImages.map(file => file.originFileObj as File).filter(file => file !== undefined);
                if (files.length > 0) {
                    try {
                        await roomApi.uploadMultipleRoomImages(Number(roomId), files);
                        message.success(t("admin.hotels.edit.imageUploadSuccess", `${files.length} additional image(s) uploaded successfully`));
                    } catch (imageError) {
                        message.warning(t("admin.hotels.edit.imageUploadPartialError", "Room updated but failed to upload some additional images"));
                    }
                }
            }

            message.success(t('admin.hotels.rooms.edit.updateSuccess', 'Room updated successfully'));

            // Use path-aware navigation
            const basePath = getBasePath();
            navigate(`${basePath}/${values.hotel || hotelId}/rooms`);
        } catch (error: any) {
            console.error("Error updating room:", error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                message.error(t('common.unauthorized', 'Unauthorized access'));
                navigate('/login');
                setLoading(false);
                hideLoader();
                return;
            }

            message.error(t('admin.hotels.rooms.edit.updateError', 'Failed to update room'));
        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    const formInitialValues = room ? {
        ...room,
        hotel: room.hotel?.id || room.hotel?.id
    } : {};

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div style={{ marginTop: '5rem', padding: '20px' }}>
                <Card
                    title={t('admin.hotels.rooms.edit.title', 'Edit Room')}
                    variant="outlined"
                    style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={formInitialValues}
                    >
                        {room ? (
                            <>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="roomNumber"
                                            label={t('admin.hotels.rooms.fields.roomNumber', 'Room Number')}
                                            rules={[{ required: true, message: t('admin.hotels.rooms.validation.roomNumberRequired', 'Please input room number!') }]}
                                        >
                                            <InputNumber style={{ width: '100%' }} min={1} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="roomType"
                                            label={
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span>{t('admin.hotels.rooms.fields.type', 'Room Type')}</span>
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        onClick={() => {
                                                            const basePath = getBasePath();
                                                            const currentPath = location.pathname;
                                                            navigate(`${basePath}/${hotelId}/room-types/add?returnTo=${encodeURIComponent(currentPath)}`);
                                                        }}
                                                        style={{
                                                            padding: '0 4px',
                                                            height: 'auto',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        + {t('admin.hotels.rooms.addRoomType', 'Add Room Type')}
                                                    </Button>
                                                </div>
                                            }
                                            rules={[{ required: true, message: t('admin.hotels.rooms.validation.typeRequired', 'Please select room type!') }]}
                                        >
                                            <Select
                                                placeholder={t('admin.hotels.rooms.selectRoomType', 'Select a room type')}
                                                onChange={handleRoomTypeChange}
                                            >
                                                {roomTypes.map((roomType, index) => (
                                                    <Option key={`roomType-${roomType.id}-${index}`} value={roomType.id}>
                                                        <Tooltip title={`Price factor: ${roomType.priceFactor || 1}x`}>
                                                            <span>
                                                                {formatRoomTypeName(roomType)}
                                                                {roomType.priceFactor ?
                                                                    <span style={{ color: '#1890ff', marginLeft: 8 }}>
                                                                        ({roomType.priceFactor}x)
                                                                    </span>
                                                                    : null}
                                                            </span>
                                                        </Tooltip>
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="capacity"
                                            label={t('admin.hotels.rooms.fields.capacity', 'Capacity')}
                                            rules={[{ required: true, message: t('admin.hotels.rooms.validation.capacityRequired', 'Please input capacity!') }]}
                                        >
                                            <InputNumber style={{ width: '100%' }} min={1} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="price"
                                            label={
                                                <span>
                                                    {t('admin.hotels.rooms.fields.price', 'Price')}
                                                    <Tooltip title={t('admin.hotels.rooms.fields.priceTooltip', 'Final price = Hotel Base Price × Price Modifier × Room Type Factor')}>
                                                        <InfoCircleOutlined style={{ marginLeft: 8 }} />
                                                    </Tooltip>
                                                </span>
                                            }
                                        >
                                            <InputNumber
                                                prefix="$"
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: '#f5f5f5',
                                                    color: '#262626'
                                                }}
                                                readOnly
                                                precision={2}
                                                formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0.00'}
                                            />
                                        </Form.Item>
                                        {selectedHotel && (
                                            <div style={{
                                                marginTop: '-16px',
                                                marginBottom: '16px',
                                                fontSize: '12px',
                                                color: '#8c8c8c'
                                            }}>
                                                <div className="price-calculation-formula" style={{ border: '1px solid #f0f0f0', padding: '8px', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                        <span>Hotel Base Price:</span>
                                                        <span>${selectedHotel.basePrice?.toFixed(2) || '0.00'}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                        <span>Room Price Modifier:</span>
                                                        <span>{form.getFieldValue('priceModifier') || 1}x</span>
                                                    </div>
                                                    {(() => {
                                                        const roomTypeId = form.getFieldValue('roomType');
                                                        const selectedRoomType = roomTypes.find(rt => rt.id === roomTypeId);
                                                        return (
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                                <span>Room Type Factor:</span>
                                                                <span>{selectedRoomType?.priceFactor || 1}x</span>
                                                            </div>
                                                        );
                                                    })()}
                                                    <div style={{ borderTop: '1px dashed #d9d9d9', paddingTop: '4px', marginTop: '4px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>Final Price:</span>
                                                        <span>${form.getFieldValue('price')?.toFixed(2) || '0.00'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="priceModifier"
                                            label={
                                                <span>
                                                    {t('admin.hotels.rooms.fields.priceModifier', 'Price Modifier')}
                                                    <Tooltip title={t('admin.hotels.rooms.fields.priceModifierTooltip', 'Adjust room price relative to hotel base price. E.g., 1.2 means 20% more than base price.')}>
                                                        <InfoCircleOutlined style={{ marginLeft: 8 }} />
                                                    </Tooltip>
                                                </span>
                                            }
                                        >
                                            <InputNumber
                                                style={{ width: '100%' }}
                                                min={0.1}
                                                step={0.1}
                                                precision={2}
                                                placeholder="e.g., 1.2 for 20% increase"
                                                onChange={handlePriceModifierChange}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="status"
                                            label={t('admin.hotels.rooms.fields.status', 'Status')}
                                            rules={[{ required: true, message: t('admin.hotels.rooms.validation.statusRequired', 'Please select status!') }]}
                                        >
                                            <Select>
                                                <Option key="status-available" value={RoomDtoStatusEnum.Available}>{t('admin.hotels.rooms.status.available', 'Available')}</Option>
                                                <Option key="status-reserved" value={RoomDtoStatusEnum.Reserved}>{t('admin.hotels.rooms.status.reserved', 'Reserved')}</Option>
                                                <Option key="status-occupied" value={RoomDtoStatusEnum.Occupied}>{t('admin.hotels.rooms.status.occupied', 'Occupied')}</Option>
                                                <Option key="status-maintenance" value={RoomDtoStatusEnum.Maintenance}>{t('admin.hotels.rooms.status.maintenance', 'Under Maintenance')}</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="hotel"
                                            label={t('admin.hotels.rooms.fields.hotel', 'Hotel')}
                                            rules={[{ required: true, message: t('admin.hotels.rooms.validation.hotelRequired', 'Please select a hotel!') }]}
                                        >
                                            <Select
                                                showSearch
                                                placeholder={t('admin.hotels.rooms.selectHotel', 'Select a hotel')}
                                                loading={hotelLoading}
                                                filterOption={false}
                                                onSearch={handleHotelSearch}
                                                onPopupScroll={handlePopupScroll}
                                                onChange={handleHotelChange}
                                                notFoundContent={hotelLoading ? <Spin size="small" /> : t('admin.hotels.rooms.noHotelsFound', 'No hotels found')}
                                            >
                                                {hotels.map((hotel, index) => (
                                                    <Option key={`hotel-${hotel.id}-${index}`} value={hotel.id}>
                                                        {hotel.name} ({hotel.addressInformation?.city}, {hotel.addressInformation?.country})
                                                        {hotel.basePrice ?
                                                            <span style={{ color: '#1890ff', marginLeft: 8 }}>
                                                                ${hotel.basePrice.toFixed(2)}
                                                            </span>
                                                            : null}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="description"
                                            label={t('admin.hotels.rooms.fields.description', 'Description')}
                                        >
                                            <Input.TextArea rows={3} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label={t('admin.hotels.fields.primaryImage', 'Primary Image')}
                                    name="primaryImage"
                                    extra={t('admin.hotels.edit.primaryImageHint', 'Upload the main room image that will be displayed as primary (max 5MB).')}
                                >
                                    <Upload {...primaryImageUploadProps}>
                                        {!primaryImage ? (
                                            <div style={{
                                                width: 104,
                                                height: 104,
                                                border: '2px dashed #1890ff',
                                                borderRadius: 6,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'border-color 0.3s',
                                                backgroundColor: '#f6ffed'
                                            }}>
                                                <UploadOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                                                <div style={{ marginTop: 8, color: '#1890ff', fontSize: 12, fontWeight: 500 }}>
                                                    {t('admin.hotels.edit.selectPrimaryImage', 'Primary Image')}
                                                </div>
                                            </div>
                                        ) : null}
                                    </Upload>
                                </Form.Item>

                                <Form.Item
                                    label={t('admin.hotels.fields.additionalImages', 'Additional Images')}
                                    name="additionalImages"
                                    extra={t('admin.hotels.edit.additionalImagesHint', 'Upload additional room images for gallery (max 5MB each, max 9 images). Currently: {{count}} additional image(s).', { count: fileList.length })}
                                >
                                    <Upload {...uploadProps}>
                                        {fileList.length >= 9 ? null : (
                                            <div style={{
                                                width: 104,
                                                height: 104,
                                                border: '1px dashed #d9d9d9',
                                                borderRadius: 6,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'border-color 0.3s',
                                                backgroundColor: '#fafafa'
                                            }}>
                                                <UploadOutlined style={{ fontSize: 24, color: '#999' }} />
                                                <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                                                    {t('admin.hotels.edit.selectAdditionalImages', 'Add More')}
                                                </div>
                                            </div>
                                        )}
                                    </Upload>
                                </Form.Item>

                                <Form.Item>
                                    <Space>
                                        <Button type="primary" htmlType="submit" loading={loading}>
                                            {t('general.save', 'Save Changes')}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                const basePath = getBasePath();
                                                navigate(`${basePath}/${hotelId || room.hotel?.id}/rooms`);
                                            }}
                                        >
                                            {t('general.cancel', 'Cancel')}
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Spin size="large" />
                                <p style={{ marginTop: '10px' }}>{t('admin.hotels.rooms.loading', 'Loading room data...')}</p>
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </div>
    );
}