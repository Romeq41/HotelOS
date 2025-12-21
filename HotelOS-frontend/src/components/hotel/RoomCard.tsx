import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Box,
    Button,
    Chip,
    useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RoomDto } from '../../api/generated/api';

interface RoomCardProps {
    room: RoomDto;
    isBestValue?: boolean;
    onViewDetails: (room: any) => void;
    onSelectRoom: (roomId: string) => void;
    getRoomImageUrl: (roomId: string) => string;
}

const RoomCard: React.FC<RoomCardProps> = ({
    room,
    isBestValue = false,
    onViewDetails,
    onSelectRoom,
    getRoomImageUrl
}) => {
    const { t } = useTranslation();
    const theme = useTheme();

    // Normalize room type for label/alt (supports object or stringified DTO)
    const getRoomTypeLabel = (room: RoomDto): string => {
        const rt: any = (room as any)?.roomType;
        let name: string | undefined;
        if (rt && typeof rt === 'object') {
            name = rt.name as string | undefined;
        } else if (typeof rt === 'string') {
            const match = rt.match(/name=([^,\)]+)/);
            if (match && match[1]) name = match[1].trim();
        }
        if (!name) return t('hotelDetails.unknownType', { defaultValue: 'Unknown type' });
        const key = name.toLowerCase().replace(/\s+/g, '_');
        return t(`roomTypes.${key}`, { defaultValue: name.replace(/_/g, ' ') });
    };

    return (
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
                border: isBestValue ?
                    `2px solid ${theme.palette.success.main}` : undefined
            }}
        >
            {isBestValue && (
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
            )}
            {room.imagePath && (
                <CardMedia
                    component="img"
                    height="200"
                    image={getRoomImageUrl(room.roomId?.toString() || '')}
                    alt={getRoomTypeLabel(room)}
                    sx={{
                        objectFit: 'cover'
                    }}
                />
            )}
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                    {getRoomTypeLabel(room)}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mb: 1
                }}>
                    <Typography variant="body2" color="text.secondary">
                        {t('hotelDetails.capacity')}: {room.capacity ?? 1}
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
                    color={isBestValue ? "success.main" : "primary.main"}
                    sx={{ fontWeight: 'bold' }}
                >
                    ${(room.price ?? 0).toFixed(2)} {t('hotelDetails.perNight')}
                </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onViewDetails(room)}
                >
                    {t('hotelDetails.viewDetails')}
                </Button>
                <Button
                    variant="contained"
                    color={isBestValue ? "success" : "primary"}
                    onClick={() => onSelectRoom(room.roomId?.toString() || '')}
                >
                    {isBestValue ? t('hotelDetails.selectBestValueRoom') : t('hotelDetails.selectRoom')}
                </Button>
            </CardActions>
        </Card>
    );
};

export default RoomCard;
