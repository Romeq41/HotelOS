import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Room, RoomStatus } from "../../../interfaces/Room";
import { Hotel } from "../../../interfaces/Hotel";
import { useLoading } from "../../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../contexts/UserContext";
import { UserType } from "../../../interfaces/User";
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
    InputNumber
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

export default function Admin_Hotel_Room_Details_Edit() {
    const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user: currentUser } = useUser();
    const [form] = Form.useForm();
    const [room, setRoom] = useState<Room | null>(null);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [hotelPage, setHotelPage] = useState(0);
    const [totalHotelPages, setTotalHotelPages] = useState(0);
    const [hotelSearchQuery, setHotelSearchQuery] = useState("");
    const [hotelLoading, setHotelLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const PAGE_SIZE = 10;
    const { Option } = Select;

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
        const fetchRoom = async () => {
            if (!roomId) return;
            showLoader();
            try {
                const response = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${document.cookie.replace(
                            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                            "$1"
                        )}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch room.");
                }

                const roomData: Room = await response.json();
                setRoom(roomData);

                form.setFieldsValue({
                    ...roomData,
                    hotel: roomData.hotel?.id || roomData.hotel?.id
                });

                if (roomData.hotel?.id && !hotelId) {
                    const basePath = getBasePath();
                    navigate(`${basePath}/${roomData.hotel.id}/rooms/${roomId}/edit`, { replace: true });
                }
            } catch (error) {
                console.error("Error fetching room:", error);
                message.error(t('admin.hotels.rooms.edit.fetchError', 'Failed to load room data'));
            }
            hideLoader();
        };

        fetchRoom();
        fetchHotels(0, "");
    }, [roomId, form, hotelId, navigate, t]);

    const fetchHotels = async (page: number, nameQuery: string) => {
        setHotelLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: PAGE_SIZE.toString(),
                ...(nameQuery ? { name: nameQuery } : {})
            });

            const response = await fetch(`http://localhost:8080/api/hotels?${params}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${document.cookie.replace(
                        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                        "$1"
                    )}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch hotels.");
            }

            const data = await response.json();

            if (page === 0) {
                setHotels(data.content);
            } else {
                setHotels(prev => [...prev, ...data.content]);
            }

            setHotelPage(data.number);
            setTotalHotelPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching hotels:", error);
            message.error(t('admin.hotels.rooms.edit.hotelFetchError', 'Failed to load hotels'));
        }
        setHotelLoading(false);
    };

    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight && hotelPage < totalHotelPages - 1) {
            fetchHotels(hotelPage + 1, hotelSearchQuery);
        }
    };

    const handleHotelSearch = (value: string) => {
        setHotelSearchQuery(value);
        fetchHotels(0, value);
    };

    const uploadProps: UploadProps = {
        onRemove: () => {
            setFileList([]);
        },
        beforeUpload: (file) => {
            setFileList([file]);
            return false;
        },
        fileList,
        maxCount: 1,
    };

    const onFinish = async (values: any) => {
        if (!roomId) return;
        showLoader();

        try {
            const roomDto = {
                roomId: roomId,
                roomNumber: Number(values.roomNumber),
                type: values.type,
                description: values.description,
                capacity: Number(values.capacity),
                price: Number(values.price),
                status: values.status,
                hotel: values.hotel ? { id: values.hotel } : null
            };

            const response = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${document.cookie.replace(
                        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                        "$1"
                    )}`
                },
                body: JSON.stringify(roomDto)
            });

            if (!response.ok) {
                throw new Error("Failed to update room.");
            }

            if (fileList.length > 0) {
                const imageFormData = new FormData();
                imageFormData.append("file", fileList[0] as any);

                const imageResponse = await fetch(
                    `http://localhost:8080/api/rooms/${roomId}/image_upload`,
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${document.cookie.replace(
                                /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                                "$1"
                            )}`
                        },
                        body: imageFormData
                    }
                );

                if (!imageResponse.ok) {
                    const errorText = await imageResponse.text();
                    console.error("Image upload error:", errorText);
                    message.error(t('admin.hotels.rooms.edit.imageUploadError', 'Failed to upload image'));
                    throw new Error("Image upload failed.");
                }

                message.success(t('admin.hotels.rooms.edit.imageUploadSuccess', 'Image uploaded successfully'));
            }

            message.success(t('admin.hotels.rooms.edit.updateSuccess', 'Room updated successfully'));

            // Use path-aware navigation
            const basePath = getBasePath();
            navigate(`${basePath}/${values.hotel}/rooms`);
        } catch (error) {
            console.error("Error updating room:", error);
            message.error(t('admin.hotels.rooms.edit.updateError', 'Failed to update room'));
        }
        hideLoader();
    };

    const formInitialValues = room ? {
        ...room,
        hotel: room.hotel?.id || room.hotel?.id
    } : {};

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div style={{ marginTop: '5rem', padding: '20px' }}>
                <Card
                    title={t('admin.hotels.rooms.edit.title', 'Edit Room')}
                    variant="outlined"
                    style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={formInitialValues}
                    >
                        {room ? (
                            <>
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
                                            name="type"
                                            label={t('admin.hotels.rooms.fields.type', 'Room Type')}
                                            rules={[{ required: true, message: t('admin.hotels.rooms.validation.typeRequired', 'Please input room type!') }]}
                                        >
                                            <Input />
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
                                            label={t('admin.hotels.rooms.fields.price', 'Price')}
                                            rules={[{ required: true, message: t('admin.hotels.rooms.validation.priceRequired', 'Please input price!') }]}
                                        >
                                            <InputNumber
                                                prefix="$"
                                                style={{ width: '100%' }}
                                                min={1}
                                                step={1}
                                                precision={0}
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
                                                <Option value={RoomStatus.AVAILABLE}>{t('admin.hotels.rooms.status.available', 'Available')}</Option>
                                                <Option value={RoomStatus.RESERVED}>{t('admin.hotels.rooms.status.reserved', 'Reserved')}</Option>
                                                <Option value={RoomStatus.OCCUPIED}>{t('admin.hotels.rooms.status.occupied', 'Occupied')}</Option>
                                                <Option value={RoomStatus.MAINTENANCE}>{t('admin.hotels.rooms.status.maintenance', 'Under Maintenance')}</Option>
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
                                                notFoundContent={hotelLoading ? <Spin size="small" /> : t('admin.hotels.rooms.noHotelsFound', 'No hotels found')}
                                            >
                                                {hotels.map((hotel) => (
                                                    <Option key={hotel.id} value={hotel.id}>
                                                        {hotel.id}: {hotel.name}, {hotel.city}, {hotel.state}
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
                                    label={t('admin.hotels.rooms.fields.image', 'Room Image')}
                                    name="roomImage"
                                >
                                    <Upload {...uploadProps} listType="picture">
                                        <Button icon={<UploadOutlined />}>{t('admin.hotels.rooms.selectImage', 'Select Image')}</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item>
                                    <Space>
                                        <Button type="primary" htmlType="submit">
                                            {t('general.save', 'Save Changes')}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                const basePath = getBasePath();
                                                navigate(`${basePath}/${hotelId || room.hotel?.id}/rooms`);
                                            }}
                                        >
                                            {t('general.cancel', 'Cancel')}
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Spin size="large" />
                                <p style={{ marginTop: '10px' }}>{t('admin.hotels.rooms.loading', 'Loading room data...')}</p>
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </div>
    );
}