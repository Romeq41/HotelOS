import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useApi } from "../../../api/useApi";
import { PageHotelDto, UserDto } from "../../../api/generated/api";
import { useUser } from "../../../contexts/UserContext";

export default function Admin_User_Edit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [user, setUser] = useState<UserDto | null>(null);
    const [hotels, setHotels] = useState<any[]>([]);
    const [hotelPage, setHotelPage] = useState(0);
    const [totalHotelPages, setTotalHotelPages] = useState(0);
    const [hotelSearchQuery, setHotelSearchQuery] = useState("");
    const [hotelLoading, setHotelLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const { user: userApi, hotel: hotelApi } = useApi();
    const { user: currentUser } = useUser();
    const PAGE_SIZE = 10;
    const { Option } = Select;
    const isAdmin = (currentUser?.userType || '').toString().toUpperCase() === 'ADMIN';

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            showLoader();
            try {
                const response = await userApi.getUserById(Number(id));
                const userData = response.data as UserDto;
                setUser(userData);
                form.setFieldsValue({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    userType: (userData as any)?.userType,
                    position: (userData as any)?.position,
                    hotel: (userData as any)?.hotel?.id,
                    authEmail: (userData as any)?.email,
                    contactEmail: (userData as any)?.contactInformation?.email,
                    phone: (userData as any)?.contactInformation?.phoneNumber,
                    country: (userData as any)?.addressInformation?.country,
                    state: (userData as any)?.addressInformation?.state,
                    city: (userData as any)?.addressInformation?.city,
                    address: (userData as any)?.addressInformation?.address,
                    zipCode: (userData as any)?.addressInformation?.zipCode,
                });
            } catch (error: any) {
                console.error("Error fetching user:", error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    message.error(t('common.unauthorized', 'Unauthorized access'));
                    navigate('/login');
                    return;
                }
                message.error(t('admin.users.messages.loadFailed', 'Failed to load user data'));
            } finally {
                hideLoader();
            }
        };

        fetchUser();
        fetchHotels(0, "");
    }, [id, form, t, navigate, userApi]);

    const fetchHotels = async (page: number, nameQuery: string) => {
        setHotelLoading(true);
        try {
            const response = await hotelApi.getAllHotels(page, PAGE_SIZE, nameQuery || undefined);
            const data = response.data as PageHotelDto;
            const content = (data as any)?.content || [];
            if (page === 0) {
                setHotels(content);
            } else {
                setHotels(prev => [...prev, ...content]);
            }
            setHotelPage((data as any)?.number || 0);
            setTotalHotelPages((data as any)?.totalPages || 0);
        } catch (error: any) {
            console.error("Error fetching hotels:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                message.error(t('common.unauthorized', 'Unauthorized access'));
                navigate('/login');
                return;
            }
            message.error(t('admin.users.messages.hotelsLoadFailed', 'Failed to load hotels'));
        } finally {
            setHotelLoading(false);
        }
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
        const body: any = {
            firstName: values.firstName,
            lastName: values.lastName,
            userType: values.userType,
            position: values.position,
            hotel: values.hotel ? { id: values.hotel } : undefined,
            email: values.authEmail ?? user?.email,
            addressInformation: {
                address: values.address,
                city: values.city,
                state: values.state,
                zipCode: values.zipCode,
                country: values.country,
            },
            contactInformation: {
                email: values.contactEmail ?? user?.contactInformation?.email,
                phoneNumber: values.phone ?? user?.contactInformation?.phoneNumber,
            },
        } as UserDto;

        try {
            await userApi.updateUserById(Number(id), body);

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
        } catch (error: any) {
            console.error("Error updating user:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                message.error(t('common.unauthorized', 'Unauthorized access'));
                navigate('/login');
                return;
            }
            message.error(t('admin.users.messages.updateFailed', 'Failed to update user'));
        } finally {
            hideLoader();
        }
    };

    const formInitialValues = user ? {
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        position: user.position,
        hotel: user.hotel?.id,
        authEmail: (user as any)?.email,
        contactEmail: user.contactInformation?.email,
        phone: user.contactInformation?.phoneNumber,
        country: user.addressInformation?.country,
        state: user.addressInformation?.state,
        city: user.addressInformation?.city,
        address: user.addressInformation?.address,
        zipCode: user.addressInformation?.zipCode,
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
                                                        {hotel.id}: {hotel.name}, {hotel.addressInformation?.city || hotel.city}, {hotel.addressInformation?.state || hotel.state}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="authEmail"
                                            label={t('admin.users.form.fields.authEmail', 'Account Email (login)')}
                                            tooltip={t('admin.users.form.tooltips.authEmail', 'Used for sign-in and authorization')}
                                            rules={[
                                                { required: true, message: t('admin.users.form.errors.emailRequired', 'Please input email!') },
                                                { type: 'email', message: t('admin.users.form.errors.emailInvalid', 'Please enter a valid email!') }
                                            ]}
                                        >
                                            <Input disabled={!isAdmin} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="position"
                                            label={t('admin.users.form.fields.position', 'Position')}
                                            rules={[{
                                                required: true,
                                                message: t('admin.users.form.errors.positionRequired', 'Please input position!')
                                            }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Contact Information Section */}
                                <div className="mt-4 mb-2 font-semibold">
                                    {t('admin.users.form.sections.contact', 'Contact Information')}
                                </div>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="contactEmail"
                                            label={t('admin.users.form.fields.contactEmail', 'Contact Email (communication)')}
                                            rules={[
                                                { required: true, message: t('admin.users.form.errors.emailRequired', 'Please input email!') },
                                                { type: 'email', message: t('admin.users.form.errors.emailInvalid', 'Please enter a valid email!') }
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="phone"
                                            label={t('admin.users.form.fields.phone', 'Phone')}
                                            rules={[{
                                                required: true,
                                                message: t('admin.users.form.errors.phoneRequired', 'Please input first name!')
                                            }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Address Information Section */}
                                <div className="mt-6 mb-2 font-semibold">
                                    {t('admin.users.form.sections.address', 'Address Information')}
                                </div>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="country"
                                            label={t('admin.users.form.fields.country', 'Country')}
                                            rules={[{
                                                required: true,
                                                message: t('admin.users.form.errors.countryRequired', 'Please input country!')
                                            }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="state"
                                            label={t('admin.users.form.fields.state', 'State')}
                                            rules={[{
                                                required: true,
                                                message: t('admin.users.form.errors.stateRequired', 'Please input state!')
                                            }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="city"
                                            label={t('admin.users.form.fields.city', 'City')}
                                            rules={[{
                                                required: true,
                                                message: t('admin.users.form.errors.cityRequired', 'Please input city!')
                                            }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="address"
                                            label={t('admin.users.form.fields.address', 'Address')}
                                            rules={[{
                                                required: true,
                                                message: t('admin.users.form.errors.addressRequired', 'Please input address!')
                                            }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="zipCode"
                                            label={t('admin.users.form.fields.zipCode', 'Zip Code')}
                                            rules={[{
                                                required: true,
                                                message: t('admin.users.form.errors.zipcodeRequired', 'Please input zip code!')
                                            }]}
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