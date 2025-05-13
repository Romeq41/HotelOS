import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";
import {
    Form,
    Input,
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

interface HotelData {
    id?: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export default function Adminpage_hotel_edit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [hotelData, setHotelData] = useState<HotelData | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoading();

    useEffect(() => {
        const fetchHotelData = async () => {
            showLoader();
            if (!id) return;
            try {
                const response = await fetch(`http://localhost:8080/api/hotels/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${document.cookie.replace(
                            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                            "$1"
                        )}`
                    }
                });

                if (response.status === 401 || response.status === 403) {
                    message.error(t("common.unauthorized", "Unauthorized access"));
                    navigate("/login");
                    return;
                }

                if (!response.ok) throw new Error("Failed to fetch hotel data");

                const data = await response.json();
                setHotelData(data);
                form.setFieldsValue(data);

                try {
                    const imageResponse = await fetch(`http://localhost:8080/api/hotels/${id}/image`, {
                        method: "HEAD",
                        headers: {
                            Authorization: `Bearer ${document.cookie.replace(
                                /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                                "$1"
                            )}`
                        }
                    });

                    if (imageResponse.ok) {
                        const imageUrl = `http://localhost:8080/api/hotels/${id}/image`;
                        setFileList([
                            {
                                uid: '-1',
                                name: 'hotel-image.jpg',
                                status: 'done',
                                url: imageUrl,
                            }
                        ]);
                    }
                } catch (error) {
                    console.log("No existing image found for this hotel");
                }

            } catch (err) {
                console.error("Error fetching hotel:", err);
                message.error(t("admin.hotels.edit.fetchError", "Failed to load hotel data"));
            } finally {
                hideLoader();
            }
        };

        if (id) {
            fetchHotelData();
        }
    }, [id, form, t]);

    const uploadProps: UploadProps = {
        onRemove: () => {
            setFileList([]);
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

            setFileList([file]);
            return false;
        },
        fileList,
        maxCount: 1,
        listType: "picture",
    };

    const onFinish = async (values: HotelData) => {
        if (!id) return;
        setLoading(true);
        showLoader();

        values.id = id;

        try {
            console.log("Form values:", values);
            const response = await fetch(`http://localhost:8080/api/hotels/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${document.cookie.replace(
                        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                        "$1"
                    )}`
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                throw new Error(`Failed to update hotel: ${response.status}`);
            }

            if (fileList.length > 0 && !fileList[0].url) {
                const imageFormData = new FormData();
                imageFormData.append("file", fileList[0] as any);

                const imageResponse = await fetch(`http://localhost:8080/api/hotels/${id}/image_upload`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${document.cookie.replace(
                            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                            "$1"
                        )}`
                    },
                    body: imageFormData
                });

                if (!imageResponse.ok) {
                    message.warning(t("admin.hotels.edit.imageUploadPartialError", "Hotel updated but failed to upload image"));
                } else {
                    message.success(t("admin.hotels.edit.imageUploadSuccess", "Image uploaded successfully"));
                }
            }

            message.success(t("admin.hotels.edit.updateSuccess", "Hotel updated successfully"));
            navigate("/admin/hotels");
        } catch (error) {
            console.error("Error updating hotel:", error);
            message.error(t("admin.hotels.edit.updateError", "Failed to update hotel"));
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

                                <Form.Item
                                    label={t("admin.hotels.fields.image", "Hotel Image")}
                                    name="hotelImage"
                                    extra={t("admin.hotels.edit.imageHint", "Upload a hotel image (max 5MB)")}
                                >
                                    <Upload {...uploadProps}>
                                        <Button icon={<UploadOutlined />}>
                                            {t("admin.hotels.edit.selectImage", "Select Image")}
                                        </Button>
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