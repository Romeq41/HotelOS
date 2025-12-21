import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Button,
    Chip,
    CardMedia,
    Divider,
    Paper,
    Alert
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';
import { HotelOfferDto } from '../../api/generated/api';

interface RoomDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    room: any | null;
    hotel: HotelOfferDto | any;
    getRoomImageUrl: (roomId: string) => string;
    onSelectRoom: (roomId: string) => void;
}

const RoomDetailsDialog: React.FC<RoomDetailsDialogProps> = ({
    open,
    onClose,
    room,
    hotel,
    getRoomImageUrl,
    onSelectRoom
}) => {
    const { t } = useTranslation();
    const isBestValue = hotel?.cheapestRoom && room && hotel.cheapestRoom.roomId === room.roomId;

    // Extract room type name and label (supports object or stringified DTO)
    const getRoomTypeName = (r: any): string | undefined => {
        const rt = r?.roomType;
        if (!rt) return undefined;
        if (typeof rt === 'object') return rt.name;
        if (typeof rt === 'string') {
            const match = rt.match(/name=([^,\)]+)/);
            if (match && match[1]) return match[1].trim();
            return rt;
        }
        return undefined;
    };

    const getRoomTypeLabel = (r: any): string => {
        const name = getRoomTypeName(r);
        if (!name) return t('hotelDetails.unknownType', { defaultValue: 'Unknown type' });
        const key = name.toLowerCase().replace(/\s+/g, '_');
        return t(`roomTypes.${key}`, { defaultValue: name.replace(/_/g, ' ') });
    };

    const getAvailabilityCount = (): number | undefined => {
        const map = hotel?.roomTypeCountAvailableMap as Record<string, number> | undefined;
        if (!map) return undefined;
        const name = getRoomTypeName(room);
        if (!name) return undefined;
        if (Object.prototype.hasOwnProperty.call(map, name)) return map[name];
        // Try case-insensitive match on keys
        const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '_');
        const target = norm(name);
        for (const [k, v] of Object.entries(map)) {
            if (norm(k) === target) return v;
        }
        return undefined;
    };

    if (!room) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography component="span" variant="h6">{getRoomTypeLabel(room)}</Typography>
                {isBestValue && (
                    <Chip
                        label={t('hotelDetails.bestValue')}
                        color="success"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                )}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ position: 'relative' }}>
                    {room.imagePath ? (
                        <CardMedia
                            component="img"
                            height="300"
                            image={getRoomImageUrl(room.roomId?.toString() || '')}
                            alt={getRoomTypeLabel(room)}
                            sx={{ borderRadius: 1, mb: 2 }}
                        />
                    ) : (
                        <Box
                            sx={{
                                height: 200,
                                bgcolor: 'grey.100',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1,
                                mb: 2
                            }}
                        >
                            <Typography color="text.secondary">No image available</Typography>
                        </Box>
                    )}
                    <Box sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        p: 1,
                        px: 2,
                        borderRadius: 1
                    }}>
                        <Typography variant="h5" fontWeight="bold">
                            ${(room.price ?? 0).toFixed(2)} <Typography component="span" variant="body2">/ night</Typography>
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    {t('hotelDetails.roomDetails')}
                </Typography>
                <Typography variant="body1" paragraph>
                    {room.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                    <Paper elevation={0} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">{t('hotelDetails.roomType')}</Typography>
                        <Typography variant="body1" fontWeight="medium">{getRoomTypeLabel(room)}</Typography>
                    </Paper>

                    <Paper elevation={0} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">{t('hotelDetails.capacity')}</Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {room.capacity ?? 1}
                        </Typography>
                    </Paper>

                    <Paper elevation={0} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">{t('hotelDetails.pricePerNight')}</Typography>
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            color={isBestValue ? "success.main" : "primary.main"}
                        >
                            ${(room.price ?? 0).toFixed(2)}
                        </Typography>
                    </Paper>

                    <Paper elevation={0} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">{t('hotelDetails.status')}</Typography>
                        <Chip
                            label={t(`roomStatus.${String(room.status || '').toLowerCase()}`, { defaultValue: String(room.status || '') })}
                            size="small"
                            color={String(room.status) === "AVAILABLE" ? "success" : "default"}
                        />
                    </Paper>

                    <Paper elevation={0} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">{t('hotelDetails.hotel')}</Typography>
                        <Typography variant="body1" fontWeight="medium">{hotel.name}</Typography>
                    </Paper>
                </Box>

                {/* Room availability in this type */}
                {(() => {
                    const count = getAvailabilityCount();
                    return typeof count === 'number';
                })() && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                {t('hotelDetails.availabilityForRoomType')}
                            </Typography>
                            {(() => {
                                const count = getAvailabilityCount() ?? 0;
                                const label = getRoomTypeLabel(room);
                                const multiple = count > 1;
                                return (
                                    <Alert
                                        severity={multiple ? "success" : "warning"}
                                        icon={multiple ? <CheckCircleOutlineIcon /> : undefined}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {multiple
                                            ? t('hotelDetails.multipleRoomsAvailable', { count, roomType: label })
                                            : t('hotelDetails.oneRoomLeft', { count, roomType: label })}
                                    </Alert>
                                );
                            })()}
                        </Box>
                    )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>{t('common.close')}</Button>
                <Button
                    variant="contained"
                    color={isBestValue ? "success" : "primary"}
                    onClick={() => {
                        onSelectRoom(room.roomId?.toString() || '');
                        onClose();
                    }}
                    startIcon={isBestValue ? <CheckCircleOutlineIcon /> : undefined}
                >
                    {isBestValue
                        ? t('hotelDetails.selectBestValueRoom')
                        : t('hotelDetails.selectRoom')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoomDetailsDialog;
