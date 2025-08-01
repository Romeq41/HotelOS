import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Room } from '../../../interfaces/Room';
import { ReservationStatus } from '../../../interfaces/Reservation';
import { useLoading } from '../../../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { UserType } from '../../../interfaces/User';
import moment from 'moment';
import {
    Form,
    Input,
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

export default function EditReservation() {
    const { hotelId, reservationId } = useParams<{ hotelId: string; reservationId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [rooms, setRooms] = useState<Room[]>([]);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { Option } = Select;

    const getPermissionContext = () => {
        if (location.pathname.includes('/admin/')) {
            return UserType.ADMIN;
        } else if (location.pathname.includes('/manager/')) {
            return UserType.MANAGER;
        } else if (location.pathname.includes('/staff/')) {
            return UserType.STAFF;
        }
    };

    const getReturnUrl = () => {
        const permissionContext = getPermissionContext();
        if (permissionContext === UserType.ADMIN) {
            return `/admin/hotels/${hotelId}/reservations`;
        } else if (permissionContext === UserType.MANAGER) {
            return `/manager/hotel/${hotelId}/reservations`;
        } else if (permissionContext === UserType.STAFF) {
            return `/staff/${hotelId}/reservations`;
        }
        return '/';
    };

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
                    setRooms(data.content || data);
                }
            } catch (err) {
                console.error('Error fetching rooms:', err);
            } finally {
                hideLoader();
            }
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
                    form.setFieldsValue({
                        guestId: reservation.guestId || null,
                        roomId: reservation.room?.roomId?.toString() || null,
                        reservationName: reservation.reservationName || '',
                        checkInDate: reservation.checkInDate ? moment(reservation.checkInDate) : null,
                        checkOutDate: reservation.checkOutDate ? moment(reservation.checkOutDate) : null,
                        status: reservation.status || ReservationStatus.PENDING,
                        totalAmount: reservation.totalAmount || 0,
                    });
                }
            } catch (err) {
                console.error('Error fetching reservation:', err);
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
                return diff * (selectedRoom.rate ?? 0);
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

    const onFinish = async (values: { roomId: string; guestId: any; reservationName: any; checkInDate: { format: (arg0: string) => any; }; checkOutDate: { format: (arg0: string) => any; }; status: any; totalAmount: any; }) => {
        setLoading(true);
        showLoader();
        try {
            const selectedRoom = rooms.find((r) => r.roomId.toString() === values.roomId);
            const reservationData = {
                guestId: values.guestId ? Number(values.guestId) : null,
                room: selectedRoom,
                reservationName: values.reservationName,
                checkInDate: values.checkInDate.format('YYYY-MM-DD'),
                checkOutDate: values.checkOutDate.format('YYYY-MM-DD'),
                status: values.status,
                totalAmount: Number(values.totalAmount),
            };

            const response = await fetch(`http://localhost:8080/api/reservations/${reservationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${document.cookie.replace(
                        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                        '$1'
                    )}`,
                },
                body: JSON.stringify(reservationData),
            });

            if (!response.ok) {
                if (response.status === 400) {
                    const errors = await response.json();
                    for (const [field, message] of Object.entries(errors)) {
                        console.error(`${field}: ${message}`);
                    }
                } else {
                    throw new Error('Failed to update reservation');
                }
            }
            message.success(t('admin.reservations.edit.success', 'Reservation updated successfully!'));

            navigate(getReturnUrl());


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
                                <Form.Item
                                    name="guestId"
                                    label={t('admin.reservations.form.fields.guestId', 'Guest ID')}
                                >
                                    <InputNumber style={{ width: '100%' }} />
                                </Form.Item>
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
                                    <Select placeholder={t('admin.reservations.form.selectRoom', 'Select a room')}>
                                        {rooms.map(room => (
                                            <Option key={room.roomId} value={room.roomId.toString()}>
                                                {`${room.roomNumber} - ${room.type} (${t('admin.reservations.form.rate', 'Rate')}: $${room.rate})`}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="reservationName"
                                    label={t('admin.reservations.form.fields.reservationName', 'Reservation Name')}
                                >
                                    <Input maxLength={100} />
                                </Form.Item>
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
                                    onClick={() => navigate(getReturnUrl())}
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