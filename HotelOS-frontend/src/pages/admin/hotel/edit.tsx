import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";
import {
    Form,
    Input,
    InputNumber,
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
import { HotelDto } from "../../../api/generated/api";
import { useApi } from "../../../api/useApi";

export default function Adminpage_hotel_edit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [hotelData, setHotelData] = useState<HotelDto | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [primaryImage, setPrimaryImage] = useState<UploadFile | null>(null);
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoading();
    const { hotel: hotelApi } = useApi();

    useEffect(() => {
        const fetchHotelData = async () => {
            showLoader();
            if (!id) return;

            try {
                // Get hotel data using the generated API
                const hotelResponse = await hotelApi.getHotelById(Number(id));
                const hotel = hotelResponse.data as HotelDto;
                setHotelData(hotel);

                // Transform the HotelDto for the form
                const formValues = {
                    name: hotel.name,
                    address: hotel.addressInformation?.address || '',
                    city: hotel.addressInformation?.city || '',
                    state: hotel.addressInformation?.state || '',
                    zipCode: hotel.addressInformation?.zipCode || '',
                    country: hotel.addressInformation?.country || '',
                    email: hotel.contactInformation?.email || '',
                    phoneNumber: hotel.contactInformation?.phoneNumber || '',
                    basePrice: hotel.basePrice || 0,
                    description: hotel.description || ''
                };

                form.setFieldsValue(formValues);

                // Get hotel images
                try {
                    // Check if hotel has any images
                    const imagesResponse = await hotelApi.getAllHotelImages(Number(id));

                    const images = imagesResponse.data as any[];

                    if (images && images.length > 0) {
                        // Separate primary and additional images
                        const primaryImg = images.find(img => img.isPrimary);
                        const additionalImages = images.filter(img => !img.isPrimary);

                        // Set primary image
                        if (primaryImg) {
                            setPrimaryImage({
                                uid: `primary-${primaryImg.id}`,
                                name: t("admin.hotels.edit.primaryImageName", "primary-image.jpg"),
                                status: 'done' as const,
                                url: primaryImg.url,
                                response: { id: primaryImg.id, isPrimary: true }
                            });
                        }

                        // Set additional images
                        if (additionalImages.length > 0) {
                            const additionalImagesList = additionalImages.map((img, index) => ({
                                uid: img.id?.toString() || `additional-${index}`,
                                name: t("admin.hotels.edit.additionalImageName", "hotel-image-{{index}}.jpg", { index: index + 1 }),
                                status: 'done' as const,
                                url: img.url,
                                response: { id: img.id, isPrimary: false }
                            }));

                            setFileList(additionalImagesList);
                        }
                    }
                } catch (error) {
                    console.log(t("admin.hotels.edit.noImagesFound", "No existing images found for this hotel"));
                }
            } catch (err: any) {
                console.error(t("admin.hotels.edit.fetchErrorLog", "Error fetching hotel:"), err);

                if (err.response?.status === 401 || err.response?.status === 403) {
                    message.error(t("common.unauthorized", "Unauthorized access"));
                    navigate("/login");
                    return;
                }

                message.error(t("admin.hotels.edit.fetchError", "Failed to load hotel data"));
            } finally {
                hideLoader();
            }
        };

        if (id) {
            fetchHotelData();
        }
    }, [id, form]);

    const primaryImageUploadProps: UploadProps = {
        onRemove: async (file) => {
            if (file.url && file.response?.id) {
                try {
                    await hotelApi.deleteHotelImage(Number(id), file.response.id);
                    message.success(t("admin.hotels.edit.imageDeleteSuccess", "Primary image deleted successfully"));
                    setPrimaryImage(null);
                } catch (error) {
                    console.error(t("admin.hotels.edit.primaryImageDeleteError", "Error deleting primary image:"), error);
                    message.error(t("admin.hotels.edit.imageDeleteError", "Failed to delete primary image"));
                    return false;
                }
            } else {
                setPrimaryImage(null);
            }
        },
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error(t("admin.hotels.edit.imageTypeError", "You can only upload image files!"));
                return Upload.LIST_IGNORE;
            }

            const isLessThan5MB = file.size / 1024 / 1024 < 5;
            if (!isLessThan5MB) {
                message.error(t("admin.hotels.edit.imageSizeError", "Image must be smaller than 5MB!"));
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
        listType: "picture-card",
    };

    const uploadProps: UploadProps = {
        onRemove: async (file) => {
            // If the file has a URL, it's an existing image that needs to be deleted from the server
            if (file.url && file.response?.id) {
                try {
                    await hotelApi.deleteHotelImage(Number(id), file.response.id);
                    message.success(t("admin.hotels.edit.imageDeleteSuccess", "Image deleted successfully"));
                } catch (error) {
                    console.error(t("admin.hotels.edit.imageDeleteErrorLog", "Error deleting image:"), error);
                    message.error(t("admin.hotels.edit.imageDeleteError", "Failed to delete image"));
                    return false; // Prevent removal from UI if server deletion failed
                }
            }

            // Remove from local state
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error(t("admin.hotels.edit.imageTypeError", "You can only upload image files!"));
                return Upload.LIST_IGNORE;
            }

            const isLessThan5MB = file.size / 1024 / 1024 < 5;
            if (!isLessThan5MB) {
                message.error(t("admin.hotels.edit.imageSizeError", "Image must be smaller than 5MB!"));
                return Upload.LIST_IGNORE;
            }

            // Add file to the existing list instead of replacing
            setFileList(prevList => [...prevList, {
                uid: `${Date.now()}-${Math.random()}`,
                name: file.name,
                status: 'uploading',
                originFileObj: file,
            }]);
            return false;
        },
        fileList,
        multiple: true,
        listType: "picture-card",
        maxCount: 9, // Max 9 additional images (plus 1 primary = 10 total)
    };

    const onFinish = async (values: any) => {
        if (!id || !hotelData) return;
        setLoading(true);
        showLoader();

        try {
            console.log(t("admin.hotels.edit.formValuesLog", "Form values:"), values);

            // Create the HotelDto object from form values
            const hotelDto: HotelDto = {
                id: Number(id),
                name: values.name,
                addressInformation: {
                    id: hotelData.addressInformation?.id,
                    address: values.address,
                    city: values.city,
                    state: values.state,
                    zipCode: values.zipCode,
                    country: values.country
                },
                contactInformation: {
                    id: hotelData.contactInformation?.id,
                    email: values.email,
                    phoneNumber: values.phoneNumber
                },
                basePrice: parseFloat(values.basePrice) || 0,
                description: values.description
            };

            // Update hotel using the API
            await hotelApi.updateHotelById(Number(id), hotelDto);

            // Handle primary image upload
            if (primaryImage && !primaryImage.url) {
                // New primary image to upload
                const primaryFile = primaryImage.originFileObj as File;
                if (primaryFile) {
                    try {
                        // Use the dedicated primary image upload endpoint
                        await hotelApi.uploadPrimaryHotelImage(Number(id), primaryFile);
                        message.success(t("admin.hotels.edit.primaryImageUploadSuccess", "Primary image uploaded successfully"));
                    } catch (imageError) {
                        console.error(t("admin.hotels.edit.primaryImageUploadErrorLog", "Error uploading primary image:"), imageError);
                        message.warning(t("admin.hotels.edit.primaryImageUploadError", "Hotel updated but failed to upload primary image"));
                    }
                }
            }

            // Handle additional images upload
            const newImages = fileList.filter(file => !file.url); // Only upload files that don't have a URL (new files)
            if (newImages.length > 0) {
                const files = newImages.map(file => file.originFileObj as File).filter(file => file !== undefined);

                if (files.length > 0) {
                    try {
                        // Upload additional images using the multiple images endpoint
                        await hotelApi.uploadMultipleHotelImages(Number(id), files);

                        message.success(t("admin.hotels.edit.imageUploadSuccess", `${files.length} additional image(s) uploaded successfully`));
                    } catch (imageError) {
                        console.error(t("admin.hotels.edit.additionalImagesUploadErrorLog", "Error uploading additional images:"), imageError);
                        message.warning(t("admin.hotels.edit.imageUploadPartialError", "Hotel updated but failed to upload some additional images"));
                    }
                }
            }

            message.success(t("admin.hotels.edit.updateSuccess", "Hotel updated successfully"));
            navigate("/admin/hotels");
        } catch (error) {
            console.error(t("admin.hotels.edit.updateErrorLog", "Error updating hotel:"), error);
            message.error(t("admin.hotels.edit.updateError", "Failed to update hotel"));
        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    const validateZipCode = (_: any, value: string) => {
        if (!value) {
            // Let the required rule handle empty values
            return Promise.resolve();
        }

        const country = form.getFieldValue('country');
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
                    title={t("admin.hotels.edit.title", "Edit Hotel")}
                    variant="outlined"
                    style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={hotelData || {}}
                    >
                        {hotelData ? (
                            <>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="name"
                                            label={t("admin.hotels.fields.name", "Hotel Name")}
                                            rules={[{
                                                required: true,
                                                message: t("admin.hotels.validation.nameRequired", "Please input hotel name!")
                                            }]}
                                        >
                                            <Input
                                                maxLength={100}
                                                placeholder={t("admin.hotels.placeholders.name", "Enter hotel name")}
                                            />
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
                                            <Input
                                                maxLength={200}
                                                placeholder={t("admin.hotels.placeholders.address", "Enter street address")}
                                            />
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
                                            <Input
                                                maxLength={50}
                                                placeholder={t("admin.hotels.placeholders.city", "Enter city name")}
                                            />
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
                                            <Input
                                                maxLength={50}
                                                placeholder={t("admin.hotels.placeholders.state", "Enter state or province")}
                                            />
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
                                            <Input
                                                maxLength={50}
                                                placeholder={t("admin.hotels.placeholders.country", "Enter country name")}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="zipCode"
                                            label={t("admin.hotels.fields.zipCode", "Postal/ZIP Code")}
                                            dependencies={['country']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t("admin.hotels.validation.zipCodeRequired", "Please input zip code!")
                                                },
                                                { validator: validateZipCode }
                                            ]}
                                        >
                                            <Input
                                                maxLength={15}
                                                placeholder={t("admin.hotels.placeholders.zipCode", "Enter postal/ZIP code")}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="email"
                                            label={t("admin.hotels.fields.email", "Email")}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t("admin.hotels.validation.emailRequired", "Please input email!")
                                                },
                                                {
                                                    type: 'email',
                                                    message: t("admin.hotels.validation.emailInvalid", "Please enter a valid email!")
                                                }
                                            ]}
                                        >
                                            <Input
                                                maxLength={100}
                                                placeholder={t("admin.hotels.placeholders.email", "Enter email address")}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="phoneNumber"
                                            label={t("admin.hotels.fields.phoneNumber", "Phone Number")}
                                            rules={[{
                                                required: true,
                                                message: t("admin.hotels.validation.phoneRequired", "Please input phone number!")
                                            }]}
                                        >
                                            <Input
                                                maxLength={20}
                                                placeholder={t("admin.hotels.placeholders.phoneNumber", "Enter phone number")}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="basePrice"
                                            label={t("admin.hotels.fields.basePrice", "Base Price")}
                                            rules={[{
                                                required: true,
                                                message: t("admin.hotels.validation.basePriceRequired", "Please input base price!")
                                            }]}
                                        >
                                            <InputNumber
                                                min={0}
                                                step={0.01}
                                                style={{ width: '100%' }}
                                                placeholder={t("admin.hotels.placeholders.basePrice", "Enter base price")}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="description"
                                            label={t("admin.hotels.fields.description", "Description")}
                                        >
                                            <Input.TextArea
                                                maxLength={500}
                                                rows={4}
                                                placeholder={t("admin.hotels.placeholders.description", "Enter hotel description (optional)")}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label={t("admin.hotels.fields.primaryImage", "Primary Image")}
                                    name="primaryImage"
                                    extra={t("admin.hotels.edit.primaryImageHint", "Upload the main hotel image that will be displayed as primary (max 5MB). This image represents your hotel in search results.")}
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
                                                    {t("admin.hotels.edit.selectPrimaryImage", "Primary Image")}
                                                </div>
                                            </div>
                                        ) : null}
                                    </Upload>
                                </Form.Item>

                                <Form.Item
                                    label={t("admin.hotels.fields.additionalImages", "Additional Images")}
                                    name="additionalImages"
                                    extra={t("admin.hotels.edit.additionalImagesHint", "Upload additional hotel images for gallery (max 5MB each, max 9 images). Currently: {{count}} additional image(s).", { count: fileList.length })}
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
                                                    {t("admin.hotels.edit.selectAdditionalImages", "Add More")}
                                                </div>
                                            </div>
                                        )}
                                    </Upload>
                                </Form.Item>

                                <Form.Item>
                                    <Space>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                        >
                                            {t("admin.hotels.edit.saveChanges", "Save Changes")}
                                        </Button>
                                        <Button
                                            onClick={() => navigate("/admin/hotels")}
                                        >
                                            {t("common.cancel", "Cancel")}
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Spin size="large" />
                                <p style={{ marginTop: '10px' }}>
                                    {t("admin.hotels.edit.loading", "Loading hotel data...")}
                                </p>
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </div>
    );
}