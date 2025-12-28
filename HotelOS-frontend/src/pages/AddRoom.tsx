import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useLoading } from '../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { UserType } from '../interfaces/User';
import { useApi } from '../api/useApi';
import { RoomDto, HotelDto, RoomDtoStatusEnum, PageHotelDto, RoomTypeDto } from '../api/generated/api';
import {
    Form,
    Input,
    Select,
    Button,
    Upload,
    Spin,
    Row,
    Col,
    Card,
    message,
    Space,
    InputNumber,
    Tooltip,
    Alert
} from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

export default function AddRoom() {
    const { hotelId } = useParams<{ hotelId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user: currentUser } = useUser();
    const [form] = Form.useForm();
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const { room: roomApi, hotel: hotelApi, roomTypes: roomTypesApi } = useApi();
    const [selectedHotel, setSelectedHotel] = useState<HotelDto | null>(null);
    const [hotels, setHotels] = useState<HotelDto[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomTypeDto[]>([]);
    const [hotelPage, setHotelPage] = useState(0);
    const [totalHotelPages, setTotalHotelPages] = useState(0);
    const [hotelSearchQuery, setHotelSearchQuery] = useState("");
    const [hotelLoading, setHotelLoading] = useState(false);
    const [primaryImage, setPrimaryImage] = useState<UploadFile | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const PAGE_SIZE = 10;
    const { Option } = Select;

    // Primary image upload props (creation mode - just collect file)
    const primaryImageUploadProps: UploadProps = {
        onRemove: () => {
            setPrimaryImage(null);
        },
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error(t('admin.hotels.edit.imageTypeError', 'You can only upload image files!'));
                return Upload.LIST_IGNORE;
            }
            const isLessThan5MB = file.size / 1024 / 1024 < 5;
            if (!isLessThan5MB) {
                message.error(t('admin.hotels.edit.imageSizeError', 'Image must be smaller than 5MB!'));
                return Upload.LIST_IGNORE;
            }
            setPrimaryImage({
                uid: `primary-${Date.now()}`,
                name: file.name,
                status: 'uploading',
                originFileObj: file,
            });
            return false;
        },
        fileList: primaryImage ? [primaryImage] : [],
        maxCount: 1,
        listType: 'picture-card',
    };

    // Additional images upload props (collection only)
    const uploadProps: UploadProps = {
        onRemove: () => {
            setFileList([]);
        },
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error(t('admin.hotels.edit.imageTypeError', 'You can only upload image files!'));
                return Upload.LIST_IGNORE;
            }

            const isLessThan5MB = file.size / 1024 / 1024 < 5;
            if (!isLessThan5MB) {
                message.error(t('admin.hotels.edit.imageSizeError', 'Image must be smaller than 5MB!'));
                return Upload.LIST_IGNORE;
            }
            setFileList([file]);
            return false;
        },
        fileList,
        maxCount: 9,
        multiple: true,
        listType: 'picture-card',
    };

    // Helpers copied from edit form
    const calculatePrice = (basePrice: number, priceModifier?: number, roomTypeFactor?: number) => {
        const modifier = priceModifier || 1;
        const typeFactor = roomTypeFactor || 1;
        return basePrice * modifier * typeFactor;
    };

    const formatRoomTypeName = (roomType: RoomTypeDto): string => {
        if (!roomType.name) return 'Unknown';
        return roomType.name.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getBasePath = () => {
        const path = location.pathname;
        if (path.includes('/admin/')) return '/admin/hotels';
        if (path.includes('/manager/')) return '/manager/hotel';
        return currentUser?.userType === UserType.Admin ? '/admin/hotels' : '/manager/hotel';
    };

    const fetchRoomTypes = async () => {
        try {
            const response = await roomTypesApi.getAllRoomTypes();
            const data = response.data as RoomTypeDto[] | RoomTypeDto;
            setRoomTypes(Array.isArray(data) ? data : [data]);
        } catch (error) {
            message.error(t('admin.hotels.rooms.edit.roomTypesFetchError', 'Failed to load room types'));
        }
    };

    const fetchHotels = async (page: number, nameQuery: string) => {
        setHotelLoading(true);
        try {
            const response = await hotelApi.getAllHotels(page, PAGE_SIZE, nameQuery || undefined);
            const data = response.data as PageHotelDto;
            if (page === 0) {
                setHotels(data.content || []);
            } else {
                const newHotels = data.content || [];
                const existingIds = new Set(hotels.map(h => h.id));
                const uniqueNewHotels = newHotels.filter(h => !existingIds.has(h.id));
                setHotels(prev => [...prev, ...uniqueNewHotels]);
            }
            setHotelPage(data.number || 0);
            setTotalHotelPages(data.totalPages || 0);
        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                message.error(t('common.unauthorized', 'Unauthorized access'));
                navigate('/login');
                return;
            }
            message.error(t('admin.hotels.rooms.edit.hotelFetchError', 'Failed to load hotels'));
        }
        setHotelLoading(false);
    };

    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 1 && hotelPage < totalHotelPages - 1) {
            fetchHotels(hotelPage + 1, hotelSearchQuery);
        }
    };

    const handleHotelSearch = (value: string) => {
        setHotelSearchQuery(value);
        fetchHotels(0, value);
    };

    const handleHotelChange = async (hid: number) => {
        const selected = hotels.find(h => h.id === hid);
        if (selected) {
            setSelectedHotel(selected);
        } else {
            try {
                const res = await hotelApi.getHotelById(hid);
                setSelectedHotel(res.data as HotelDto);
            } catch { }
        }
        // Recompute price when hotel changes
        const priceModifier = form.getFieldValue('priceModifier') || 1;
        const rtId = form.getFieldValue('roomType');
        const rt = roomTypes.find(r => r.id === rtId);
        if (selectedHotel || selected) {
            const base = (selectedHotel || selected)?.basePrice || 0;
            form.setFieldValue('price', calculatePrice(base, priceModifier, rt?.priceFactor));
        }
    };

    const handlePriceModifierChange = (value: number | null) => {
        if (selectedHotel?.basePrice !== undefined) {
            const modifier = value || 1;
            const roomTypeId = form.getFieldValue('roomType');
            const rt = roomTypes.find(r => r.id === roomTypeId);
            form.setFieldValue('price', calculatePrice(selectedHotel.basePrice, modifier, rt?.priceFactor));
        }
    };

    const handleRoomTypeChange = (roomTypeId: number) => {
        if (selectedHotel?.basePrice !== undefined) {
            const modifier = form.getFieldValue('priceModifier') || 1;
            const rt = roomTypes.find(r => r.id === roomTypeId);
            form.setFieldValue('price', calculatePrice(selectedHotel.basePrice, modifier, rt?.priceFactor));
        }
    };

    useEffect(() => {
        showLoader();
        Promise.all([fetchHotels(0, ''), fetchRoomTypes()]).finally(() => hideLoader());
    }, []);

    // Refresh room types when returning to the page (e.g., after adding a new room type)
    useEffect(() => {
        const handleFocus = () => {
            fetchRoomTypes();
        };
        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const handleAddRoomType = () => {
        const basePath = getBasePath();
        const currentPath = location.pathname + location.search;
        const targetHotelId = form.getFieldValue('hotel') || hotelId;
        if (!targetHotelId) {
            message.info(t('admin.hotels.rooms.add.selectHotelFirst', 'Please select a hotel first'));
            return;
        }
        navigate(`${basePath}/${targetHotelId}/room-types/add?returnTo=${encodeURIComponent(currentPath)}`);
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        showLoader();
        setSubmitStatus('idle');
        setErrorMessage('');

        // Find selected room type and hotel object
        const selectedRoomType = roomTypes.find(rt => rt.id === values.roomType);
        if (!selectedRoomType) {
            message.error(t('admin.hotels.rooms.edit.roomTypeError', 'Invalid room type selected'));
            setLoading(false);
            hideLoader();
            return;
        }
        const hotelValue = Number(values.hotel || hotelId);
        let hotelObject: HotelDto | undefined = hotels.find(h => h.id === hotelValue);
        if (!hotelObject) {
            try {
                const res = await hotelApi.getHotelById(hotelValue);
                hotelObject = res.data as HotelDto;
            } catch { }
        }
        if (!hotelObject) {
            message.error(t('admin.hotels.rooms.edit.hotelError', 'Hotel information is missing'));
            setLoading(false);
            hideLoader();
            return;
        }

        // Build RoomDto payload
        const roomData: RoomDto = {
            roomId: 0 as any, // server will assign
            roomNumber: Number(values.roomNumber),
            roomType: selectedRoomType,
            description: values.description,
            capacity: Number(values.capacity),
            price: Number(values.price),
            priceModifier: values.priceModifier ? Number(values.priceModifier) : undefined,
            status: values.status as RoomDtoStatusEnum,
            hotel: hotelObject
        };

        try {
            const response = await roomApi.addRoom(roomData);
            const created = response.data as RoomDto;

            setSubmitStatus('success');

            // Upload primary image if provided
            if (primaryImage && !primaryImage.url && created?.roomId) {
                const primaryFile = primaryImage.originFileObj as File;
                if (primaryFile) {
                    try {
                        await roomApi.uploadPrimaryRoomImage(created.roomId, primaryFile);
                        message.success(t('admin.hotels.edit.primaryImageUploadSuccess', 'Primary image uploaded successfully'));
                    } catch {
                        message.warning(t('admin.hotels.edit.primaryImageUploadError', 'Room created but failed to upload primary image'));
                    }
                }
            }

            // Upload additional images if any
            const newImages = fileList.filter(file => !file.url);
            if (newImages.length > 0 && created?.roomId) {
                const files = newImages.map(f => f.originFileObj as File).filter(Boolean) as File[];
                if (files.length > 0) {
                    try {
                        await roomApi.uploadMultipleRoomImages(created.roomId, files);
                        message.success(t('admin.hotels.edit.imageUploadSuccess', `${files.length} additional image(s) uploaded successfully`));
                    } catch {
                        message.warning(t('admin.hotels.edit.imageUploadPartialError', 'Room created but failed to upload some additional images'));
                    }
                }
            }

            message.success(t('admin.hotels.rooms.add.success', 'Room added successfully'));
            form.resetFields();
            setPrimaryImage(null);
            setFileList([]);

            setTimeout(() => {
                const basePath = getBasePath();
                navigate(`${basePath}/${hotelId || created?.hotel?.id}/rooms`);
            }, 1500);

        } catch (error: any) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
            const msg = error?.response?.data?.message || error?.message || t('admin.hotels.rooms.add.error', 'Failed to create room');
            setErrorMessage(msg);
            message.error(msg);
        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div style={{ marginTop: '5rem', padding: '20px' }}>
                <Card
                    title={t('admin.hotels.rooms.add.title', 'Add New Room')}
                    variant="outlined"
                    style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
                >
                    {submitStatus === 'success' && (
                        <Alert
                            message={t('admin.rooms.successAlert', 'Success')}
                            description={t('admin.rooms.successDescription', 'The room has been successfully added.')}
                            type="success"
                            showIcon
                            className="mb-6"
                            closable
                            onClose={() => setSubmitStatus('idle')}
                        />
                    )}

                    {submitStatus === 'error' && (
                        <Alert
                            message={t('admin.rooms.errorAlert', 'Error')}
                            description={errorMessage || t('admin.rooms.errorDescription', 'There was a problem adding the room. Please try again.')}
                            type="error"
                            showIcon
                            className="mb-6"
                            closable
                            onClose={() => setSubmitStatus('idle')}
                        />
                    )}
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            status: RoomDtoStatusEnum.Available,
                        }}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="roomNumber"
                                    label={t('admin.hotels.rooms.fields.roomNumber', 'Room Number')}
                                    rules={[{ required: true, message: t('admin.hotels.rooms.validation.roomNumberRequired', 'Please input room number!') }]}
                                >
                                    <InputNumber style={{ width: '100%' }} min={1} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="roomType"
                                    label={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{t('admin.hotels.rooms.fields.type', 'Room Type')}</span>
                                            <Button type="link" size="small" onClick={handleAddRoomType}>
                                                + {t('admin.hotels.rooms.addRoomType', 'Add Room Type')}
                                            </Button>
                                        </div>
                                    }
                                    rules={[{ required: true, message: t('admin.hotels.rooms.validation.typeRequired', 'Please select room type!') }]}
                                >
                                    <Select
                                        placeholder={t('admin.hotels.rooms.selectRoomType', 'Select a room type')}
                                        onChange={handleRoomTypeChange}
                                    >
                                        {roomTypes.map((roomType, index) => (
                                            <Option key={`roomType-${roomType.id}-${index}`} value={roomType.id}>
                                                <Tooltip title={`Price factor: ${roomType.priceFactor || 1}x`}>
                                                    <span>
                                                        {formatRoomTypeName(roomType)}
                                                        {roomType.priceFactor ?
                                                            <span style={{ color: '#1890ff', marginLeft: 8 }}>
                                                                ({roomType.priceFactor}x)
                                                            </span>
                                                            : null}
                                                    </span>
                                                </Tooltip>
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="capacity"
                                    label={t('admin.hotels.rooms.fields.capacity', 'Capacity')}
                                    rules={[{ required: true, message: t('admin.hotels.rooms.validation.capacityRequired', 'Please input capacity!') }]}
                                >
                                    <InputNumber style={{ width: '100%' }} min={1} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="price"
                                    label={
                                        <span>
                                            {t('admin.hotels.rooms.fields.price', 'Price')}
                                            <Tooltip title={t('admin.hotels.rooms.fields.priceTooltip', 'Final price = Hotel Base Price × Price Modifier × Room Type Factor')}>
                                                <InfoCircleOutlined style={{ marginLeft: 8 }} />
                                            </Tooltip>
                                        </span>
                                    }
                                >
                                    <InputNumber
                                        prefix="$"
                                        style={{ width: '100%', backgroundColor: '#f5f5f5', color: '#262626' }}
                                        readOnly
                                        precision={2}
                                        formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0.00'}
                                    />
                                </Form.Item>
                                {selectedHotel && (
                                    <div style={{
                                        marginTop: '-16px',
                                        marginBottom: '16px',
                                        fontSize: '12px',
                                        color: '#8c8c8c'
                                    }}>
                                        <div className="price-calculation-formula" style={{ border: '1px solid #f0f0f0', padding: '8px', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span>Hotel Base Price:</span>
                                                <span>${selectedHotel.basePrice?.toFixed(2) || '0.00'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span>Room Price Modifier:</span>
                                                <span>{form.getFieldValue('priceModifier') || 1}x</span>
                                            </div>
                                            {(() => {
                                                const roomTypeId = form.getFieldValue('roomType');
                                                const selectedRoomType = roomTypes.find(rt => rt.id === roomTypeId);
                                                return (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                        <span>Room Type Factor:</span>
                                                        <span>{selectedRoomType?.priceFactor || 1}x</span>
                                                    </div>
                                                );
                                            })()}
                                            <div style={{ borderTop: '1px dashed #d9d9d9', paddingTop: '4px', marginTop: '4px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Final Price:</span>
                                                <span>${form.getFieldValue('price')?.toFixed(2) || '0.00'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="priceModifier"
                                    label={
                                        <span>
                                            {t('admin.hotels.rooms.fields.priceModifier', 'Price Modifier')}
                                            <Tooltip title={t('admin.hotels.rooms.fields.priceModifierTooltip', 'Adjust room price relative to hotel base price. E.g., 1.2 means 20% more than base price.')}>
                                                <InfoCircleOutlined style={{ marginLeft: 8 }} />
                                            </Tooltip>
                                        </span>
                                    }
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={0.1}
                                        step={0.1}
                                        precision={2}
                                        placeholder="e.g., 1.2 for 20% increase"
                                        onChange={handlePriceModifierChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="status"
                                    label={t('admin.hotels.rooms.fields.status', 'Status')}
                                    rules={[{ required: true, message: t('admin.hotels.rooms.validation.statusRequired', 'Please select status!') }]}
                                >
                                    <Select>
                                        <Option key="status-available" value={RoomDtoStatusEnum.Available}>{t('admin.hotels.rooms.status.available', 'Available')}</Option>
                                        <Option key="status-reserved" value={RoomDtoStatusEnum.Reserved}>{t('admin.hotels.rooms.status.reserved', 'Reserved')}</Option>
                                        <Option key="status-occupied" value={RoomDtoStatusEnum.Occupied}>{t('admin.hotels.rooms.status.occupied', 'Occupied')}</Option>
                                        <Option key="status-maintenance" value={RoomDtoStatusEnum.Maintenance}>{t('admin.hotels.rooms.status.maintenance', 'Under Maintenance')}</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="hotel"
                                    label={t('admin.hotels.rooms.fields.hotel', 'Hotel')}
                                    rules={[{ required: true, message: t('admin.hotels.rooms.validation.hotelRequired', 'Please select a hotel!') }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder={t('admin.hotels.rooms.selectHotel', 'Select a hotel')}
                                        loading={hotelLoading}
                                        filterOption={false}
                                        onSearch={handleHotelSearch}
                                        onPopupScroll={handlePopupScroll}
                                        onChange={handleHotelChange}
                                        notFoundContent={hotelLoading ? <Spin size="small" /> : t('admin.hotels.rooms.noHotelsFound', 'No hotels found')}
                                    >
                                        {hotels.map((hotel, index) => (
                                            <Option key={`hotel-${hotel.id}-${index}`} value={hotel.id}>
                                                {hotel.name} ({hotel.addressInformation?.city}, {hotel.addressInformation?.country})
                                                {hotel.basePrice ?
                                                    <span style={{ color: '#1890ff', marginLeft: 8 }}>
                                                        ${hotel.basePrice.toFixed(2)}
                                                    </span>
                                                    : null}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="description"
                                    label={t('admin.hotels.rooms.fields.description', 'Description')}
                                >
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label={t('admin.hotels.fields.primaryImage', 'Primary Image')}
                            name="primaryImage"
                            extra={t('admin.hotels.edit.primaryImageHint', 'Upload the main room image that will be displayed as primary (max 5MB).')}
                        >
                            <Upload {...primaryImageUploadProps}>
                                {!primaryImage ? (
                                    <div style={{
                                        width: 104,
                                        height: 104,
                                        border: '2px dashed #1890ff',
                                        borderRadius: 6,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.3s',
                                        backgroundColor: '#f6ffed'
                                    }}>
                                        <UploadOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                                        <div style={{ marginTop: 8, color: '#1890ff', fontSize: 12, fontWeight: 500 }}>
                                            {t('admin.hotels.edit.selectPrimaryImage', 'Primary Image')}
                                        </div>
                                    </div>
                                ) : null}
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            label={t('admin.hotels.fields.additionalImages', 'Additional Images')}
                            name="additionalImages"
                            extra={t('admin.hotels.edit.additionalImagesHint', 'Upload additional room images for gallery (max 5MB each, max 9 images). Currently: {{count}} additional image(s).', { count: fileList.length })}
                        >
                            <Upload {...uploadProps}>
                                {fileList.length >= 9 ? null : (
                                    <div style={{
                                        width: 104,
                                        height: 104,
                                        border: '1px dashed #d9d9d9',
                                        borderRadius: 6,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.3s',
                                        backgroundColor: '#fafafa'
                                    }}>
                                        <UploadOutlined style={{ fontSize: 24, color: '#999' }} />
                                        <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                                            {t('admin.hotels.edit.selectAdditionalImages', 'Add More')}
                                        </div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button id="submitButton" type="primary" htmlType="submit" loading={loading}>
                                    {t('admin.hotels.rooms.add.addRoom', 'Add Room')}
                                </Button>
                                <Button onClick={() => {
                                    const basePath = getBasePath();
                                    navigate(`${basePath}/${hotelId}/rooms`);
                                }}>
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