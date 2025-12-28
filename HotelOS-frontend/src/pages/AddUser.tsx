import { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { useLoading } from '../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useApi } from '../api/useApi';

export default function AddUser() {
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const { auth: authApi } = useApi();

    const [form] = Form.useForm();
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (values: any) => {
        showLoader();
        try {
            await authApi.register(values as any);
            setSubmitStatus('success');

            message.success({
                content: t('admin.users.successMessage', 'User successfully added!'),
                duration: 4,
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
            });

            form.resetFields();

            setTimeout(() => {
                setSubmitStatus('idle');
            }, 2000);

        } catch (error) {
            console.error('Error adding user:', error);
            setSubmitStatus('error');
            message.error(t('admin.users.errorMessage', 'Failed to add user. Please try again.'));
        } finally {
            hideLoader();
        }
    };

    const getButtonProps = () => {
        if (submitStatus === 'success') {
            return {
                className: "bg-green-600 hover:bg-green-700",
                children: t('admin.users.userAdded', 'User Added!')
            };
        } else if (submitStatus === 'error') {
            return {
                className: "bg-red-600 hover:bg-red-700",
                children: t('admin.users.addError', 'Error Adding User')
            };
        }
        return {
            className: "bg-blue-600 hover:bg-blue-700",
            children: t('admin.users.addUser', 'Add User')
        };
    };

    return (
        <div className="flex flex-col min-h-screen mt-20 bg-gray-100">
            <div className="mt-20 flex justify-center pb-5">
                <h1 className="text-2xl font-bold">{t('admin.users.addNewUser', 'Add New User')}</h1>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-2xl px-4">
                    <Card className="shadow-md rounded-lg">
                        {submitStatus === 'success' && (
                            <Alert
                                message={t('admin.users.successAlert', 'Success')}
                                description={t('admin.users.successDescription', 'The user has been successfully added to the system.')}
                                type="success"
                                showIcon
                                className="mb-6"
                                closable
                            />
                        )}

                        {submitStatus === 'error' && (
                            <Alert
                                message={t('admin.users.errorAlert', 'Error')}
                                description={t('admin.users.errorDescription', 'There was a problem adding the user. Please try again.')}
                                type="error"
                                showIcon
                                className="mb-6"
                                closable
                            />
                        )}

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            requiredMark={false}
                            className="w-full"
                        >
                            <Form.Item
                                name="firstName"
                                label={t('admin.users.form.firstName', 'First Name')}
                                rules={[
                                    {
                                        required: true,
                                        message: t('admin.users.form.errors.firstNameRequired', 'First name is required')
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="lastName"
                                label={t('admin.users.form.lastName', 'Last Name')}
                                rules={[
                                    {
                                        required: true,
                                        message: t('admin.users.form.errors.lastNameRequired', 'Last name is required')
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label={t('admin.users.form.email', 'Email')}
                                rules={[
                                    {
                                        required: true,
                                        message: t('admin.users.form.errors.emailRequired', 'Email is required')
                                    },
                                    {
                                        type: 'email',
                                        message: t('admin.users.form.errors.validEmail', 'Please enter a valid email')
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label={t('admin.users.form.password', 'Password')}
                                rules={[
                                    {
                                        required: true,
                                        message: t('admin.users.form.errors.passwordRequired', 'Password is required')
                                    },
                                    {
                                        min: 6,
                                        message: t('admin.users.form.errors.passwordLength', 'Password must be at least 6 characters long')
                                    }
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item className="flex justify-center mt-6">
                                <Button
                                    id="submitButton"
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    {...getButtonProps()}
                                />
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    );
}