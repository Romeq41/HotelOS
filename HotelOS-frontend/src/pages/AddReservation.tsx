import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { RoomDto, ReservationDtoStatusEnum, ReservationDto, UserDto } from '../api/generated/api';
import { useLoading } from '../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { getPermissionContext, getReturnUrl } from '../utils/routeUtils';
import { useApi } from '../api/useApi';
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

export default function AddReservation() {
    const { hotelId } = useParams<{ hotelId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [rooms, setRooms] = useState<RoomDto[]>([]);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { Option } = Select;
    const { hotel: hotelApi, reservation: reservationApi } = useApi();

    // Get current permission context based on the URL path
    const getCurrentPermissionContext = () => {
        return getPermissionContext(location.pathname);
    };

    // Get the appropriate return URL after form submission
    const getCurrentReturnUrl = () => {
        const permissionContext = getCurrentPermissionContext();
        return getReturnUrl(permissionContext, hotelId || '', 'reservations');
    };

    useEffect(() => {
        const fetchRooms = async () => {
            showLoader();
            try {
                const { data } = await hotelApi.getRoomsByHotelId(Number(hotelId), 0, 1000);
                setRooms(((data as any).content ?? data) as RoomDto[]);
            } catch (err) {
                console.error('Error fetching rooms:', err);
            } finally {
                hideLoader();
            }
        };
        fetchRooms();
    }, [hotelId]);

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
            const reservationData: ReservationDto = {
                room: selectedRoom as RoomDto,
                reservationName: values.reservationName,
                checkInDate: values.checkInDate.format('YYYY-MM-DD'),
                checkOutDate: values.checkOutDate.format('YYYY-MM-DD'),
                status: values.status as ReservationDtoStatusEnum,
                totalAmount: values.totalAmount,
                user: values.guestId ? ({ userId: Number(values.guestId) } as UserDto) : undefined,
            };

            await reservationApi.addReservation(reservationData as any);
            message.success(t('admin.reservations.form.success', 'Reservation Added!'));
            form.resetFields();

            setTimeout(() => {
                navigate(getCurrentReturnUrl());
            }, 1500);

        } catch (error) {
            console.error('Error adding reservation:', error);
            message.error(t('admin.reservations.form.error', 'Failed to create reservation'));
        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div style={{ marginTop: '5rem', padding: '20px' }}>
                <Card
                    title={t('admin.reservations.addReservation', 'Add New Reservation')}
                    variant="outlined"
                    style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        onValuesChange={onValuesChange}
                        initialValues={{
                            status: ReservationDtoStatusEnum.Pending,
                            totalAmount: 0
                        }}
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
                                                {`${room.roomNumber} - ${room.roomType?.name ?? room.roomType} (${t('admin.reservations.form.price', 'Price')}: $${room.price})`}
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
                                        {Object.values(ReservationDtoStatusEnum).map((status) => (
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
                                    {t('admin.reservations.addReservation', 'Add Reservation')}
                                </Button>
                                <Button
                                    onClick={() => navigate(getCurrentReturnUrl())}
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