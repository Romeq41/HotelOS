import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ReservationStatus } from '../../../interfaces/Reservation';
import { useLoading } from '../../../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { getPermissionContext, getReturnUrl } from '../../../utils/routeUtils';
import { RoomDto } from "../../../api/generated/api";
import { FormItemWithVerification } from '../../../components/form';

import moment from 'moment';
import {
    Form,
    Button,
    Select,
    InputNumber,
    DatePicker,
    Row,
    Col,
    Card,
    message,
    Space
} from 'antd';
import useApi from '../../../api/useApi';

export default function EditReservation() {
    const { hotelId, reservationId } = useParams<{ hotelId: string; reservationId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [rooms, setRooms] = useState<RoomDto[]>([]);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { Option } = Select;
    const { hotel: hotelApi, reservation: reservationApi } = useApi();

    const permissionContext = getPermissionContext(location.pathname);

    useEffect(() => {
        const fetchRooms = async () => {
            showLoader();

            try {
                // Get all rooms for this hotel, with pagination to ensure we get everything
                const response = await hotelApi.getRoomsByHotelId(
                    Number(hotelId),
                    0,  // page
                    100, // size - using a large number to get all rooms
                    undefined // roomNumber - not filtering by room number
                );

                // Handle both paginated and direct array response
                const roomsData = Array.isArray(response.data) ? response.data :
                    (response.data.content || []);

                // Sort rooms by room number for better usability
                const sortedRooms = [...roomsData].sort((a, b) =>
                    (a.roomNumber || 0) - (b.roomNumber || 0)
                );

                console.log('Fetched and sorted rooms:', sortedRooms);
                setRooms(sortedRooms);

            } catch (err) {
                console.error('Error fetching rooms:', err);
                message.error(t('admin.reservations.edit.errorFetchingRooms', 'Failed to fetch rooms'));
            } finally {
                hideLoader();
            }
        };

        const fetchReservation = async () => {
            showLoader();
            try {
                // Use generated API instead of direct fetch
                const response = await reservationApi.getReservationById(Number(reservationId));
                const reservation = response.data;

                console.log('Fetched reservation:', reservation);

                // Set form values from response
                form.setFieldsValue({
                    roomId: reservation.room?.roomId?.toString() || null,
                    reservationName: reservation.reservationName || '',
                    checkInDate: reservation.checkInDate ? moment(reservation.checkInDate) : null,
                    checkOutDate: reservation.checkOutDate ? moment(reservation.checkOutDate) : null,
                    status: reservation.status || ReservationStatus.PENDING,
                    totalAmount: reservation.totalAmount || 0,
                    primaryGuestName: reservation.primaryGuestName || '',
                    primaryGuestEmail: reservation.primaryGuestEmail || '',
                    primaryGuestPhone: reservation.primaryGuestPhone || '',
                    numberOfAdults: reservation.numberOfAdults || 1,
                    numberOfChildren: reservation.numberOfChildren || 0,
                    specialRequests: reservation.specialRequests || ''
                });

                // Log the room information
                console.log('Original room:', reservation.room);
            } catch (err) {
                console.error('Error fetching reservation:', err);
                message.error(t('admin.reservations.edit.errorFetchingReservation', 'Failed to load reservation details'));

                // Navigate back after error
                setTimeout(() => {
                    navigate(getReturnUrl(permissionContext, hotelId || '', 'reservations'));
                }, 2000);
            } finally {
                hideLoader();
            }
        };

        fetchRooms();
        fetchReservation();
    }, [hotelId, reservationId, form]);

    const calculateTotal = (values: { checkInDate: { toDate: () => any; }; checkOutDate: { toDate: () => any; }; roomId: string; }) => {
        if (values.checkInDate && values.checkOutDate && values.roomId) {
            const checkIn = values.checkInDate.toDate();
            const checkOut = values.checkOutDate.toDate();
            const diff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
            const selectedRoom = rooms.find((r) => r.roomId.toString() === values.roomId);
            if (diff > 0 && selectedRoom) {
                return diff * (selectedRoom.price ?? 0);
            }
        }
        return 0;
    };

    const onValuesChange = (changedValues: any, allValues: any) => {
        if ('roomId' in changedValues || 'checkInDate' in changedValues || 'checkOutDate' in changedValues) {
            const total = calculateTotal(allValues);
            form.setFieldsValue({ totalAmount: total });
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        showLoader();
        try {
            const selectedRoom = rooms.find((r) => r.roomId.toString() === values.roomId);

            if (!selectedRoom) {
                throw new Error('Selected room not found');
            }

            // Prepare reservation data matching the API contract
            const reservationData = {
                reservationId: Number(reservationId),
                room: selectedRoom,
                reservationName: values.reservationName || '',
                checkInDate: values.checkInDate.format('YYYY-MM-DD'),
                checkOutDate: values.checkOutDate.format('YYYY-MM-DD'),
                status: values.status,
                totalAmount: Number(values.totalAmount),
                primaryGuestName: values.primaryGuestName || '',
                primaryGuestEmail: values.primaryGuestEmail || '',
                primaryGuestPhone: values.primaryGuestPhone || '',
                numberOfAdults: values.numberOfAdults || 1,
                numberOfChildren: values.numberOfChildren || 0,
                specialRequests: values.specialRequests || ''
            };

            console.log('Submitting updated reservation:', reservationData);

            // Call the API endpoint to update the reservation
            const response = await reservationApi.updateReservation(
                Number(reservationId),
                reservationData
            );

            console.log('Update response:', response);
            message.success(t('admin.reservations.edit.success', 'Reservation updated successfully!'));

            // Navigate back to the reservations list
            navigate(getReturnUrl(permissionContext, hotelId || '', 'reservations'));


        } catch (error) {
            console.error('Error updating reservation:', error);
            message.error(t('admin.reservations.edit.error', 'Failed to update reservation'));
        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div style={{ marginTop: '5rem', padding: '20px' }}>
                <Card
                    title={t('admin.reservations.edit.title', 'Edit Reservation')}
                    variant="outlined"
                    style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        onValuesChange={onValuesChange}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <FormItemWithVerification
                                    type="text"
                                    name="primaryGuestName"
                                    label={t('admin.reservations.form.fields.primaryGuestName', 'Primary Guest Name')}
                                    placeholder={t('admin.reservations.form.placeholders.primaryGuestName', 'Enter guest name')}
                                    required
                                    maxLength={100}
                                />
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="roomId"
                                    label={t('admin.reservations.form.fields.roomId', 'Room')}
                                    rules={[{
                                        required: true,
                                        message: t('admin.reservations.form.errors.roomRequired', 'Room is required')
                                    }]}
                                >
                                    <Select
                                        placeholder={t('admin.reservations.form.selectRoom', 'Select a room')}
                                        optionLabelProp="label"
                                        showSearch
                                        optionFilterProp="label"
                                        filterOption={(input, option) => {
                                            // Use the option label for basic filtering
                                            const optionLabel = option?.label?.toString() || '';

                                            // Also search in room type and other properties if available
                                            const roomId = option?.value?.toString();
                                            const room = rooms.find(r => r.roomId?.toString() === roomId);
                                            const roomType = room?.roomType?.name || '';

                                            return (
                                                optionLabel.toLowerCase().includes(input.toLowerCase()) ||
                                                roomType.toLowerCase().includes(input.toLowerCase())
                                            );
                                        }}
                                        style={{ width: '100%' }}
                                    >
                                        {rooms.length > 0 ? rooms.map((room, index) => (
                                            <Option
                                                key={`${room.roomId}-${index}`}
                                                value={room.roomId?.toString()}
                                                label={`Room ${room.roomNumber}`}
                                            >
                                                <div className="room-option-container">
                                                    <strong>Room {room.roomNumber}</strong>
                                                    {room.roomType?.name && (
                                                        <span className="ml-2">• {room.roomType.name}</span>
                                                    )}
                                                    <span className="ml-2 text-green-600">• ${room.price?.toFixed(2)}</span>
                                                    {room.capacity && (
                                                        <span className="ml-2">• {t('admin.reservations.form.capacity', 'Capacity')}: {room.capacity}</span>
                                                    )}
                                                </div>
                                            </Option>
                                        )) : (
                                            <Option disabled>{t('admin.reservations.form.noRooms', 'No rooms available')}</Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <FormItemWithVerification
                                    type="text"
                                    name="reservationName"
                                    label={t('admin.reservations.form.fields.reservationName', 'Reservation Name')}
                                    placeholder={t('admin.reservations.form.placeholders.reservationName', 'Enter reservation name')}
                                    required
                                    maxLength={100}
                                />
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="status"
                                    label={t('admin.reservations.form.fields.status', 'Status')}
                                    rules={[{
                                        required: true,
                                        message: t('admin.reservations.form.errors.statusRequired', 'Status is required')
                                    }]}
                                >
                                    <Select>
                                        {Object.values(ReservationStatus).map((status) => (
                                            <Option key={status} value={status}>
                                                {t(`admin.reservations.columns.status.${status.toLowerCase()}`, status)}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <FormItemWithVerification
                                    type="email"
                                    name="primaryGuestEmail"
                                    label={t('admin.reservations.form.fields.primaryGuestEmail', 'Primary Guest Email')}
                                    placeholder={t('admin.reservations.form.placeholders.primaryGuestEmail', 'Enter guest email')}
                                    maxLength={100}
                                />
                            </Col>

                            <Col span={12}>
                                <FormItemWithVerification
                                    type="text"
                                    name="primaryGuestPhone"
                                    label={t('admin.reservations.form.fields.primaryGuestPhone', 'Primary Guest Phone')}
                                    placeholder={t('admin.reservations.form.placeholders.primaryGuestPhone', 'Enter guest phone')}
                                    pattern={/^\+?[0-9\s\-\(\)]{8,20}$/}
                                    patternMessage={t('admin.reservations.form.errors.invalidPhone', 'Please enter a valid phone number')}
                                    maxLength={20}
                                />
                            </Col>

                            <Col span={12}>
                                <FormItemWithVerification
                                    type="number"
                                    name="numberOfAdults"
                                    label={t('admin.reservations.form.fields.numberOfAdults', 'Number of Adults')}
                                    required
                                    min={1}
                                    max={20}
                                    minMessage={t('admin.reservations.form.errors.minAdults', 'At least 1 adult is required')}
                                />
                            </Col>

                            <Col span={12}>
                                <FormItemWithVerification
                                    type="number"
                                    name="numberOfChildren"
                                    label={t('admin.reservations.form.fields.numberOfChildren', 'Number of Children')}
                                    min={0}
                                    max={10}
                                />
                            </Col>

                            <Col span={24}>
                                <FormItemWithVerification
                                    type="textarea"
                                    name="specialRequests"
                                    label={t('admin.reservations.form.fields.specialRequests', 'Special Requests')}
                                    placeholder={t('admin.reservations.form.placeholders.specialRequests', 'Enter any special requests or notes')}
                                    rows={3}
                                    maxLength={500}
                                />
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="checkInDate"
                                    label={t('admin.reservations.form.fields.checkInDate', 'Check-in Date')}
                                    rules={[{
                                        required: true,
                                        message: t('admin.reservations.form.errors.checkInRequired', 'Check-in date is required')
                                    }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="checkOutDate"
                                    label={t('admin.reservations.form.fields.checkOutDate', 'Check-out Date')}
                                    dependencies={['checkInDate']}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('admin.reservations.form.errors.checkOutRequired', 'Check-out date is required')
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const checkInDate = getFieldValue('checkInDate');
                                                if (!value || !checkInDate) {
                                                    return Promise.resolve();
                                                }
                                                if (value.isBefore(checkInDate) || value.isSame(checkInDate)) {
                                                    return Promise.reject(
                                                        t('admin.reservations.form.errors.dateRange', 'Check-out date must be after check-in date')
                                                    );
                                                }
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="totalAmount"
                                    label={t('admin.reservations.form.fields.totalAmount', 'Total Amount')}
                                >
                                    <InputNumber
                                        prefix="$"
                                        style={{ width: '100%' }}
                                        min={0}
                                        readOnly
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <div className="info-box bg-gray-50 p-4 rounded mb-4">
                                    <p>
                                        <strong>{t('admin.hotels.rooms.fields.hotelId', 'Hotel ID')}:</strong> {hotelId}
                                    </p>
                                    <p>
                                        <strong>{t('admin.reservations.details.id', 'Reservation ID')}:</strong> {reservationId}
                                    </p>
                                </div>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Space>
                                <Button
                                    id="submitButton"
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    {t('admin.reservations.edit.saveChanges', 'Save Changes')}
                                </Button>
                                <Button
                                    onClick={() => navigate(getReturnUrl(permissionContext, hotelId || '', 'reservations'))}
                                >
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
}