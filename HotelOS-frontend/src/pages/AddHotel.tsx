import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { useApi } from '../api/useApi';
import { HotelDto, AmenityDto, AmenityDtoTypeEnum } from '../api/generated/api';
import {
    Form,
    Input,
    Button,
    Upload,
    Row,
    Col,
    Card,
    message,
    Space,
    Select,
    InputNumber
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

type HotelFormValues = {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
};

export default function AddHotel() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const { hotel: hotelApi, amenity: amenityApi } = useApi();

    const uploadProps: UploadProps = {
        onRemove: () => {
            setFileList([]);
        },
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error(t("admin.hotels.add.imageTypeError", "You can only upload image files!"));
                return Upload.LIST_IGNORE;
            }

            const isLessThan5MB = file.size / 1024 / 1024 < 5;
            if (!isLessThan5MB) {
                message.error(t("admin.hotels.add.imageSizeError", "Image must be smaller than 5MB!"));
                return Upload.LIST_IGNORE;
            }

            setFileList([file]);
            return false;
        },
        fileList,
        maxCount: 1,
        listType: "picture",
    };

    const onFinish = async (values: HotelFormValues & { amenities?: AmenityDto[] }) => {
        setLoading(true);
        showLoader();

        try {
            const hotelPayload: HotelDto = {
                name: values.name,
                description: '',
                basePrice: 0,
                addressInformation: {
                    address: values.address,
                    city: values.city,
                    state: values.state,
                    zipCode: values.zipCode,
                    country: values.country,
                },
                contactInformation: {
                    phoneNumber: '',
                    email: '',
                },
            };

            const { data } = await hotelApi.addHotel(hotelPayload as any);
            const createdHotel = data as HotelDto;

            // Persist amenities if provided
            if (values.amenities && values.amenities.length > 0) {
                for (const amenity of values.amenities) {
                    const amenityPayload: AmenityDto = {
                        ...amenity,
                        hotel: { id: createdHotel.id } as HotelDto,
                    };
                    await amenityApi.addAmenity(amenityPayload as any);
                }
            }

            if (fileList.length > 0) {
                const imageFormData = new FormData();
                imageFormData.append('file', fileList[0] as any);

                try {
                    await hotelApi.uploadHotelImage(Number((data as any).id), fileList[0] as any);
                    message.success(t("admin.hotels.add.imageUploadSuccess", "Image uploaded successfully"));
                } catch (e) {
                    message.warning(t("admin.hotels.add.imageUploadPartialError", "Hotel added but failed to upload image"));
                }
            }

            message.success(t("admin.hotels.add.success", "Hotel added successfully"));
            form.resetFields();
            setFileList([]);

            // Navigate to hotels list after successful creation
            setTimeout(() => {
                navigate("/admin/hotels");
            }, 1500);

        } catch (error) {
            console.error('Error adding hotel:', error);
            message.error(t("admin.hotels.add.error", "Failed to add hotel"));
        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    const validateZipCode = (_: any, value: string) => {
        const country = form.getFieldValue('country');
        if (!value) {
            return Promise.reject(t("admin.hotels.validation.zipCodeRequired", "Please input zip code!"));
        }

        let pattern: RegExp;
        let errorMessage: string;

        switch (country?.toLowerCase()) {
            case 'united states':
            case 'usa':
            case 'us':
                pattern = /^\d{5}(-\d{4})?$/;
                errorMessage = t("admin.hotels.validation.zipCodeUSInvalid", "US ZIP code must be in format: 12345 or 12345-6789");
                break;
            case 'canada':
            case 'ca':
                pattern = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
                errorMessage = t("admin.hotels.validation.zipCodeCAInvalid", "Canadian postal code must be in format: A1A 1A1");
                break;
            case 'poland':
            case 'polska':
            case 'pl':
                pattern = /^\d{2}-\d{3}$/;
                errorMessage = t("admin.hotels.validation.zipCodePLInvalid", "Polish postal code must be in format: 12-345");
                break;
            case 'united kingdom':
            case 'uk':
            case 'gb':
                pattern = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
                errorMessage = t("admin.hotels.validation.zipCodeUKInvalid", "UK postal code is invalid");
                break;
            default:
                // Generic validation for other countries - at least 3 chars
                pattern = /^.{3,10}$/;
                errorMessage = t("admin.hotels.validation.zipCodeInvalid", "Please enter a valid postal/ZIP code");
        }

        if (!pattern.test(value)) {
            return Promise.reject(errorMessage);
        }

        return Promise.resolve();
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div style={{ marginTop: '5rem', padding: '20px' }}>
                <Card
                    title={t("admin.hotels.add.title", "Add New Hotel")}
                    variant="outlined"
                    style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label={t("admin.hotels.fields.name", "Hotel Name")}
                                    rules={[{
                                        required: true,
                                        message: t("admin.hotels.validation.nameRequired", "Please input hotel name!")
                                    }, {
                                        min: 3,
                                        message: t("admin.hotels.validation.nameLength", "Name must be at least 3 characters long")
                                    }]}
                                >
                                    <Input maxLength={100} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="address"
                                    label={t("admin.hotels.fields.address", "Address")}
                                    rules={[{
                                        required: true,
                                        message: t("admin.hotels.validation.addressRequired", "Please input address!")
                                    }]}
                                >
                                    <Input maxLength={200} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="city"
                                    label={t("admin.hotels.fields.city", "City")}
                                    rules={[{
                                        required: true,
                                        message: t("admin.hotels.validation.cityRequired", "Please input city!")
                                    }]}
                                >
                                    <Input maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="state"
                                    label={t("admin.hotels.fields.state", "State/Province")}
                                    rules={[{
                                        required: true,
                                        message: t("admin.hotels.validation.stateRequired", "Please input state/province!")
                                    }]}
                                >
                                    <Input maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="country"
                                    label={t("admin.hotels.fields.country", "Country")}
                                    rules={[{
                                        required: true,
                                        message: t("admin.hotels.validation.countryRequired", "Please input country!")
                                    }]}
                                >
                                    <Input maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="zipCode"
                                    label={t("admin.hotels.fields.zipCode", "Postal/ZIP Code")}
                                    dependencies={['country']}
                                    rules={[
                                        { validator: validateZipCode }
                                    ]}
                                >
                                    <Input maxLength={15} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.List name="amenities">
                            {(fields, { add, remove }) => (
                                <Card
                                    title={t('admin.hotels.fields.amenities', 'Amenities')}
                                    size="small"
                                    className="mb-4"
                                    extra={<Button onClick={() => add()}>{t('admin.hotels.amenities.add', 'Add amenity')}</Button>}
                                >
                                    {fields.length === 0 && (
                                        <div className="text-sm text-gray-500 mb-3">
                                            {t('admin.hotels.amenities.none', 'No amenities added yet.')}
                                        </div>
                                    )}
                                    {fields.map((field) => (
                                        <Card key={field.key} className="mb-3" size="small">
                                            <Row gutter={12}>
                                                <Col span={6}>
                                                    <Form.Item
                                                        name={[field.name, 'id']}
                                                        hidden
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'name']}
                                                        fieldKey={[field.fieldKey!, 'name']}
                                                        label={t('admin.hotels.amenities.name', 'Name')}
                                                        rules={[{ required: true, message: t('admin.hotels.amenities.nameRequired', 'Amenity name is required') }]}
                                                    >
                                                        <Input maxLength={100} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'type']}
                                                        fieldKey={[field.fieldKey!, 'type']}
                                                        label={t('admin.hotels.amenities.type', 'Type')}
                                                    >
                                                        <Select allowClear>
                                                            {Object.values(AmenityDtoTypeEnum).map((type) => (
                                                                <Select.Option key={type} value={type}>
                                                                    {type}
                                                                </Select.Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'distanceKm']}
                                                        fieldKey={[field.fieldKey!, 'distanceKm']}
                                                        label={t('admin.hotels.amenities.distance', 'Distance (km)')}
                                                    >
                                                        <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'imageUrl']}
                                                        fieldKey={[field.fieldKey!, 'imageUrl']}
                                                        label={t('admin.hotels.amenities.imageUrl', 'Image URL')}
                                                    >
                                                        <Input maxLength={255} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={12}>
                                                <Col span={18}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'description']}
                                                        fieldKey={[field.fieldKey!, 'description']}
                                                        label={t('admin.hotels.amenities.description', 'Description')}
                                                    >
                                                        <Input.TextArea rows={2} maxLength={500} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6} className="flex items-center">
                                                    <Button danger onClick={() => remove(field.name)}>
                                                        {t('common.delete', 'Delete')}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))}
                                </Card>
                            )}
                        </Form.List>

                        <Form.Item
                            label={t("admin.hotels.fields.image", "Hotel Image")}
                            name="hotelImage"
                            extra={t("admin.hotels.add.imageHint", "Upload a hotel image (max 5MB)")}
                        >
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>
                                    {t("admin.hotels.add.selectImage", "Select Image")}
                                </Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button
                                    id="submitButton"
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    {t("admin.hotels.add.addHotel", "Add Hotel")}
                                </Button>
                                <Button
                                    onClick={() => navigate("/admin/hotels")}
                                >
                                    {t("common.cancel", "Cancel")}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
}