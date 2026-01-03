import { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { useLoading } from '../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useApi from '../api/useApi';

type ResetStage = 'request' | 'confirm';

export default function ResetPassword() {
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { auth: authApi } = useApi();

    const [form] = Form.useForm();
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [stage, setStage] = useState<ResetStage>('request');
    const [lastSuccessStage, setLastSuccessStage] = useState<ResetStage | null>(null);

    const normalizeEmail = (raw: string) => raw.trim().toLowerCase();

    const handleSubmit = async (values: any) => {
        showLoader();
        setSubmitStatus('idle');
        setErrorMessage('');
        try {
            if (stage === 'request') {
                const email = normalizeEmail(values.email);
                await authApi.requestReset({ email });

                setLastSuccessStage('request');
                setSubmitStatus('success');
                setStage('confirm');
                form.setFieldsValue({ email });

                message.success({
                    content: t('auth.resetPassword.requested', 'Check your email for the reset code.'),
                    duration: 4,
                    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
                });
            } else {
                if (values.newPassword !== values.confirmPassword) {
                    throw new Error(t('auth.resetPassword.passwordsMismatch', 'Passwords do not match'));
                }

                await authApi.confirmReset({
                    token: values.token,
                    newPassword: values.newPassword,
                });

                setLastSuccessStage('confirm');
                setSubmitStatus('success');
                message.success({
                    content: t('auth.resetPassword.successMessage', 'Password updated. You can now log in.'),
                    duration: 4,
                    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
                });

                form.resetFields();
                setTimeout(() => navigate('/login'), 1500);
            }
        } catch (error: any) {
            console.error('Error resetting password:', error);
            setSubmitStatus('error');
            const apiMessage = error?.response?.data?.message;
            const validation = error?.response?.data;
            if (validation && typeof validation === 'object' && !apiMessage) {
                const messages = Object.entries(validation).map(([field, msg]) => `${field}: ${msg}`);
                setErrorMessage(messages.join('. '));
            } else {
                setErrorMessage(apiMessage || error.message || t('auth.resetPassword.errorMessage', 'Failed to reset password. Please try again.'));
            }
        } finally {
            hideLoader();
        }
    };

    const getButtonProps = () => {
        if (submitStatus === 'success') {
            return {
                className: 'bg-green-600 hover:bg-green-700',
                children: successStage === 'request'
                    ? t('auth.resetPassword.emailSent', 'Email sent')
                    : t('auth.resetPassword.completed', 'Password updated')
            };
        }
        if (submitStatus === 'error') {
            return {
                className: 'bg-red-600 hover:bg-red-700',
                children: t('auth.resetPassword.error', 'Error')
            };
        }
        return {
            className: stage === 'request' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-500 hover:bg-yellow-600',
            children: stage === 'request'
                ? t('auth.resetPassword.request', 'Send reset email')
                : t('auth.resetPassword.confirm', 'Confirm new password')
        };
    };

    const successStage = lastSuccessStage || stage;

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
                                description={successStage === 'request'
                                    ? t('auth.resetPassword.successDescription', 'We emailed you a reset code. Enter it below with a new password.')
                                    : t('auth.resetPassword.successDescriptionFinal', 'Your password was updated. Redirecting to login...')}
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
                                <Input prefix={<span className="text-gray-400">@</span>} placeholder="example@email.com" disabled={stage === 'confirm'} />
                            </Form.Item>

                            {stage === 'confirm' && (
                                <>
                                    <Form.Item
                                        name="token"
                                        label={t('auth.resetPassword.form.token', 'Reset code')}
                                        rules={[{ required: true, message: t('auth.resetPassword.form.errors.tokenRequired', 'Reset code is required') }]}
                                    >
                                        <Input placeholder={t('auth.resetPassword.form.tokenPlaceholder', 'Paste the code from email')} />
                                    </Form.Item>

                                    <Form.Item
                                        name="newPassword"
                                        label={t('auth.resetPassword.form.newPassword', 'New password')}
                                        rules={[
                                            { required: true, message: t('auth.resetPassword.form.errors.passwordRequired', 'New password is required') },
                                            { min: 8, message: t('auth.resetPassword.form.errors.passwordLength', 'Password must be at least 8 characters') }
                                        ]}
                                    >
                                        <Input.Password placeholder={t('auth.resetPassword.form.newPasswordPlaceholder', 'Enter new password')} />
                                    </Form.Item>

                                    <Form.Item
                                        name="confirmPassword"
                                        label={t('auth.resetPassword.form.confirmPassword', 'Confirm password')}
                                        dependencies={['newPassword']}
                                        rules={[
                                            { required: true, message: t('auth.resetPassword.form.errors.confirmPassword', 'Please confirm your password') },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('newPassword') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error(t('auth.resetPassword.passwordsMismatch', 'Passwords do not match')));
                                                },
                                            })
                                        ]}
                                    >
                                        <Input.Password placeholder={t('auth.resetPassword.form.confirmPasswordPlaceholder', 'Repeat new password')} />
                                    </Form.Item>
                                </>
                            )}

                            <Form.Item className="flex justify-center mt-6">
                                <Button
                                    id="submitButton"
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    disabled={submitStatus === 'success' && lastSuccessStage === 'confirm'}
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