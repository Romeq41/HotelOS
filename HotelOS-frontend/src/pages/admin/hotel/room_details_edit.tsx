import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Room, RoomStatus } from "../../../interfaces/Room";
import { Hotel } from "../../../interfaces/Hotel";
import { useLoading } from "../../../contexts/LoaderContext";
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
    const [form] = Form.useForm();
    const [room, setRoom] = useState<Room | null>(null);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [hotelPage, setHotelPage] = useState(0);
    const [totalHotelPages, setTotalHotelPages] = useState(0);
    const [hotelSearchQuery, setHotelSearchQuery] = useState("");
    const [hotelLoading, setHotelLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { showLoader, hideLoader } = useLoading();
    const PAGE_SIZE = 10;
    const { Option } = Select;

    useEffect(() => {
        const fetchRoom = async () => {
            if (!roomId) return;
            showLoader();
            try {
                const response = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${document.cookie.replace(
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
                    navigate(`/admin/hotels/${roomData.hotel.id}/rooms/${roomId}/edit`, { replace: true });
                }
            } catch (error) {
                console.error("Error fetching room:", error);
                message.error("Failed to load room data");
            }
            hideLoader();
        };

        fetchRoom();
        fetchHotels(0, "");
    }, [roomId, form, hotelId, navigate]);

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
                    Authorization: `Bearer ${document.cookie.replace(
                        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                        "$1"
                    )}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch hotels.");
            }

            const data = await response.json();

            // If this is page 0, replace the hotels list
            // If it's a subsequent page, append to the list
            if (page === 0) {
                setHotels(data.content);
            } else {
                setHotels(prev => [...prev, ...data.content]);
            }

            setHotelPage(data.number);
            setTotalHotelPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching hotels:", error);
            message.error("Failed to load hotels");
        }
        setHotelLoading(false);
    };

    // Load more hotels when scrolling
    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight && hotelPage < totalHotelPages - 1) {
            fetchHotels(hotelPage + 1, hotelSearchQuery);
        }
    };

    // Handle hotel search
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
            // Structure the data correctly for the backend
            // Include roomId explicitly to help the backend identify the room
            const roomDto = {
                roomId: roomId, // Include this to help the backend
                roomNumber: Number(values.roomNumber),
                type: values.type,
                description: values.description,
                capacity: Number(values.capacity),
                rate: Number(values.rate),
                status: values.status,
                hotel: values.hotel ? { id: values.hotel } : null
            };

            console.log("Room data to update:", roomDto);

            // Update room data
            const response = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${document.cookie.replace(
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
                            Authorization: `Bearer ${document.cookie.replace(
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
                    message.error("Failed to upload image");
                    throw new Error("Image upload failed.");
                }

                message.success("Image uploaded successfully");
            }

            message.success("Room updated successfully");
            navigate(`/admin/hotels/${values.hotel}/rooms`);
        } catch (error) {
            console.error("Error updating room:", error);
            message.error("Failed to update room");
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
                    title={`Edit Room ${roomId}`}
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
                                            label="Room Number"
                                            rules={[{ required: true, message: 'Please input room number!' }]}
                                        >
                                            <InputNumber style={{ width: '100%' }} min={1} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="type"
                                            label="Room Type"
                                            rules={[{ required: true, message: 'Please input room type!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="capacity"
                                            label="Capacity"
                                            rules={[{ required: true, message: 'Please input capacity!' }]}
                                        >
                                            <InputNumber style={{ width: '100%' }} min={1} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="rate"
                                            label="Rate"
                                            rules={[{ required: true, message: 'Please input rate!' }]}
                                        >
                                            <InputNumber
                                                style={{ width: '100%' }}
                                                min={0}
                                                step={0.01}
                                                precision={2}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="status"
                                            label="Status"
                                            rules={[{ required: true, message: 'Please select status!' }]}
                                        >
                                            <Select>
                                                <Option value={RoomStatus.AVAILABLE}>Available</Option>
                                                <Option value={RoomStatus.RESERVED}>Reserved</Option>
                                                <Option value={RoomStatus.OCCUPIED}>Occupied</Option>
                                                <Option value={RoomStatus.MAINTENANCE}>Under Maintenance</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="hotel"
                                            label="Hotel"
                                            rules={[{ required: true, message: 'Please select a hotel!' }]}
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Select a hotel"
                                                loading={hotelLoading}
                                                filterOption={false}
                                                onSearch={handleHotelSearch}
                                                onPopupScroll={handlePopupScroll}
                                                notFoundContent={hotelLoading ? <Spin size="small" /> : "No hotels found"}
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
                                            label="Description"
                                        >
                                            <Input.TextArea rows={3} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label="Room Image"
                                    name="roomImage"
                                >
                                    <Upload {...uploadProps} listType="picture">
                                        <Button icon={<UploadOutlined />}>Select Image</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item>
                                    <Space>
                                        <Button type="primary" htmlType="submit">
                                            Save Changes
                                        </Button>
                                        <Button
                                            onClick={() => navigate(`/admin/hotels/${hotelId || room.hotel?.id || room.hotel?.id}/rooms`)}
                                        >
                                            Cancel
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Spin size="large" />
                                <p style={{ marginTop: '10px' }}>Loading room data...</p>
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </div>
    );
}