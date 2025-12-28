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
import { useApi } from '../../api/useApi';
import { GuestDto, ReservationDtoStatusEnum, RoomDto } from '../../api/generated/api';
import { useLoading } from '../../contexts/LoaderContext';
import { useUser } from '../../contexts/UserContext';
import FormItemWithVerification from '../../components/form/FormItemWithVerification';
import { t } from 'i18next';

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
                setError('Unable to load room details.');
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
            setError('Missing booking details. Please start from the hotel page again.');
            return;
        }
        if (!user?.userId) {
            setError('You need to be logged in to complete a reservation.');
            return;
        }
        const primaryIsChild = guestForms[0]?.isChild;
        const invalidGuest = guestForms.some((g, idx) => !g.firstName || !g.lastName || (idx === 0 && !g.email) || (idx === 0 && !g.phoneNumber));
        if (primaryIsChild) {
            setError('Primary guest must be an adult.');
            return;
        }
        if (invalidGuest) {
            setError('Please fill in first name and last name for every guest, and email/phone for the primary guest.');
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
                reservationName: `${room?.hotel?.name || 'Reservation'} - Room ${room.roomNumber}`,
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

            navigate('/user', { state: { successMessage: 'Reservation created successfully.' } });
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Unable to create reservation.');
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
                    Booking details are missing. Please select dates and room again.
                </Alert>
                <Button variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
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
                        <CardHeader title="Reservation summary" subheader={`${nights} night(s) • ${parsedGuests} guest(s)`} />
                        <CardHeader title={room ? `${room.hotel?.name || ''}` : 'Loading...'} />
                        <CardContent>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Box sx={{ flex: '1 1 120px' }}>
                                    <Typography variant="body2" color="text.secondary">Check-in</Typography>
                                    <Typography variant="h6">{formatDateOnly(checkInDate)}</Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 120px' }}>
                                    <Typography variant="body2" color="text.secondary">Check-out</Typography>
                                    <Typography variant="h6">{formatDateOnly(checkOutDate)}</Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 100%' }}>
                                    <Typography variant="body2" color="text.secondary">Room</Typography>
                                    <Typography variant="h6">{room ? `${room.roomType?.name || ''}` : 'Loading...'}</Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 100%' }}>
                                    <Typography variant="body2" color="text.secondary">Total</Typography>
                                    <Typography variant="h5">{totalAmount.toFixed(2)}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader title="Special requests" subheader="Optional" />
                        <CardContent>
                            <Form layout="vertical">
                                <FormItemWithVerification
                                    type="textarea"
                                    name="specialRequests"
                                    label="Special requests"
                                    placeholder="e.g. Late arrival, allergy notes"
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
                        <CardHeader title="Guest details" subheader="We need details for every guest" />
                        <CardContent>
                            <Form layout="vertical">
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    {guestForms.map((guest, idx) => (
                                        <Box key={idx}>
                                            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="subtitle1">Guest {idx + 1}</Typography>
                                                <Typography variant="caption" color="text.secondary">{idx === 0 ? 'Primary guest' : 'Additional guest'}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                                <Box sx={{ flex: '1 1 220px' }}>
                                                    <FormItemWithVerification
                                                        type="text"
                                                        name={`guest-${idx}-firstName`}
                                                        label="First name"
                                                        required
                                                        value={guest.firstName}
                                                        onChange={(e) => handleGuestChange(idx, 'firstName', (e as any)?.target?.value ?? e)}
                                                    />
                                                </Box>
                                                <Box sx={{ flex: '1 1 220px' }}>
                                                    <FormItemWithVerification
                                                        type="text"
                                                        name={`guest-${idx}-lastName`}
                                                        label="Last name"
                                                        required
                                                        value={guest.lastName}
                                                        onChange={(e) => handleGuestChange(idx, 'lastName', (e as any)?.target?.value ?? e)}
                                                    />
                                                </Box>
                                                <Box sx={{ flex: '1 1 220px' }}>
                                                    <FormItemWithVerification
                                                        type="email"
                                                        name={`guest-${idx}-email`}
                                                        label="Email"
                                                        required={idx === 0}
                                                        value={guest.email}
                                                        onChange={(e) => handleGuestChange(idx, 'email', (e as any)?.target?.value ?? e)}
                                                    />
                                                </Box>
                                                <Box sx={{ flex: '1 1 220px' }}>
                                                    <FormItemWithVerification
                                                        type="text"
                                                        name={`guest-${idx}-phone`}
                                                        label={t("user.editProfile.phone", "Phone number") as string}
                                                        placeholder={t("user.editProfile.phonePlaceholder", "+48 123 456 789") as string}
                                                        required={idx === 0}
                                                        value={guest.phoneNumber}
                                                        minLength={6}
                                                        onChange={(e) => handleGuestChange(idx, 'phoneNumber', (e as any)?.target?.value ?? e)}

                                                    />
                                                </Box>
                                                {idx === 0 ? (
                                                    <Box sx={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                        <Typography variant="body2">Primary guest (adult)</Typography>
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
                                                            label={guest.isChild ? 'Child' : 'Adult'}
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
                                            Confirm reservation
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
