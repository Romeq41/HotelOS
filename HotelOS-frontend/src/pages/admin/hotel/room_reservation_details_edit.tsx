import React, { useEffect, useState } from 'react';
import { Room } from '../../../interfaces/Room';
import { ReservationStatus } from '../../../interfaces/Reservation';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoading } from '../../../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';

export default function EditReservation() {
    const { hotelId, reservationId } = useParams<{ hotelId: string; reservationId: string }>();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        guestId: '',
        roomId: '',
        reservationName: '',
        checkInDate: '',
        checkOutDate: '',
        status: ReservationStatus.PENDING,
        totalAmount: '',
    });

    const [errors, setErrors] = useState({
        guestId: '',
        roomId: '',
        reservationName: '',
        checkInDate: '',
        checkOutDate: '',
        status: '',
        totalAmount: '',
    });

    useEffect(() => {
        const fetchRooms = async () => {
            showLoader();
            try {
                const res = await fetch(`http://localhost:8080/api/hotels/${hotelId}/rooms`, {
                    headers: {
                        Authorization: `Bearer ${document.cookie.replace(
                            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                            '$1'
                        )}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setRooms(data.content);
                }
            } catch (err) {
                console.error('Error fetching rooms:', err);
            }
            hideLoader();
        };

        const fetchReservation = async () => {
            showLoader();
            try {
                const res = await fetch(`http://localhost:8080/api/reservations/${reservationId}`, {
                    headers: {
                        Authorization: `Bearer ${document.cookie.replace(
                            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                            '$1'
                        )}`,
                    },
                });
                if (res.ok) {
                    const reservation = await res.json();
                    setFormData({
                        guestId: reservation.guestId || '',
                        roomId: reservation.room?.roomId || '',
                        reservationName: reservation.reservationName || '',
                        checkInDate: reservation.checkInDate
                            ? new Date(reservation.checkInDate).toISOString().split('T')[0]
                            : '',
                        checkOutDate: reservation.checkOutDate
                            ? new Date(reservation.checkOutDate).toISOString().split('T')[0]
                            : '',
                        status: reservation.status || ReservationStatus.PENDING,
                        totalAmount: reservation.totalAmount || '',
                    });
                }
            } catch (err) {
                console.error('Error fetching reservation:', err);
            }
            hideLoader();
        };

        fetchRooms();
        fetchReservation();
        console.log('Form data:', formData);
    }, [hotelId, reservationId]);

    useEffect(() => {
        if (formData.checkInDate && formData.checkOutDate && formData.roomId) {
            const checkIn = new Date(formData.checkInDate);
            const checkOut = new Date(formData.checkOutDate);
            const diff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
            const selectedRoom = rooms.find((r) => r.roomId === formData.roomId);
            if (diff > 0 && selectedRoom) {
                setFormData((prev) => ({
                    ...prev,
                    totalAmount: String(diff * (selectedRoom.rate ?? 0)),
                }));
            } else {
                setFormData((prev) => ({ ...prev, totalAmount: '' }));
            }
        }
    }, [formData.checkInDate, formData.checkOutDate, formData.roomId, rooms]);

    const validate = () => {
        const newErrors: any = {};
        if (!formData.roomId) newErrors.roomId = t('admin.reservations.form.errors.roomRequired', 'Room ID is required');
        if (!formData.checkInDate) newErrors.checkInDate = t('admin.reservations.form.errors.checkInRequired', 'Check-in date is required');
        if (!formData.checkOutDate) newErrors.checkOutDate = t('admin.reservations.form.errors.checkOutRequired', 'Check-out date is required');
        if (!formData.status) newErrors.status = t('admin.reservations.form.errors.statusRequired', 'Status is required');
        if (!formData.totalAmount) newErrors.totalAmount = t('admin.reservations.form.errors.totalCalculationError', 'Unable to calculate total');
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.values(validationErrors).every((err) => err === '')) {
            showLoader();
            try {
                const response = await fetch(`http://localhost:8080/api/reservations/${reservationId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${document.cookie.replace(
                            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                            '$1'
                        )}`,
                    },
                    body: JSON.stringify({
                        guestId: formData.guestId ? Number(formData.guestId) : null,
                        room: rooms.find((r) => r.roomId === formData.roomId),
                        reservationName: formData.reservationName,
                        checkInDate: formData.checkInDate,
                        checkOutDate: formData.checkOutDate,
                        status: formData.status,
                        totalAmount: Number(formData.totalAmount),
                    }),
                });
                if (response.ok) {
                    console.log('Response:', await response.json());
                    navigate(`/admin/hotels/${hotelId}/reservations`);
                }
            } catch (error) {
                console.error('Error updating reservation:', error);
            }
            hideLoader();
        }
    };

    const getInputClass = (field: keyof typeof formData) => {
        if (errors[field]) return 'border-red-500';
        if (formData[field]) return 'border-green-500';
        return 'border-gray-400';
    };

    const reservationStatuses = Object.values(ReservationStatus);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mt-20 mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    {t('admin.reservations.edit.title', 'Edit Reservation')}
                </h1>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
                    {/* Guest ID */}
                    <div>
                        <label htmlFor="guestId" className="block text-sm font-medium text-gray-700">
                            {t('admin.reservations.form.fields.guestId', 'Guest ID')}
                            ({t('common.optional', 'optional')})
                        </label>
                        <input
                            type="text"
                            id="guestId"
                            name="guestId"
                            value={formData.guestId}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md p-2 border shadow focus:ring-1 focus:ring-blue-500 ${getInputClass('guestId')}`}
                        />
                        {errors.guestId && <p className="text-red-500 text-sm mt-1">{errors.guestId}</p>}
                    </div>

                    {/* Room ID */}
                    <div>
                        <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
                            {t('admin.reservations.form.fields.roomId', 'Room ID')}
                        </label>
                        <select
                            id="roomId"
                            name="roomId"
                            value={formData.roomId}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md p-2 border shadow focus:ring-1 focus:ring-blue-500 ${getInputClass('roomId')}`}
                        >
                            <option value="">{t('admin.reservations.form.selectRoom', 'Select a room')}</option>
                            {rooms.length > 1 && rooms.map((r) => (
                                <option key={r.roomId} value={r.roomId}>
                                    {`${r.roomNumber} (${t('admin.reservations.form.rate', 'Rate')}: ${r.rate ?? 0})`}
                                </option>
                            ))}
                        </select>
                        {errors.roomId && <p className="text-red-500 text-sm mt-1">{errors.roomId}</p>}
                    </div>

                    {/* Reservation Name */}
                    <div>
                        <label htmlFor="reservationName" className="block text-sm font-medium text-gray-700">
                            {t('admin.reservations.form.fields.reservationName', 'Reservation Name')}
                        </label>
                        <input
                            type="text"
                            id="reservationName"
                            name="reservationName"
                            value={formData.reservationName}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md p-2 border shadow focus:ring-1 focus:ring-blue-500 ${getInputClass('reservationName')}`}
                        />
                        {errors.reservationName && (
                            <p className="text-red-500 text-sm mt-1">{errors.reservationName}</p>
                        )}
                    </div>

                    {/* Check-In */}
                    <div>
                        <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">
                            {t('admin.reservations.form.fields.checkInDate', 'Check-in Date')}
                        </label>
                        <input
                            type="date"
                            id="checkInDate"
                            name="checkInDate"
                            value={formData.checkInDate}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md p-2 border shadow focus:ring-1 focus:ring-blue-500 ${getInputClass('checkInDate')}`}
                        />
                        {errors.checkInDate && <p className="text-red-500 text-sm mt-1">{errors.checkInDate}</p>}
                    </div>

                    {/* Check-Out */}
                    <div>
                        <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">
                            {t('admin.reservations.form.fields.checkOutDate', 'Check-out Date')}
                        </label>
                        <input
                            type="date"
                            id="checkOutDate"
                            name="checkOutDate"
                            value={formData.checkOutDate}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md p-2 border shadow focus:ring-1 focus:ring-blue-500 ${getInputClass('checkOutDate')}`}
                        />
                        {errors.checkOutDate && <p className="text-red-500 text-sm mt-1">{errors.checkOutDate}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            {t('admin.reservations.form.fields.status', 'Status')}
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md p-2 border shadow focus:ring-1 focus:ring-blue-500 ${getInputClass('status')}`}
                        >
                            {reservationStatuses.map((stat) => (
                                <option key={stat} value={stat}>
                                    {t(`admin.reservations.status.${stat.toLowerCase()}`, stat)}
                                </option>
                            ))}
                        </select>
                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                    </div>

                    {/* Total Amount */}
                    <div>
                        <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
                            {t('admin.reservations.form.fields.totalAmount', 'Total Amount')}
                        </label>
                        <input
                            type="text"
                            id="totalAmount"
                            name="totalAmount"
                            value={formData.totalAmount}
                            readOnly
                            className={`mt-1 block w-full rounded-md p-2 border shadow focus:ring-1 focus:ring-blue-500 ${getInputClass('totalAmount')}`}
                        />
                        {errors.totalAmount && (
                            <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>
                        )}
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            id="submitButton"
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-6 rounded-md text-lg hover:bg-blue-700"
                        >
                            {t('admin.reservations.edit.saveChanges', 'Save Changes')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}