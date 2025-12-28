import React from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RoomCard from './RoomCard';
import { RoomDto } from '../../api/generated/api';
import { getRoomImageUrl as defaultGetRoomImageUrl } from './HotelUtils';

interface RoomOptionsProps {
    rooms: RoomDto[];
    hasDates: boolean;
    isLoading: boolean;
    cheapestRoomId?: string;
    onSelectRoom: (roomId: string) => void;
    onViewDetails: (room: RoomDto) => void;
    getRoomImageUrl?: (roomId: string) => string;
}

const RoomOptions: React.FC<RoomOptionsProps> = ({
    rooms,
    hasDates,
    isLoading,
    cheapestRoomId,
    onSelectRoom,
    onViewDetails,
    getRoomImageUrl = defaultGetRoomImageUrl
}) => {
    const { t } = useTranslation();

    if (!hasDates) {
        return (
            <Alert severity="info" sx={{ mt: 2 }}>
                {t('hotelDetails.selectDatesToSeeRooms', 'Select check-in and check-out dates to see available rooms.')}
            </Alert>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
                <CircularProgress size={20} thickness={5} />
                <Box component="span" sx={{ color: 'text.secondary' }}>
                    {t('hotelDetails.loadingRooms', 'Loading room options...')}
                </Box>
            </Box>
        );
    }

    if (!rooms || rooms.length === 0) {
        return (
            <Alert severity="info" sx={{ mt: 2 }}>
                {t('hotelDetails.noRoomsAvailable')}
            </Alert>
        );
    }

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            {rooms.map((room) => (
                <RoomCard
                    key={room.roomId}
                    room={room}
                    isBestValue={Boolean(cheapestRoomId && room.roomId?.toString() === cheapestRoomId)}
                    onViewDetails={onViewDetails}
                    onSelectRoom={onSelectRoom}
                    getRoomImageUrl={getRoomImageUrl}
                />
            ))}
        </Box>
    );
};

export default RoomOptions;
