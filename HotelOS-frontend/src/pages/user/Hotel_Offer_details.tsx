import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    CircularProgress,
    Chip,
    Alert,
    SelectChangeEvent,
    Paper,
    Tabs,
    Tab,
    useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getAmenityTypeIcon } from '../../components/hotel/AmenityIcons';
import AmenityItem from '../../components/hotel/AmenityItem';
import ContactInfo from '../../components/hotel/ContactInfo';
import { getLocationString, getRoomImageUrl } from '../../components/hotel/HotelUtils';
import ReservationForm from '../../components/hotel/ReservationForm';
import RoomDetailsDialog from '../../components/hotel/RoomDetailsDialog';
import RoomOptions from '../../components/hotel/RoomOptions';
import { UniversalSlider } from '../../components/UniversalSlider';
import { useLoading } from '../../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../api/useApi';
import { HotelOfferDto, RoomDto } from '../../api/generated/api';

const HotelDetails: React.FC = () => {
    const { hotelId, hotelName } = useParams<{ hotelId: string; hotelName: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { showLoader, hideLoader, isLoading } = useLoading();
    const { hotel: hotelApi } = useApi();

    const [hotel, setHotel] = useState<HotelOfferDto | null>(null);
    const [hotelImages, setHotelImages] = useState<any[]>([]);
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
    const [guests, setGuests] = useState<number>(1);
    const [selectedRoom, setSelectedRoom] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<number>(0);
    const [selectedRoomDetails, setSelectedRoomDetails] = useState<RoomDto | null>(null);
    const [showRoomDetails, setShowRoomDetails] = useState<boolean>(false);
    const [showContact, setShowContact] = useState<boolean>(false);
    const [isRoomsLoading, setIsRoomsLoading] = useState<boolean>(false);

    const theme = useTheme();

    useEffect(() => {
        const fetchHotelDetails = async () => {
            if (!hotelId) return;

            console.log('Hotel ID from URL:', hotelId);
            console.log('Hotel Name from URL:', hotelName);

            showLoader();
            try {
                const response = await hotelApi.getHotelWithOffers(Number(hotelId));
                const hotelData = response.data as HotelOfferDto;
                console.log('Hotel data received:', hotelData);

                setHotel(hotelData);

                try {
                    const imagesResponse = await hotelApi.getAllHotelImages(Number(hotelId));
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
                        console.log(t("hotelDetails.noImagesFound", "No hotel images found"));
                        // Fallback to placeholder
                        const fallbackImage = {
                            url: "https://via.placeholder.com/1200x500?text=Hotel+Image",
                            isPrimary: true,
                            id: null
                        };
                        setHotelImages([fallbackImage]);
                    }
                } catch (imageError) {
                    console.log(t("hotelDetails.noImagesFound", "No hotel images found"));
                    // Fallback to placeholder
                    const fallbackImage = {
                        url: "https://via.placeholder.com/1200x500?text=Hotel+Image",
                        isPrimary: true,
                        id: null
                    };
                    setHotelImages([fallbackImage]);
                }

                document.title = `${hotelData.name} - HotelOS`;
            } catch (error: any) {
                console.error('Error fetching hotel details:', error);

                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.log('Authentication issue. Redirecting to login page...');
                    window.location.href = '/login';
                    return;
                }

                setError(t('hotelDetails.loadError'));
            } finally {
                hideLoader();
            }
        };

        fetchHotelDetails();
    }, [hotelId]);

    const toDateOnly = (date: Date | null) => {
        if (!date) return undefined;
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`; // Local date without timezone shift
    };

    useEffect(() => {
        const fetchOffersForDates = async () => {
            if (!hotelId || !checkInDate || !checkOutDate) return;

            // Avoid firing requests with an invalid range (check-out before/equals check-in),
            // which would return all rooms and momentarily show reserved rooms as free.
            if (checkOutDate <= checkInDate) return;

            setIsRoomsLoading(true);
            try {
                const response = await hotelApi.getHotelWithOffers(
                    Number(hotelId),
                    toDateOnly(checkInDate),
                    toDateOnly(checkOutDate)
                );
                const hotelData = response.data as HotelOfferDto;
                setHotel(hotelData);
            } catch (e) {
                console.error('Error fetching offers for selected dates:', e);
            } finally {
                setIsRoomsLoading(false);
            }
        };

        fetchOffersForDates();
    }, [hotelId, checkInDate, checkOutDate]);

    const handleGuestsChange = (event: SelectChangeEvent) => {
        setGuests(Number(event.target.value));
    };

    const handleRoomChange = (event: SelectChangeEvent) => {
        setSelectedRoom(event.target.value);
    };

    const handleBooking = () => {
        if (!checkInDate || !checkOutDate) {
            setError(t('hotelDetails.selectValidDates'));
            return;
        }

        if (!selectedRoom) {
            setError(t('hotelDetails.selectRoom'));
            return;
        }

        setError(''); // Clear any previous errors

        // Navigate to booking page with parameters
        navigate(`/book/${hotelId}/${selectedRoom}`, {
            state: {
                checkInDate: toDateOnly(checkInDate),
                checkOutDate: toDateOnly(checkOutDate),
                guests
            }
        });
    };

    // Create available rooms array from hotel room sources
    const hasDates = Boolean(checkInDate && checkOutDate);

    const availableRooms = React.useMemo(() => {
        if (!hasDates) return [] as RoomDto[];
        // Start with an empty array of RoomDto
        let allRooms: RoomDto[] = [];

        // Add rooms from cheapestRoomByTypeList if they exist
        if (hotel?.cheapestRoomByTypeList) {
            hotel.cheapestRoomByTypeList.forEach(item => {
                const r = item.room;
                if (r && !allRooms.some(existingRoom => existingRoom.roomId === r.roomId)) {
                    allRooms.push(r);
                }
            });
        }

        // Add cheapestRoom if it exists and isn't already in the array
        if (hotel?.cheapestRoom && !allRooms.some(existingRoom => existingRoom.roomId === hotel.cheapestRoom!.roomId)) {
            allRooms.push(hotel.cheapestRoom);
        }

        // Filter for available rooms that meet capacity requirements
        return allRooms.filter(room =>
            room.status === 'AVAILABLE' && (room.capacity || 1) >= guests
        );
    }, [hotel, guests, hasDates]);

    // Using the imported getAmenityIcon function from AmenityIcons.tsx

    // Handle tab change
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    // Handle room details view
    const handleRoomDetailsView = (room: RoomDto) => {
        setSelectedRoomDetails(room);
        setShowRoomDetails(true);
    };

    // Close room details view
    const handleCloseRoomDetails = () => {
        setShowRoomDetails(false);
        setSelectedRoomDetails(null);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!hotel) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h6" align="center">
                    {t('hotelDetails.notFound')}
                </Typography>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button variant="contained" onClick={() => navigate('/explore')}>
                        {t('hotelDetails.backToExplore')}
                    </Button>
                </Box>
            </Container>
        );
    }

    // Helper to normalize and translate room type labels (handles stringified DTOs)
    const normalizeRoomTypeLabel = (name?: string): string => {
        if (!name) return t('hotelDetails.unknownType', { defaultValue: 'Unknown type' });
        const key = name.toLowerCase().replace(/\s+/g, '_');
        return t(`roomTypes.${key}`, { defaultValue: name.replace(/_/g, ' ') });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 pt-24 scroll-smooth">
            {/* Header spacer to ensure proper positioning of sticky elements */}
            <Box
                sx={{
                    height: { xs: '60px', md: '80px' },
                    width: '100%',
                    position: 'relative',
                    zIndex: 0
                }}
                id="header-spacer"
            />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Navigation Header */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/explore')}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            borderRadius: 8,
                            px: 2,
                            textTransform: 'none',
                            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        {t('hotelDetails.backToExplore')}
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Hero Section */}
                <Card
                    elevation={4}
                    sx={{
                        mb: 4,
                        borderRadius: 3,
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    {hotelImages.length > 0 ? (
                        <UniversalSlider
                            images={hotelImages.map(img => ({
                                url: img.url,
                                alt: hotel?.name || 'Hotel Image',
                                isPrimary: img.isPrimary
                            }))}
                            height={500}
                            autoplay={true}
                            autoplaySpeed={4000}
                            arrows={true}
                            dots={true}
                            infinite={hotelImages.length > 1}
                            renderOverlay={(_image, _index) => (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                        p: 4,
                                        color: 'white'
                                    }}
                                >
                                    <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                                        {hotel?.name}
                                    </Typography>
                                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                        {hotel && getLocationString({
                                            addressInformation: hotel.addressInformation
                                        } as any)}
                                    </Typography>
                                </Box>
                            )}
                        />
                    ) : (
                        <CardMedia
                            component="img"
                            height="500"
                            image="https://via.placeholder.com/1200x500?text=Hotel+Image"
                            alt={hotel?.name || 'Hotel Image'}
                            sx={{
                                objectFit: 'cover',
                                objectPosition: 'center'
                            }}
                        />
                    )}
                </Card>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                        gap: { xs: 2, md: 4 },
                        position: 'relative',
                        alignItems: 'start' // This ensures items align at the top of the grid
                    }}
                >
                    {/* Left Column - Hotel Details */}
                    <Box>
                        {/* Tabs for different sections */}
                        <Paper elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                indicatorColor="primary"
                                textColor="primary"
                                sx={{
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    background: theme.palette.background.paper,
                                }}
                            >
                                <Tab label={t('hotelDetails.tabs.overview')} />
                                <Tab label={t('hotelDetails.tabs.amenities')} />
                                <Tab label={t('hotelDetails.tabs.rooms')} />
                            </Tabs>

                            {/* Tab Content */}
                            <Box sx={{ p: 3 }}>
                                {/* Overview Tab */}
                                {activeTab === 0 && (
                                    <>
                                        <Typography variant="h5" gutterBottom>
                                            {t('hotelDetails.aboutHotel', { hotelName: hotel.name })}
                                        </Typography>
                                        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                                            {t('hotelDetails.welcomeMessage', {
                                                hotelName: hotel.name,
                                                city: hotel.addressInformation?.city
                                            })}
                                        </Typography>

                                        <Typography variant="h6" gutterBottom>
                                            {t('hotelDetails.address')}
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            {hotel.addressInformation?.address}
                                        </Typography>

                                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                            {t('hotelDetails.location')}
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            {hotel.addressInformation?.city},
                                            {hotel.addressInformation?.state && ` ${hotel.addressInformation.state}`}
                                            {hotel.addressInformation?.zipCode && ` ${hotel.addressInformation.zipCode}`}
                                            {hotel.addressInformation?.country &&
                                                `, ${hotel.addressInformation.country}`}
                                        </Typography>

                                        {/* Room Type Availability (only after dates) */}
                                        {hasDates && hotel.roomTypeCountAvailableList && hotel.roomTypeCountAvailableList.length > 0 && (
                                            <Box sx={{ mt: 3 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    {t('hotelDetails.roomAvailability')}
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                    {hotel.roomTypeCountAvailableList.map((roomTypeInfo, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={`${normalizeRoomTypeLabel(roomTypeInfo.roomType?.name)}: ${roomTypeInfo.count ?? 0} ${t('hotelDetails.available')}`}
                                                            color={typeof roomTypeInfo.count === 'number' && roomTypeInfo.count > 0 ? "success" : "default"}
                                                            variant="outlined"
                                                            sx={{ fontWeight: typeof roomTypeInfo.count === 'number' && roomTypeInfo.count > 0 ? 'bold' : 'normal' }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}

                                        {/* Best Value Room */}
                                        {hasDates && hotel.cheapestRoom && (
                                            <Box sx={{ mt: 3, mb: 4 }}>
                                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {t('hotelDetails.bestValueRoom')}
                                                    <Chip
                                                        label={t('hotelDetails.lowestPrice')}
                                                        size="small"
                                                        color="success"
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                </Typography>
                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        transition: 'all 0.3s',
                                                        '&:hover': {
                                                            transform: 'translateY(-8px)',
                                                            boxShadow: 4
                                                        },
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        borderRadius: 2,
                                                        position: 'relative',
                                                        border: `2px solid ${theme.palette.success.main}`
                                                    }}
                                                >
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        top: 10,
                                                        right: 10,
                                                        zIndex: 10
                                                    }}>
                                                        <Chip
                                                            label={t('hotelDetails.bestValue')}
                                                            color="success"
                                                            size="small"
                                                            sx={{ fontWeight: 'bold' }}
                                                        />
                                                    </Box>
                                                    {hotel.cheapestRoom.imagePath && (
                                                        <CardMedia
                                                            component="img"
                                                            height="200"
                                                            image={getRoomImageUrl(hotel.cheapestRoom.roomId?.toString() || '')}
                                                            sx={{
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    )}
                                                    <CardContent sx={{ flexGrow: 1 }}>
                                                        <Typography variant="h6" gutterBottom>
                                                            {t(`roomTypes.${hotel.cheapestRoom.roomType.name?.toLowerCase()}`, { defaultValue: hotel.cheapestRoom.roomType.name?.replace(/_/g, ' ') })}
                                                        </Typography>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            mb: 1
                                                        }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {t('hotelDetails.capacity')}: {hotel.cheapestRoom.capacity || 1}
                                                            </Typography>
                                                        </Box>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                mb: 2,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 3,
                                                                WebkitBoxOrient: 'vertical',
                                                            }}
                                                        >
                                                            {hotel.cheapestRoom.description}
                                                        </Typography>
                                                        <Typography
                                                            variant="h6"
                                                            color="success.main"
                                                            sx={{ fontWeight: 'bold' }}
                                                        >
                                                            ${hotel.cheapestRoom.price.toFixed(2)} {t('hotelDetails.perNight')}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => hotel.cheapestRoom && handleRoomDetailsView(hotel.cheapestRoom as any)}
                                                        >
                                                            {t('hotelDetails.viewDetails')}
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            onClick={() => {
                                                                setSelectedRoom(hotel.cheapestRoom!.roomId?.toString() || '');
                                                            }}
                                                        >
                                                            {t('hotelDetails.selectBestValueRoom')}
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Box>
                                        )}

                                        {/* Room Types Available */}
                                        {hasDates && hotel.cheapestRoomByTypeList && hotel.cheapestRoomByTypeList.length > 0 && (
                                            <Box sx={{ mt: 3, mb: 4 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    {t('hotelDetails.availableRoomTypes')}
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    {hotel.cheapestRoomByTypeList.length > 0 ? hotel.cheapestRoomByTypeList.map((item, index) => {
                                                        const room = item.room;
                                                        const typeName = item.roomType?.name;
                                                        if (!room) return null;
                                                        // Don't duplicate the cheapest room if it's already shown above
                                                        const countForType = hotel.roomTypeCountAvailableList?.find(rt => rt.roomType?.name === typeName)?.count;
                                                        return (
                                                            <Card
                                                                key={typeName || index}
                                                                variant="outlined"
                                                                sx={{
                                                                    transition: 'all 0.3s',
                                                                    '&:hover': {
                                                                        transform: 'translateY(-8px)',
                                                                        boxShadow: 4
                                                                    },
                                                                    height: '100%',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    borderRadius: 2,
                                                                    position: 'relative',
                                                                    border: '1px solid',
                                                                    borderColor: theme.palette.divider
                                                                }}
                                                            >
                                                                {typeof countForType === 'number' && (
                                                                    <Box sx={{
                                                                        position: 'absolute',
                                                                        top: 10,
                                                                        right: 10,
                                                                        zIndex: 10
                                                                    }}>
                                                                        <Chip
                                                                            size="small"
                                                                            label={t('hotelDetails.availableCount', { count: countForType })}
                                                                            color="primary"
                                                                            variant="outlined"
                                                                        />
                                                                    </Box>
                                                                )}
                                                                {room.imagePath && (
                                                                    <CardMedia
                                                                        component="img"
                                                                        height="200"
                                                                        image={getRoomImageUrl(room.roomId?.toString() || '')}
                                                                        alt={`${typeName} Room ${room.roomNumber}`}
                                                                        sx={{
                                                                            objectFit: 'cover'
                                                                        }}
                                                                    />
                                                                )}
                                                                <CardContent sx={{ flexGrow: 1 }}>
                                                                    <Typography variant="h6" gutterBottom>
                                                                        {normalizeRoomTypeLabel(typeName)}
                                                                    </Typography>
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 0.5,
                                                                        mb: 1
                                                                    }}>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {t('hotelDetails.capacity')}: {room.capacity || 1}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            mb: 2,
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            display: '-webkit-box',
                                                                            WebkitLineClamp: 3,
                                                                            WebkitBoxOrient: 'vertical',
                                                                        }}
                                                                    >
                                                                        {room.description}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="h6"
                                                                        color="primary.main"
                                                                        sx={{ fontWeight: 'bold' }}
                                                                    >
                                                                        ${room.price?.toFixed(2)} {t('hotelDetails.perNight')}
                                                                    </Typography>
                                                                </CardContent>
                                                                <CardActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                                                                    <Button
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onClick={() => handleRoomDetailsView(room as any)}
                                                                    >
                                                                        {t('hotelDetails.viewDetails')}
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => {
                                                                            setSelectedRoom(room.roomId?.toString() || '');
                                                                        }}
                                                                    >
                                                                        {t('hotelDetails.selectRoom')}
                                                                    </Button>
                                                                </CardActions>
                                                            </Card>
                                                        );
                                                    }) : (
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {t('hotelDetails.noOtherRoomTypesAvailable')}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>)}

                                        {!hasDates && (
                                            <Box sx={{ mt: 3 }}>
                                                <Alert severity="info">
                                                    {t('hotelDetails.selectDatesToSeeOffers', 'Select dates to see available room types and best prices.')}
                                                </Alert>
                                            </Box>
                                        )}

                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="h6" gutterBottom>
                                                {t('hotelDetails.featuredAmenities')}
                                            </Typography>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                                                {hotel.amenities?.slice(0, 6).map((amenity, index) => (
                                                    <AmenityItem
                                                        key={index}
                                                        amenity={amenity as any}
                                                        icon={getAmenityTypeIcon(amenity as any)}
                                                        variant="simple"
                                                    />
                                                ))}
                                            </Box>
                                            {hotel.amenities && hotel.amenities.length > 6 && (
                                                <Button
                                                    sx={{ mt: 2 }}
                                                    onClick={() => setActiveTab(1)}
                                                >
                                                    {t('explore.amenities.more', { count: hotel.amenities.length - 6 })}
                                                </Button>
                                            )}
                                        </Box>
                                    </>
                                )}

                                {/* Amenities Tab */}
                                {activeTab === 1 && (
                                    <>
                                        <Typography variant="h5" gutterBottom>
                                            {t('hotelDetails.amenities')}
                                        </Typography>
                                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
                                            {hotel.amenities?.map((amenity, index) => (
                                                <AmenityItem
                                                    key={index}
                                                    amenity={amenity as any}
                                                    icon={getAmenityTypeIcon(amenity as any)}
                                                    variant="paper"
                                                />
                                            ))}
                                        </Box>
                                    </>
                                )}

                                {/* Rooms Tab */}
                                {activeTab === 2 && (
                                    <>
                                        <Typography variant="h5" gutterBottom>
                                            {t('hotelDetails.rooms')}
                                        </Typography>

                                        {/* Room Type Distribution (only after dates) */}
                                        {hasDates && hotel.roomTypeCountAvailableList && hotel.roomTypeCountAvailableList.length > 0 && (
                                            <Box sx={{ mb: 4 }}>
                                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                                                    {t('hotelDetails.roomTypeAvailability')}
                                                </Typography>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 1,
                                                    mb: 3
                                                }}>

                                                    {hotel.roomTypeCountAvailableList.map((item, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={`${normalizeRoomTypeLabel(item.roomType?.name)}: ${item.count ?? 0}`}
                                                            color={typeof item.count === 'number' && item.count > 0 ? "primary" : "default"}
                                                            sx={{
                                                                fontWeight: typeof item.count === 'number' && item.count > 0 ? 'medium' : 'normal',
                                                                px: 1
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}

                                        <RoomOptions
                                            rooms={availableRooms}
                                            hasDates={hasDates}
                                            isLoading={isRoomsLoading}
                                            cheapestRoomId={hotel.cheapestRoom?.roomId?.toString()}
                                            onViewDetails={handleRoomDetailsView}
                                            onSelectRoom={(roomId) => {
                                                setSelectedRoom(roomId);
                                                setActiveTab(0);
                                            }}
                                            getRoomImageUrl={getRoomImageUrl}
                                        />
                                    </>
                                )}
                            </Box>
                        </Paper>

                        {/* Room Details Dialog */}
                        <RoomDetailsDialog
                            open={showRoomDetails}
                            onClose={handleCloseRoomDetails}
                            room={selectedRoomDetails}
                            hotel={hotel as any}
                            getRoomImageUrl={getRoomImageUrl}
                            onSelectRoom={(roomId) => {
                                setSelectedRoom(roomId);
                                handleCloseRoomDetails();
                            }}
                        />
                    </Box>

                    {/* Right Column - Reservation */}
                    <Box >
                        <ReservationForm
                            checkInDate={checkInDate}
                            checkOutDate={checkOutDate}
                            setCheckInDate={setCheckInDate}
                            setCheckOutDate={setCheckOutDate}
                            guests={guests}
                            handleGuestsChange={handleGuestsChange}
                            selectedRoom={selectedRoom}
                            handleRoomChange={handleRoomChange}
                            availableRooms={availableRooms}
                            cheapestRoomId={hotel.cheapestRoom?.roomId?.toString()}
                            handleBooking={handleBooking}
                            isLoadingRooms={isRoomsLoading}
                        />

                        <ContactInfo
                            hotel={hotel as any}
                            showContact={showContact}
                            toggleContact={() => setShowContact(!showContact)}
                        />
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default HotelDetails;