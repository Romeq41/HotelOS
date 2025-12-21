import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    CardActionArea,
    Button,
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Pagination,
    SelectChangeEvent
} from '@mui/material';
import { useLoading } from '../../contexts/LoaderContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HotelOfferDto } from '../../api/generated/api';
import { useApi } from '../../api/useApi';

const Explore: React.FC = () => {
    const [sortBy, setSortBy] = useState<string>('price-asc');

    const navigate = useNavigate();
    const { t } = useTranslation();

    const [hotels, setHotels] = useState<HotelOfferDto[]>([]);
    const [hotelImages, setHotelImages] = useState<{ [key: number]: string }>({});
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [countryInput, setCountryInput] = useState('');
    const [cityInput, setCityInput] = useState('');
    const [countryQuery, setCountryQuery] = useState('');
    const [cityQuery, setCityQuery] = useState('');

    const { showLoader, hideLoader, isLoading } = useLoading();
    const { hotel: hotelApi } = useApi();
    const PAGE_SIZE = 10;

    useEffect(() => {
        const fetchHotelsData = async (searchValue: string, pageNumber: number, country?: string, city?: string, sortBy?: string) => {
            showLoader();

            try {
                // Using the generated API client to fetch hotel data
                const response = await hotelApi.getHotelsWithOffers(
                    pageNumber,
                    PAGE_SIZE,
                    searchValue || undefined,
                    country || undefined,
                    city || undefined,
                    sortBy || undefined
                );

                const data = response.data;

                if (data.content && data.content.length > 0) {
                    // Map HotelOfferDto to the expected Hotel interface format
                    const hotelsWithKeys = data.content.map((hotelOffer: HotelOfferDto) => ({
                        ...hotelOffer
                    }));

                    setHotels(hotelsWithKeys);
                    setTotalPages(data.totalPages || 1);
                    setPage(data.number || 0);

                    // Fetch images for each hotel
                    const imagePromises = hotelsWithKeys.map(async (hotel) => {
                        if (hotel.id) {
                            try {
                                const imagesResponse = await hotelApi.getAllHotelImages(Number(hotel.id));
                                const images = imagesResponse.data as any[];

                                if (images && images.length > 0) {
                                    // Find primary image first, fallback to first image
                                    const primaryImage = images.find(img => img.isPrimary);
                                    const imageUrl = primaryImage ? primaryImage.url : images[0].url;
                                    return { hotelId: hotel.id, imageUrl };
                                }
                            } catch (imageError) {
                                console.log(`No images found for hotel ${hotel.id}`);
                            }
                        }
                        return { hotelId: hotel.id, imageUrl: "https://via.placeholder.com/300x200?text=Hotel+Image" };
                    });

                    const imageResults = await Promise.all(imagePromises);
                    const imageMap: { [key: number]: string } = {};
                    imageResults.forEach(result => {
                        if (result.hotelId) {
                            imageMap[result.hotelId] = result.imageUrl;
                        }
                    });
                    setHotelImages(imageMap);
                } else {
                    setHotels([]);
                    setTotalPages(0);
                    setPage(0);
                    setHotelImages({});
                }
            } catch (error: any) {
                console.error('Error fetching hotels data:', error);

                // Handle authentication errors
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.log('Authentication issue. Redirecting to login page...');
                    window.location.href = '/login';
                }
            } finally {
                hideLoader();
            }
        };

        fetchHotelsData(searchQuery, page, countryQuery, cityQuery, sortBy);
    }, [page, searchQuery, countryQuery, cityQuery, sortBy]);


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCountryInput(event.target.value);
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCityInput(event.target.value);
    };

    const handleSearch = () => {
        setPage(0);
        setSearchQuery(inputValue);
        setCountryQuery(countryInput);
        setCityQuery(cityInput);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSortChange = (event: SelectChangeEvent) => {
        setSortBy(event.target.value);
        setPage(0);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1);
    };

    // Function to create URL-friendly hotel name
    const createUrlFriendlyName = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    };

    // Function to get location string
    const getLocationString = (hotel: HotelOfferDto) => {
        return [hotel.addressInformation.city, hotel.addressInformation.state, hotel.addressInformation.country].filter(Boolean).join(', ');
    };

    // Function to render price or placeholder
    const renderPrice = (hotel: HotelOfferDto) => {
        if (hotel.cheapestRoom?.price) {
            return t('explore.price.from', { price: hotel.cheapestRoom.price.toFixed(2) });
        }

        return t('explore.price.contact');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 mt-20">
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom align="center">
                    {t('explore.title')}
                </Typography>

                <Typography variant="subtitle1" paragraph align="center" sx={{ mb: 4 }}>
                    {t('explore.subtitle')}
                </Typography>

                {/* Search and filter section */}
                <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label={t('explore.search.hotels')}
                        variant="outlined"
                        value={inputValue}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                        sx={{ flex: 1, minWidth: '200px' }}
                    />
                    <TextField
                        label={t('explore.search.country')}
                        variant="outlined"
                        value={countryInput}
                        onChange={handleCountryChange}
                        onKeyPress={handleKeyPress}
                        sx={{ minWidth: '150px' }}
                    />
                    <TextField
                        label={t('explore.search.city')}
                        variant="outlined"
                        value={cityInput}
                        onChange={handleCityChange}
                        onKeyPress={handleKeyPress}
                        sx={{ minWidth: '150px' }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{ height: '56px' }}
                    >
                        {t('explore.search.button')}
                    </Button>

                    <FormControl sx={{ minWidth: '200px' }}>
                        <InputLabel id="sort-by-label">{t('explore.sort.label')}</InputLabel>
                        <Select
                            labelId="sort-by-label"
                            value={sortBy}
                            label={t('explore.sort.label')}
                            onChange={handleSortChange}
                        >
                            <MenuItem value="price-asc">{t('explore.sort.priceLow')}</MenuItem>
                            <MenuItem value="price-desc">{t('explore.sort.priceHigh')}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Hotels display section */}
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('explore.results.found', { count: hotels.length })}
                        </Typography>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)',
                                xl: 'repeat(6, 1fr)'
                            },
                            gap: 3
                        }}>
                            {hotels.map((hotel) => (
                                <Box key={hotel.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 6,
                                            },
                                            '&:hover .media': {
                                                transform: 'scale(1.03)'
                                            }
                                        }}
                                    >
                                        <CardActionArea
                                            onClick={() => navigate(`/hotels/${hotel.id}/${createUrlFriendlyName(hotel.name)}`)}
                                        >
                                            <Box sx={{ position: 'relative' }}>
                                                <CardMedia
                                                    className="media"
                                                    component="img"
                                                    height="200"
                                                    image={hotel.id ? hotelImages[hotel.id] || "https://via.placeholder.com/300x200?text=Hotel+Image" : "https://via.placeholder.com/300x200?text=Hotel+Image"}
                                                    alt={hotel.name}
                                                    sx={{
                                                        objectFit: 'cover',
                                                        objectPosition: 'center',
                                                        width: '100%',
                                                        transition: 'transform 0.3s ease'
                                                    }}
                                                />
                                                <Box sx={{ position: 'absolute', top: 8, left: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', px: 1, py: 0.5, borderRadius: 1, fontSize: 12 }}>
                                                    {renderPrice(hotel)}
                                                </Box>
                                            </Box>
                                            <CardContent sx={{ flexGrow: 1 }}>

                                                <Typography gutterBottom variant="h6" component="div">
                                                    {hotel.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    {getLocationString(hotel)}
                                                </Typography>

                                                <Typography variant="body2" paragraph>
                                                    {hotel.addressInformation.address}
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                                    {hotel.amenities?.slice(0, 3).map((amenity) => (
                                                        <Typography key={amenity.name} variant="caption" sx={{
                                                            bgcolor: 'primary.light',
                                                            color: 'white',
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1
                                                        }}>
                                                            {amenity.name}
                                                        </Typography>
                                                    ))}
                                                    {hotel.amenities?.length != null && hotel.amenities.length > 3 && (
                                                        <Typography variant="caption" sx={{
                                                            bgcolor: 'grey.400',
                                                            color: 'white',
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1
                                                        }}>
                                                            {t('explore.amenities.more', { count: hotel.amenities.length - 3 })}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                        <CardActions sx={{ mt: 'auto' }}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                fullWidth
                                                onClick={() => navigate(`/hotels/${hotel.id}/${createUrlFriendlyName(hotel.name)}`)}
                                            >
                                                {t('explore.card.viewDetails')}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Box>
                            ))}
                        </Box>

                        {hotels.length === 0 && !isLoading && (
                            <Box sx={{ textAlign: 'center', my: 4 }}>
                                <Typography variant="h6">
                                    {t('explore.results.noHotels')}
                                </Typography>
                            </Box>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page + 1}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
};

export default Explore;