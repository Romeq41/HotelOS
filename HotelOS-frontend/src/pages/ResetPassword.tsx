import { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { useLoading } from '../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmReset, setConfirmReset] = useState(false);

    const handleSubmit = async (values: any) => {
        showLoader();
        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                }),
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
                        throw new Error('Validation failed');
                    }

                    if (data.message) {
                        setErrorMessage(data.message);
                        setSubmitStatus('error');
                        throw new Error(data.message);
                    }
                }

                throw new Error('Password reset failed');
            }

            setSubmitStatus('success');
            setConfirmReset(false);

            message.success({
                content: t('auth.resetPassword.successMessage', 'Temporary password generated and sent to your email.'),
                duration: 4,
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
            });

            form.resetFields();

            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error: any) {
            console.error('Error resetting password:', error);
            setSubmitStatus('error');
            setErrorMessage(error.message || t('auth.resetPassword.errorMessage', 'Failed to reset password. Please try again.'));
        } finally {
            hideLoader();
        }
    };

    const getButtonProps = () => {
        if (submitStatus === 'success') {
            return {
                className: "bg-green-600 hover:bg-green-700",
                children: t('auth.resetPassword.success', 'Email Sent!')
            };
        } else if (submitStatus === 'error') {
            return {
                className: "bg-red-600 hover:bg-red-700",
                children: t('auth.resetPassword.error', 'Error Resetting Password')
            };
        }
        return {
            className: confirmReset ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700",
            children: confirmReset
                ? t('auth.resetPassword.confirm', 'Confirm reset')
                : t('auth.resetPassword.reset', 'Send temporary password')
        };
    };

    return (
        <div className="flex flex-col min-h-screen mt-20 bg-gray-100">
            <div className="mt-20 flex justify-center pb-5">
                <h1 className="text-2xl font-bold">{t('auth.resetPassword.title', 'Reset Your Password')}</h1>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-2xl px-4">
                    <Card className="shadow-md rounded-lg">
                        {submitStatus === 'success' && (
                            <Alert
                                message={t('auth.resetPassword.successAlert', 'Success')}
                                description={t('auth.resetPassword.successDescription', 'A temporary password was generated and sent to your email. You will be redirected to login.')}
                                type="success"
                                showIcon
                                className="mb-6"
                                closable
                            />
                        )}

                        {submitStatus === 'error' && (
                            <Alert
                                message={t('auth.resetPassword.errorAlert', 'Error')}
                                description={errorMessage || t('auth.resetPassword.errorDescription', 'There was a problem resetting your password. Please try again.')}
                                type="error"
                                showIcon
                                className="mb-6"
                                closable
                            />
                        )}

                        {confirmReset && submitStatus !== 'success' && (
                            <Alert
                                message={t('auth.resetPassword.confirmTitle', 'Confirm reset')}
                                description={t('auth.resetPassword.confirmDescription', 'This will invalidate your current password and send a temporary one to your email.')}
                                type="warning"
                                showIcon
                                className="mb-6"
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
                                name="email"
                                label={t('auth.resetPassword.form.email', 'Email')}
                                rules={[
                                    {
                                        required: true,
                                        message: t('auth.resetPassword.form.errors.emailRequired', 'Email is required')
                                    },
                                    {
                                        type: 'email',
                                        message: t('auth.resetPassword.form.errors.validEmail', 'Please enter a valid email')
                                    }
                                ]}
                            >
                                <Input prefix={<span className="text-gray-400">@</span>} placeholder="example@email.com" />
                            </Form.Item>

                            <Form.Item className="flex justify-center mt-6">
                                <Button
                                    id="submitButton"
                                    type="primary"
                                    htmlType="button"
                                    size="large"
                                    onClick={() => {
                                        if (submitStatus === 'success') return;
                                        if (!confirmReset) {
                                            setConfirmReset(true);
                                            setSubmitStatus('idle');
                                            setErrorMessage('');
                                            return;
                                        }
                                        form.submit();
                                    }}
                                    {...getButtonProps()}
                                />
                            </Form.Item>

                            <div className="text-center mt-4">
                                <a href="/login" className="text-blue-500 hover:underline">
                                    {t('auth.resetPassword.backToLogin', 'Back to Login')}
                                </a>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    );
}