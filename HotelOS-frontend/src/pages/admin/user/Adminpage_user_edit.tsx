import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../../interfaces/User";
import { Hotel } from "../../../interfaces/Hotel";
import { useLoading } from "../../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
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
                message.error(t('admin.users.messages.loadFailed', 'Failed to load user data'));
            }
            hideLoader();
        };

        fetchUser();
        fetchHotels(0, "");
    }, [id, form, t]);

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

            if (page === 0) {
                setHotels(data.content);
            } else {
                setHotels(prev => [...prev, ...data.content]);
            }

            setHotelPage(data.number);
            setTotalHotelPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching hotels:", error);
            message.error(t('admin.users.messages.hotelsLoadFailed', 'Failed to load hotels'));
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
                    message.error(t('admin.users.messages.imageUploadFailed', 'Failed to upload image'));
                    throw new Error("Image upload failed.");
                }

                message.success(t('admin.users.messages.imageUploaded', 'Image uploaded successfully'));
            }

            message.success(t('admin.users.messages.updateSuccess', 'User updated successfully'));
            navigate("/admin/users");
        } catch (error) {
            console.error("Error updating user:", error);
            message.error(t('admin.users.messages.updateFailed', 'Failed to update user'));
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
                    title={t('admin.users.edit.title', 'Edit User')}
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
                                            label={t('admin.users.form.fields.firstName', 'First Name')}
                                            rules={[{
                                                required: true,
                                                message: t('admin.users.form.errors.firstNameRequired', 'Please input first name!')
                                            }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="lastName"
                                            label={t('admin.users.form.fields.lastName', 'Last Name')}
                                            rules={[{
                                                required: true,
                                                message: t('admin.users.form.errors.lastNameRequired', 'Please input last name!')
                                            }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="userType"
                                            label={t('admin.users.form.fields.userType', 'User Type')}
                                            rules={[{
                                                required: true,
                                                message: t('admin.users.form.errors.userTypeRequired', 'Please select user type!')
                                            }]}
                                        >
                                            <Select>
                                                <Option value="GUEST">{t('admin.users.userTypes.guest', 'User')}</Option>
                                                <Option value="STAFF">{t('admin.users.userTypes.staff', 'Staff')}</Option>
                                                <Option value="MANAGER">{t('admin.users.userTypes.manager', 'Manager')}</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="hotel"
                                            label={t('admin.users.form.fields.hotel', 'Hotel')}
                                        >
                                            <Select
                                                showSearch
                                                placeholder={t('admin.users.form.selectHotel', 'Select a hotel')}
                                                loading={hotelLoading}
                                                filterOption={false}
                                                onSearch={handleHotelSearch}
                                                onPopupScroll={handlePopupScroll}
                                                notFoundContent={hotelLoading ?
                                                    <Spin size="small" /> :
                                                    t('admin.users.messages.noHotels', 'No hotels found')}
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
                                            label={t('admin.users.form.fields.email', 'Email')}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t('admin.users.form.errors.emailRequired', 'Please input email!')
                                                },
                                                {
                                                    type: 'email',
                                                    message: t('admin.users.form.errors.emailInvalid', 'Please enter a valid email!')
                                                }
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="phone"
                                            label={t('admin.users.form.fields.phone', 'Phone')}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="position"
                                            label={t('admin.users.form.fields.position', 'Position')}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="country"
                                            label={t('admin.users.form.fields.country', 'Country')}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="state"
                                            label={t('admin.users.form.fields.state', 'State')}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="city"
                                            label={t('admin.users.form.fields.city', 'City')}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="address"
                                            label={t('admin.users.form.fields.address', 'Address')}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="zipCode"
                                            label={t('admin.users.form.fields.zipCode', 'Zip Code')}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label={t('admin.users.form.fields.userImage', 'User Image')}
                                    name="userImage"
                                >
                                    <Upload {...uploadProps} listType="picture">
                                        <Button icon={<UploadOutlined />}>
                                            {t('admin.users.actions.selectImage', 'Select Image')}
                                        </Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item>
                                    <Space>
                                        <Button type="primary" htmlType="submit">
                                            {t('admin.users.actions.saveChanges', 'Save Changes')}
                                        </Button>
                                        <Button
                                            onClick={() => navigate("/admin/users")}
                                        >
                                            {t('common.cancel', 'Cancel')}
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Spin size="large" />
                                <p style={{ marginTop: '10px' }}>
                                    {t('admin.users.loading', 'Loading user data...')}
                                </p>
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </div>
    );
}