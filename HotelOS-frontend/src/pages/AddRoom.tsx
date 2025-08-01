import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoomStatus } from '../interfaces/Room';
import { useLoading } from '../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import {
    Form,
    Input,
    Button,
    Upload,
    Select,
    InputNumber,
    Row,
    Col,
    Card,
    message,
    Space,
    Alert
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

interface RoomDTO {
    hotel: { id: string };
    roomNumber: number;
    type: string;
    capacity: number;
    rate: number;
    status: RoomStatus;
    description?: string;
}

export default function AddRoom() {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const { Option } = Select;

    const uploadProps: UploadProps = {
        onRemove: () => {
            setFileList([]);
        },
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error(t('admin.rooms.add.imageTypeError', 'You can only upload image files!'));
                return Upload.LIST_IGNORE;
            }

            const isLessThan5MB = file.size / 1024 / 1024 < 5;
            if (!isLessThan5MB) {
                message.error(t('admin.rooms.add.imageSizeError', 'Image must be smaller than 5MB!'));
                return Upload.LIST_IGNORE;
            }

            setFileList([file]);
            return false;
        },
        fileList,
        maxCount: 1,
        listType: "picture",
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        showLoader();
        setSubmitStatus('idle');
        setErrorMessage('');

        const roomData: RoomDTO = {
            hotel: { id: hotelId || '' },
            roomNumber: values.roomNumber,
            type: values.type,
            capacity: values.capacity,
            rate: values.rate,
            status: values.status,
            description: values.description
        };

        try {
            const response = await fetch('http://localhost:8080/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                },
                body: JSON.stringify(roomData),
            });

            const responseText = await response.text();
            let data;

            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
                console.error("Failed to parse response:", parseError);
            }

            if (!response.ok) {
                if (response.status === 400 && data) {
                    if (typeof data === 'object' && Object.keys(data).length > 0) {
                        const errorMessages = [];
                        for (const [field, errMsg] of Object.entries(data)) {
                            errorMessages.push(`${field}: ${errMsg}`);
                        }
                        setErrorMessage(errorMessages.join('. '));
                        setSubmitStatus('error');
                        throw new Error('Validation failed. Please check your inputs.');
                    }

                    if (data.message) {
                        setErrorMessage(data.message);
                        setSubmitStatus('error');
                        throw new Error(data.message);
                    }
                }

                const errorMsg = data?.message || `Failed to create room (${response.status}). Please try again.`;
                setErrorMessage(errorMsg);
                setSubmitStatus('error');
                throw new Error(errorMsg);
            }

            setSubmitStatus('success');

            if (fileList.length > 0) {
                const imageFormData = new FormData();
                imageFormData.append('file', fileList[0] as any);

                const imageResponse = await fetch(`http://localhost:8080/api/rooms/${data.roomId}/image_upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                    body: imageFormData,
                });

                if (!imageResponse.ok) {
                    message.warning(t('admin.rooms.add.imageUploadPartialError', 'Room added but failed to upload image'));
                } else {
                    message.success(t('admin.rooms.add.imageUploadSuccess', 'Image uploaded successfully'));
                }
            }

            message.success(t('admin.rooms.add.success', 'Room added successfully'));
            form.resetFields();
            setFileList([]);

            setTimeout(() => {
                navigate(`/admin/hotels/${hotelId}/rooms`);
            }, 1500);

        } catch (error: any) {
            console.error('Error submitting form:', error);
            if (submitStatus !== 'error') {
                setSubmitStatus('error');
                setErrorMessage(error.message || t('admin.rooms.add.error', 'Failed to create room'));
            }
        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div style={{ marginTop: '5rem', padding: '20px' }}>
                <Card
                    title={t('admin.rooms.add.title', 'Add New Room')}
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
                            status: RoomStatus.AVAILABLE,
                        }}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="roomNumber"
                                    label={t('admin.hotels.rooms.fields.roomNumber', 'Room Number')}
                                    rules={[{
                                        required: true,
                                        message: t('admin.hotels.rooms.validation.roomNumberRequired', 'Please input room number!')
                                    }]}
                                >
                                    <InputNumber style={{ width: '100%' }} min={1} />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="capacity"
                                    label={t('admin.hotels.rooms.fields.capacity', 'Capacity')}
                                    rules={[{
                                        required: true,
                                        message: t('admin.hotels.rooms.validation.capacityRequired', 'Please input capacity!')
                                    }]}
                                >
                                    <InputNumber style={{ width: '100%' }} min={1} />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="type"
                                    label={t('admin.hotels.rooms.fields.type', 'Room Type')}
                                    rules={[{
                                        required: true,
                                        message: t('admin.hotels.rooms.validation.typeRequired', 'Please input room type!')
                                    }]}
                                >
                                    <Input maxLength={50} />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="rate"
                                    label={t('admin.hotels.rooms.fields.rate', 'Rate')}
                                    rules={[{
                                        required: true,
                                        message: t('admin.hotels.rooms.validation.rateRequired', 'Please input rate!')
                                    }]}
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
                                    name="description"
                                    label={t('admin.hotels.rooms.fields.description', 'Description')}
                                >
                                    <Input.TextArea rows={4} maxLength={500} />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="status"
                                    label={t('admin.hotels.rooms.fields.status', 'Status')}
                                    rules={[{
                                        required: true,
                                        message: t('admin.hotels.rooms.validation.statusRequired', 'Please select status!')
                                    }]}
                                >
                                    <Select>
                                        <Option value={RoomStatus.AVAILABLE}>{t('admin.hotels.rooms.status.available', 'Available')}</Option>
                                        <Option value={RoomStatus.RESERVED}>{t('admin.hotels.rooms.status.reserved', 'Reserved')}</Option>
                                        <Option value={RoomStatus.OCCUPIED}>{t('admin.hotels.rooms.status.occupied', 'Occupied')}</Option>
                                        <Option value={RoomStatus.MAINTENANCE}>{t('admin.hotels.rooms.status.maintenance', 'Under Maintenance')}</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <div className="info-box bg-gray-50 p-4 rounded mb-4">
                                    <p>
                                        <strong>{t('admin.hotels.rooms.fields.hotelId', 'Hotel ID')}:</strong> {hotelId}
                                    </p>
                                </div>
                            </Col>
                        </Row>

                        <Form.Item
                            label={t('admin.hotels.rooms.fields.image', 'Room Image')}
                            name="roomImage"
                            extra={t('admin.hotels.rooms.add.imageHint', 'Upload a room image (max 5MB)')}
                        >
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>
                                    {t('admin.hotels.rooms.add.selectImage', 'Select Image')}
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
                                    {t('admin.hotels.rooms.add.addRoom', 'Add Room')}
                                </Button>
                                <Button
                                    onClick={() => navigate(`/admin/hotels/${hotelId}/rooms`)}
                                >
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