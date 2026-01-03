import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Divider,
    Typography,
    FormControlLabel,
    Switch
} from '@mui/material';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../api/useApi';
import { GuestDto, ReservationDtoStatusEnum, RoomDto } from '../../api/generated/api';
import { useLoading } from '../../contexts/LoaderContext';
import { useUser } from '../../contexts/UserContext';
import FormItemWithVerification from '../../components/form/FormItemWithVerification';

export const parseDateOnly = (value?: string | null) => {
    if (!value) return null;
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
};

const formatDateOnly = (value?: string | null) => {
    const parsed = parseDateOnly(value);
    return parsed ? parsed.toLocaleDateString() : '';
};

interface BookingLocationState {
    checkInDate?: string;
    checkOutDate?: string;
    guests?: number;
}

interface GuestFormState {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isChild: boolean;
}

const BookReservation: React.FC = () => {
    const { roomId } = useParams<{ hotelId: string; roomId: string }>();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { t } = useTranslation();
    const { reservation: reservationApi, room: roomApi } = useApi();
    const { showLoader, hideLoader } = useLoading();
    const { user } = useUser();

    const { checkInDate, checkOutDate, guests } = (state as BookingLocationState) || {};
    const parsedGuests = guests && guests > 0 ? guests : 1;

    const [room, setRoom] = useState<RoomDto | null>(null);
    const [error, setError] = useState<string>('');
    const [specialRequests, setSpecialRequests] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [guestForms, setGuestForms] = useState<GuestFormState[]>(() => {
        const base: GuestFormState = {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: (user as any)?.email || '',
            phoneNumber: '',
            isChild: false
        };
        return Array.from({ length: parsedGuests }, (_, idx) => ({ ...base, ...(idx > 0 ? { firstName: '', lastName: '', email: '', isChild: false } : {}) }));
    });

    useEffect(() => {
        // keep number of guest forms in sync with incoming state
        setGuestForms((prev) => {
            if (parsedGuests === prev.length) return prev;
            const next = [...prev];
            if (parsedGuests > prev.length) {
                const template: GuestFormState = { firstName: '', lastName: '', email: '', phoneNumber: '', isChild: false };
                while (next.length < parsedGuests) next.push({ ...template });
            } else {
                next.length = parsedGuests;
            }
            return next;
        });
    }, [parsedGuests]);

    useEffect(() => {
        const loadRoom = async () => {
            if (!roomId) return;
            showLoader();
            try {
                const { data } = await roomApi.getRoomById(Number(roomId));
                setRoom(data as RoomDto);
            } catch (e) {
                setError(t('booking.loadRoomError'));
            } finally {
                hideLoader();
            }
        };
        loadRoom();
    }, [roomId]);

    // useEffect(() => {
    //     const loadHotel = async () => {
    //         if (!hotelId || !room) return;
    //         showLoader();
    //         try {
    //             const { data } = await hotelApi.getHotelById(Number(hotelId));
    //             setRoom(room => ({...room, hotel: data} as RoomDto));
    //         } catch (e) {
    //             setError('Unable to load hotel details.');
    //         }
    //         finally {
    //             hideLoader();
    //         }
    //     };
    //     loadHotel();
    // }, [hotelId, room]);

    const nights = useMemo(() => {
        const start = parseDateOnly(checkInDate);
        const end = parseDateOnly(checkOutDate);
        if (!start || !end) return 1;
        const diff = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        return diff;
    }, [checkInDate, checkOutDate]);

    const totalAmount = useMemo(() => {
        if (!room) return 0;
        const price = room.price || 0;
        return price * nights;
    }, [room, nights]);

    const handleGuestChange = (idx: number, field: keyof GuestFormState, value: string) => {
        setGuestForms((prev) => prev.map((g, i) => (i === idx ? { ...g, [field]: value } : g)));
    };

    const handleSubmit = async () => {
        if (!checkInDate || !checkOutDate || !room) {
            setError(t('booking.missingBookingData'));
            return;
        }
        if (!user?.userId) {
            setError(t('booking.loginRequired'));
            return;
        }
        const primaryIsChild = guestForms[0]?.isChild;
        const invalidGuest = guestForms.some((g, idx) => !g.firstName || !g.lastName || (idx === 0 && !g.email) || (idx === 0 && !g.phoneNumber));
        if (primaryIsChild) {
            setError(t('booking.primaryGuestAdult'));
            return;
        }
        if (invalidGuest) {
            setError(t('booking.guestInfoRequired'));
            return;
        }

        const adults = guestForms.filter(g => !g.isChild).length;
        const children = guestForms.length - adults;

        console.log('Submitting reservation with guests:', guestForms);
        console.log('checkin, checkout, totalAmount:', checkInDate, checkOutDate, totalAmount);
        setError('');
        setIsSubmitting(true);
        showLoader();
        try {
            const guestsPayload: GuestDto[] = guestForms.map((g, idx) => ({
                firstName: g.firstName,
                lastName: g.lastName,
                email: g.email,
                phoneNumber: g.phoneNumber,
                isPrimaryGuest: idx === 0,
                // Backend expects isAdult; primary is always adult.
                isAdult: idx === 0 ? true : !g.isChild
            } as any));

            const primary = guestsPayload[0];

            await reservationApi.addReservation({
                reservationName: `${room?.hotel?.name || t('booking.reservationFallbackName')} - ${t('booking.roomLabel', { roomNumber: room.roomNumber })}`,
                checkInDate,
                checkOutDate,
                totalAmount,
                status: ReservationDtoStatusEnum.Pending,
                numberOfAdults: adults,
                numberOfChildren: children,
                specialRequests,
                user: user,
                room,
                guests: guestsPayload as any,
                primaryGuestName: `${primary.firstName} ${primary.lastName}`,
                primaryGuestEmail: primary.email,
                primaryGuestPhone: primary.phoneNumber
            });

            navigate('/user', { state: { successMessage: t('booking.createSuccess') } });
        } catch (e: any) {
            setError(e?.response?.data?.message || t('booking.createError'));
        } finally {
            hideLoader();
            setIsSubmitting(false);
        }
    };

    const hasState = Boolean(checkInDate && checkOutDate);

    if (!hasState) {
        return (
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                    {t('booking.missingDetails')}
                </Alert>
                <Button variant="contained" onClick={() => navigate(-1)}>{t('booking.goBack')}</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }} className='mt-20'>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, minWidth: 280 }}>
                    <Card sx={{ mb: 3 }}>
                        <CardHeader title={t('booking.summary.title')} subheader={t('booking.summary.subtitle', { nights, guests: parsedGuests })} />
                        <CardHeader title={room ? `${room.hotel?.name || ''}` : t('general.loading')} />
                        <CardContent>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Box sx={{ flex: '1 1 120px' }}>
                                    <Typography variant="body2" color="text.secondary">{t('booking.summary.checkIn')}</Typography>
                                    <Typography variant="h6">{formatDateOnly(checkInDate)}</Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 120px' }}>
                                    <Typography variant="body2" color="text.secondary">{t('booking.summary.checkOut')}</Typography>
                                    <Typography variant="h6">{formatDateOnly(checkOutDate)}</Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 100%' }}>
                                    <Typography variant="body2" color="text.secondary">{t('booking.summary.room')}</Typography>
                                    <Typography variant="h6">{room ? `${room.roomType?.name || ''}` : t('general.loading')}</Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 100%' }}>
                                    <Typography variant="body2" color="text.secondary">{t('booking.summary.total')}</Typography>
                                    <Typography variant="h5">{totalAmount.toFixed(2)}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader title={t('booking.specialRequests.title')} subheader={t('booking.specialRequests.optional')} />
                        <CardContent>
                            <Form layout="vertical">
                                <FormItemWithVerification
                                    type="textarea"
                                    name="specialRequests"
                                    label={t('booking.specialRequests.title')}
                                    placeholder={t('booking.specialRequests.placeholder')}
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests((e?.target?.value ?? e) as string)}
                                    rows={3}
                                    allowClear
                                />
                            </Form>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ flex: 2, minWidth: 320 }}>
                    <Card>
                        <CardHeader title={t('booking.guests.title')} subheader={t('booking.guests.subtitle')} />
                        <CardContent>
                            <Form layout="vertical">
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    {guestForms.map((guest, idx) => (
                                        <Box key={idx}>
                                            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="subtitle1">{t('booking.guests.guestLabel', { index: idx + 1 })}</Typography>
                                                <Typography variant="caption" color="text.secondary">{idx === 0 ? t('booking.guests.primaryTag') : t('booking.guests.additionalTag')}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                <Box sx={{ flex: '1 1 220px' }}>
                                                    <FormItemWithVerification
                                                        type="text"
                                                        name={`guest-${idx}-firstName`}
                                                        label={t('booking.guests.firstName')}
                                                        required
                                                        value={guest.firstName}
                                                        onChange={(e) => handleGuestChange(idx, 'firstName', (e as any)?.target?.value ?? e)}
                                                    />
                                                </Box>
                                                <Box sx={{ flex: '1 1 220px' }}>
                                                    <FormItemWithVerification
                                                        type="text"
                                                        name={`guest-${idx}-lastName`}
                                                        label={t('booking.guests.lastName')}
                                                        required
                                                        value={guest.lastName}
                                                        onChange={(e) => handleGuestChange(idx, 'lastName', (e as any)?.target?.value ?? e)}
                                                    />
                                                </Box>
                                                <Box sx={{ flex: '1 1 220px' }}>
                                                    <FormItemWithVerification
                                                        type="email"
                                                        name={`guest-${idx}-email`}
                                                        label={t('booking.guests.email')}
                                                        required={idx === 0}
                                                        value={guest.email}
                                                        onChange={(e) => handleGuestChange(idx, 'email', (e as any)?.target?.value ?? e)}
                                                    />
                                                </Box>
                                                <Box sx={{ flex: '1 1 220px' }}>
                                                    <FormItemWithVerification
                                                        type="text"
                                                        name={`guest-${idx}-phone`}
                                                        label={t('booking.guests.phone')}
                                                        placeholder={t('booking.guests.phonePlaceholder')}
                                                        required={idx === 0}
                                                        value={guest.phoneNumber}
                                                        minLength={6}
                                                        onChange={(e) => handleGuestChange(idx, 'phoneNumber', (e as any)?.target?.value ?? e)}

                                                    />
                                                </Box>
                                                {idx === 0 ? (
                                                    <Box sx={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                        <Typography variant="body2">{t('booking.guests.primaryGuestAdult')}</Typography>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ flex: '1 1 200px', display: 'flex', alignItems: 'center' }}>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    checked={guest.isChild}
                                                                    onChange={(_, checked) => handleGuestChange(idx, 'isChild', checked as any)}
                                                                    color="primary"
                                                                    inputProps={{ 'aria-label': `Guest ${idx + 1} child toggle` }}
                                                                />
                                                            }
                                                            label={guest.isChild ? t('booking.guests.child') : t('booking.guests.adult')}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>
                                            {idx < guestForms.length - 1 && <Divider sx={{ my: 2 }} />}
                                        </Box>
                                    ))}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {t('booking.actions.confirm')}
                                        </Button>
                                    </Box>
                                </Box>
                            </Form>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    );
};

export default BookReservation;
