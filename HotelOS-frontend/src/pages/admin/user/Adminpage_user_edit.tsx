import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../../interfaces/User";
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
    Space
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

export default function Admin_User_Edit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [user, setUser] = useState<User | null>(null);
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
        const fetchUser = async () => {
            if (!id) return;
            showLoader();
            try {
                const response = await fetch(`http://localhost:8080/api/users/${id}`, {
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
                    throw new Error("Failed to fetch user.");
                }
                const userData: User = await response.json();
                setUser(userData);
                form.setFieldsValue({
                    ...userData,
                    hotel: userData.hotel?.id
                });
            } catch (error) {
                console.error("Error fetching user:", error);
                message.error("Failed to load user data");
            }
            hideLoader();
        };

        fetchUser();
        fetchHotels(0, ""); // Initial fetch of first page
    }, [id, form]);

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
        if (!id) return;
        showLoader();

        const userDto: User = {
            userId: id,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
            userType: values.userType,
            hotel: {
                id: values.hotel || null
            },
            position: values.position,
            country: values.country,
            state: values.state,
            city: values.city,
            address: values.address,
            zipCode: values.zipCode,
            password: values.password
        };

        try {
            // Update user data
            const response = await fetch(`http://localhost:8080/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${document.cookie.replace(
                        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                        "$1"
                    )}`
                },
                body: JSON.stringify(userDto)
            });

            if (!response.ok) {
                throw new Error("Failed to update user.");
            }

            // Handle image upload if a file was selected
            if (fileList.length > 0) {
                const imageFormData = new FormData();
                imageFormData.append("file", fileList[0] as any);

                const imageResponse = await fetch(
                    `http://localhost:8080/api/users/${id}/image_upload`,
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

            message.success("User updated successfully");
            navigate("/admin/users");
        } catch (error) {
            console.error("Error updating user:", error);
            message.error("Failed to update user");
        }
        hideLoader();
    };

    const formInitialValues = user ? {
        ...user,
        hotel: user.hotel?.id
    } : {};

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div style={{ marginTop: '5rem', padding: '20px' }}>
                <Card
                    title="Edit User"
                    variant="outlined"
                    style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={formInitialValues}
                    >
                        {user ? (
                            <>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="firstName"
                                            label="First Name"
                                            rules={[{ required: true, message: 'Please input first name!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="lastName"
                                            label="Last Name"
                                            rules={[{ required: true, message: 'Please input last name!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="userType"
                                            label="User Type"
                                            rules={[{ required: true, message: 'Please select user type!' }]}
                                        >
                                            <Select>
                                                <Option value="GUEST">User</Option>
                                                <Option value="STAFF">Staff</Option>
                                                <Option value="MANAGER">Manager</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="hotel"
                                            label="Hotel"
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Select a hotel"
                                                loading={hotelLoading}
                                                filterOption={false}
                                                onSearch={handleHotelSearch}
                                                onPopupScroll={handlePopupScroll}
                                                notFoundContent={hotelLoading ? <Spin size="small" /> : "No hotels found"}
                                                allowClear
                                            >
                                                {hotels.map((hotel) => (
                                                    <Option key={hotel.id} value={hotel.id}>
                                                        {hotel.id}: {hotel.name}, {hotel.city}, {hotel.state}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="email"
                                            label="Email"
                                            rules={[
                                                { required: true, message: 'Please input email!' },
                                                { type: 'email', message: 'Please enter a valid email!' }
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="phone"
                                            label="Phone"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="position"
                                            label="Position"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="country"
                                            label="Country"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="state"
                                            label="State"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="city"
                                            label="City"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="address"
                                            label="Address"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="zipCode"
                                            label="Zip Code"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label="User Image"
                                    name="userImage"
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
                                            onClick={() => navigate("/admin/users")}
                                        >
                                            Cancel
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Spin size="large" />
                                <p style={{ marginTop: '10px' }}>Loading user data...</p>
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </div>
    );
}