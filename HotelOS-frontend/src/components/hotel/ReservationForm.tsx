import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    SelectChangeEvent,
    useTheme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTranslation } from 'react-i18next';
import { RoomDto } from '../../api/generated/api';

interface ReservationFormProps {
    checkInDate: Date | null;
    checkOutDate: Date | null;
    setCheckInDate: (date: Date | null) => void;
    setCheckOutDate: (date: Date | null) => void;
    guests: number;
    handleGuestsChange: (event: SelectChangeEvent) => void;
    selectedRoom: string;
    handleRoomChange: (event: SelectChangeEvent) => void;
    availableRooms: RoomDto[];
    cheapestRoomId?: string;
    handleBooking: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
    checkInDate,
    checkOutDate,
    setCheckInDate,
    setCheckOutDate,
    guests,
    handleGuestsChange,
    selectedRoom,
    handleRoomChange,
    availableRooms,
    cheapestRoomId,
    handleBooking
}) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const selectedRoomDetails = availableRooms.find(room => room.roomId?.toString() === selectedRoom);

    // Normalize room type label whether roomType is an object or a string-ified DTO
    const getRoomTypeLabel = (room: RoomDto): string => {
        const rt: any = (room as any)?.roomType;
        let name: string | undefined;
        if (rt && typeof rt === 'object') {
            name = rt.name as string | undefined;
        } else if (typeof rt === 'string') {
            // Try to extract name=Value from e.g. "RoomTypeDto(id=1, name=Standard, ...)"
            const match = rt.match(/name=([^,\)]+)/);
            if (match && match[1]) name = match[1].trim();
        }
        if (!name) return t('hotelDetails.unknownType', { defaultValue: 'Unknown type' });
        const key = name.toLowerCase().replace(/\s+/g, '_');
        return t(`roomTypes.${key}`, { defaultValue: name.replace(/_/g, ' ') });
    };
    const isBestValue = cheapestRoomId && selectedRoom === cheapestRoomId;

    return (
        <Card
            elevation={4}
            sx={{
                top: 100,
                borderRadius: 2,
                overflow: 'hidden',
                maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '3px',
                },
                zIndex: 90,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.15)',
                },
                display: 'block',
                willChange: 'transform',
                isolation: 'isolate'
            }}
        >
            <Box sx={{ bgcolor: theme.palette.primary.main, color: 'white', p: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                    {t('hotelDetails.reservation')}
                </Typography>
            </Box>

            <CardContent sx={{ pt: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <DatePicker
                            label={t('hotelDetails.checkIn')}
                            value={checkInDate}
                            onChange={setCheckInDate}
                            minDate={new Date()}
                            slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                        />

                        <DatePicker
                            label={t('hotelDetails.checkOut')}
                            value={checkOutDate}
                            onChange={setCheckOutDate}
                            minDate={checkInDate || new Date()}
                            slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                        />

                        <FormControl fullWidth variant="outlined">
                            <InputLabel>{t('hotelDetails.guests')}</InputLabel>
                            <Select
                                value={guests.toString()}
                                label={t('hotelDetails.guests')}
                                onChange={handleGuestsChange}
                            >
                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                    <MenuItem key={num} value={num.toString()}>
                                        {num}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth variant="outlined">
                            <InputLabel>{t('hotelDetails.selectRoom')}</InputLabel>
                            <Select
                                value={availableRooms.length > 0 ? selectedRoom : ''}
                                label={t('hotelDetails.selectRoom')}
                                onChange={handleRoomChange}
                                disabled={availableRooms.length === 0}
                            >
                                {availableRooms ? availableRooms.map((room) => {
                                    const typeLabel = getRoomTypeLabel(room);
                                    const roomIdStr = room.roomId?.toString() || '';
                                    return (
                                        <MenuItem key={room.roomId} value={roomIdStr}>
                                            {typeLabel} (${(room.price ?? 0).toFixed(2)})
                                            {cheapestRoomId && roomIdStr === cheapestRoomId &&
                                                ` - ${t('hotelDetails.bestValue')}`}
                                        </MenuItem>
                                    );
                                }) : <MenuItem disabled>{t('hotelDetails.noRoomsAvailable')}</MenuItem>}
                            </Select>
                        </FormControl>

                        {selectedRoom && selectedRoomDetails && (
                            <Box sx={{
                                bgcolor: isBestValue ?
                                    'rgba(76, 175, 80, 0.08)' : theme.palette.grey[50],
                                p: 2,
                                borderRadius: 1,
                                mt: 2,
                                mb: 1,
                                border: '1px solid',
                                borderColor: isBestValue ?
                                    theme.palette.success.light : theme.palette.divider,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s ease',
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        {t('hotelDetails.selectedRoom')}:
                                    </Typography>
                                    {isBestValue && (
                                        <Chip
                                            label={t('hotelDetails.bestValue')}
                                            size="small"
                                            color="success"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    )}
                                </Box>

                                <Typography variant="body1" fontWeight="medium">
                                    {getRoomTypeLabel(selectedRoomDetails)}
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2">
                                        {t('hotelDetails.capacity')}: {selectedRoomDetails.capacity ?? 1}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        color={isBestValue ? "success.main" : "primary.main"}
                                        fontWeight="bold"
                                    >
                                        ${(selectedRoomDetails.price ?? 0).toFixed(2)} {t('hotelDetails.perNight')}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </LocalizationProvider>
            </CardContent>

            <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleBooking}
                    disabled={!checkInDate || !checkOutDate || !selectedRoom || availableRooms.length === 0}
                    sx={{
                        py: 1.8,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        background: !(!checkInDate || !checkOutDate || !selectedRoom || availableRooms.length === 0) ?
                            'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)' : undefined,
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': {
                            boxShadow: '0px 6px 16px rgba(0,0,0,0.2)',
                            transform: 'translateY(-2px)'
                        },
                        position: 'relative',
                        zIndex: 2,
                        animation: !(!checkInDate || !checkOutDate || !selectedRoom || availableRooms.length === 0) ?
                            'pulse 2s infinite' : 'none',
                        '@keyframes pulse': {
                            '0%': {
                                boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.7)',
                            },
                            '70%': {
                                boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
                            },
                            '100%': {
                                boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
                            },
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    {t('hotelDetails.bookNow')}
                </Button>
            </CardActions>
        </Card>
    );
};

export default ReservationForm;
