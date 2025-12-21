import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useLoading } from "../../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../contexts/UserContext";
import { UserType } from "../../../interfaces/User";
import { useApi } from "../../../api/useApi";
import { RoomTypeDto, HotelDto } from "../../../api/generated/api";
import {
    Form,
    Input,
    Button,
    Spin,
    Row,
    Col,
    Card,
    message,
    Space,
    InputNumber,
    Switch
} from "antd";

export default function Admin_Hotel_Room_Type_Add() {
    const { hotelId } = useParams<{ hotelId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user: currentUser } = useUser();
    const [form] = Form.useForm();
    const [hotel, setHotel] = useState<HotelDto | null>(null);
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const { hotel: hotelApi, roomTypes: roomTypesApi } = useApi();

    // Helper function to determine the correct base path
    const getBasePath = () => {
        const path = location.pathname;
        if (path.includes('/admin/')) {
            return '/admin/hotels';
        } else if (path.includes('/manager/')) {
            return '/manager/hotel';
        }
        // Default fallback based on user role
        return currentUser?.userType === UserType.ADMIN
            ? '/admin/hotels'
            : '/manager/hotel';
    };

    useEffect(() => {
        const fetchHotelData = async () => {
            if (!hotelId) return;
            showLoader();
            try {
                const response = await hotelApi.getHotelById(Number(hotelId));
                const hotelData = response.data as HotelDto;
                setHotel(hotelData);
            } catch (error: any) {
                console.error("Error fetching hotel data:", error);

                if (error.response?.status === 401 || error.response?.status === 403) {
                    message.error(t('common.unauthorized', 'Unauthorized access'));
                    navigate('/login');
                    return;
                }

                message.error(t('admin.hotels.roomTypes.fetchError', 'Failed to load hotel data'));
            }
            hideLoader();
        };

        fetchHotelData();
    }, [hotelId]);

    const onFinish = async (values: any) => {
        if (!hotelId) return;
        setLoading(true);
        showLoader();

        try {
            console.log("Form values:", values);

            // Create the RoomTypeDto object from form values
            const roomTypeDto: RoomTypeDto = {
                name: values.name,
                priceFactor: Number(values.priceFactor),
                description: values.description,
                hotelId: Number(hotelId),
                active: values.active !== undefined ? values.active : true
            };

            // Create room type using the API
            await roomTypesApi.createRoomType(roomTypeDto);

            message.success(t('admin.hotels.roomTypes.add.createSuccess', 'Room type created successfully'));

            // Navigate back to the room details edit page or rooms list
            const basePath = getBasePath();
            const returnPath = new URLSearchParams(location.search).get('returnTo');
            if (returnPath) {
                navigate(returnPath);
            } else {
                navigate(`${basePath}/${hotelId}/rooms`);
            }
        } catch (error: any) {
            console.error("Error creating room type:", error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                message.error(t('common.unauthorized', 'Unauthorized access'));
                navigate('/login');
                return;
            }

            message.error(t('admin.hotels.roomTypes.add.createError', 'Failed to create room type'));
        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    const handleCancel = () => {
        const basePath = getBasePath();
        const returnPath = new URLSearchParams(location.search).get('returnTo');
        if (returnPath) {
            navigate(returnPath);
        } else {
            navigate(`${basePath}/${hotelId}/rooms`);
        }
    };

    const validatePriceFactor = (_: any, value: number) => {
        if (!value) {
            return Promise.reject(t('admin.hotels.roomTypes.validation.priceFactorRequired', 'Please input price factor!'));
        }
        if (value <= 0) {
            return Promise.reject(t('admin.hotels.roomTypes.validation.priceFactorPositive', 'Price factor must be greater than 0!'));
        }
        if (value > 10) {
            return Promise.reject(t('admin.hotels.roomTypes.validation.priceFactorMax', 'Price factor should not exceed 10!'));
        }
        return Promise.resolve();
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="mt-20 p-5 flex justify-center">
                <Card
                    title={
                        <div className="mt-5">
                            {t('admin.hotels.roomTypes.add.title', 'Add Room Type')}
                            {hotel && (
                                <div className="text-sm font-normal text-gray-500 mt-1">
                                    {t('admin.hotels.roomTypes.add.forHotel', 'for {{hotelName}}', { hotelName: hotel.name })}
                                </div>
                            )}
                        </div>
                    }
                    variant="outlined"
                    className="w-full max-w-4xl"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            active: true,
                            priceFactor: 1.0
                        }}
                    >
                        {hotel ? (
                            <>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="name"
                                            label={t('admin.hotels.roomTypes.fields.name', 'Room Type Name')}
                                            rules={[
                                                { required: true, message: t('admin.hotels.roomTypes.validation.nameRequired', 'Please input room type name!') },
                                                { min: 2, message: t('admin.hotels.roomTypes.validation.nameMinLength', 'Name must be at least 2 characters!') },
                                                { max: 50, message: t('admin.hotels.roomTypes.validation.nameMaxLength', 'Name must not exceed 50 characters!') }
                                            ]}
                                        >
                                            <Input
                                                placeholder={t('admin.hotels.roomTypes.placeholders.name', 'e.g., Standard, Deluxe, Suite')}
                                                maxLength={50}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="priceFactor"
                                            label={
                                                <span>
                                                    {t('admin.hotels.roomTypes.fields.priceFactor', 'Price Factor')}
                                                    <span className="text-gray-500 text-xs ml-2">
                                                        ({t('admin.hotels.roomTypes.fields.multiplier', 'Multiplier for base price')})
                                                    </span>
                                                </span>
                                            }
                                            rules={[{ validator: validatePriceFactor }]}
                                        >
                                            <InputNumber
                                                className="w-full"
                                                min={0.1}
                                                max={10}
                                                step={0.1}
                                                precision={1}
                                                placeholder="1.0"
                                            />
                                        </Form.Item>
                                        <div className="-mt-4 mb-4 text-xs text-gray-500">
                                            {t('admin.hotels.roomTypes.hints.priceFactor', 'Examples: 1.0 = base price, 1.5 = 50% more, 0.8 = 20% less')}
                                        </div>
                                    </Col>
                                </Row>

                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="description"
                                            label={t('admin.hotels.roomTypes.fields.description', 'Description')}
                                            rules={[
                                                { max: 500, message: t('admin.hotels.roomTypes.validation.descriptionMaxLength', 'Description must not exceed 500 characters!') }
                                            ]}
                                        >
                                            <Input.TextArea
                                                rows={4}
                                                placeholder={t('admin.hotels.roomTypes.placeholders.description', 'Describe the room type features, amenities, and what makes it special...')}
                                                maxLength={500}
                                                showCount
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="active"
                                            label={t('admin.hotels.roomTypes.fields.active', 'Active')}
                                            valuePropName="checked"
                                        >
                                            <Switch
                                                checkedChildren={t('admin.hotels.roomTypes.status.active', 'Active')}
                                                unCheckedChildren={t('admin.hotels.roomTypes.status.inactive', 'Inactive')}
                                            />
                                        </Form.Item>
                                        <div className="-mt-4 mb-4 text-xs text-gray-500">
                                            {t('admin.hotels.roomTypes.hints.active', 'Only active room types can be assigned to rooms')}
                                        </div>
                                    </Col>
                                </Row>

                                {/* Preview Section */}
                                <Card
                                    size="small"
                                    title={t('admin.hotels.roomTypes.preview.title', 'Preview')}
                                    className="mb-6 bg-gray-50"
                                >
                                    <div className="text-sm text-gray-600">
                                        <div className="mb-2">
                                            <strong>{t('admin.hotels.roomTypes.preview.hotel', 'Hotel')}:</strong> {hotel.name}
                                        </div>
                                        <div className="mb-2">
                                            <strong>{t('admin.hotels.roomTypes.preview.basePrice', 'Base Price')}:</strong> ${hotel.basePrice?.toFixed(2) || '0.00'}
                                        </div>
                                        <div className="mb-2">
                                            <strong>{t('admin.hotels.roomTypes.preview.calculatedPrice', 'Price with Factor')}:</strong> ${
                                                ((hotel.basePrice || 0) * (form.getFieldValue('priceFactor') || 1)).toFixed(2)
                                            }
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {t('admin.hotels.roomTypes.preview.formula', 'Formula: Base Price × Price Factor = {{basePrice}} × {{factor}} = {{result}}', {
                                                basePrice: hotel.basePrice?.toFixed(2) || '0.00',
                                                factor: (form.getFieldValue('priceFactor') || 1).toFixed(1),
                                                result: ((hotel.basePrice || 0) * (form.getFieldValue('priceFactor') || 1)).toFixed(2)
                                            })}
                                        </div>
                                    </div>
                                </Card>

                                <Form.Item>
                                    <Space>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            size="large"
                                        >
                                            {t('admin.hotels.roomTypes.add.create', 'Create Room Type')}
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            size="large"
                                        >
                                            {t('common.cancel', 'Cancel')}
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </>
                        ) : (
                            <div className="text-center p-5">
                                <Spin size="large" />
                                <p className="mt-2">
                                    {t('admin.hotels.roomTypes.add.loading', 'Loading hotel data...')}
                                </p>
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </div>
    );
}
