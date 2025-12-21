import { useEffect, useState } from "react";
import { Form, Input, Button, Card, message, Alert } from "antd";
import { LockOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useUser } from "../contexts/UserContext.tsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLoading } from "../contexts/LoaderContext";

export default function UserView() {
    const navigate = useNavigate();
    const { user, isAuth } = useUser();
    const { t } = useTranslation();
    const { showLoader, hideLoader } = useLoading();
    const [form] = Form.useForm();
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
    }, [isAuth, navigate]);

    const handlePasswordChange = async (values: any) => {
        showLoader();
        try {
            if (values.password !== values.confirmPassword) {
                setSubmitStatus("error");
                setErrorMessage(t("user.profile.passwordsMismatch", "Passwords do not match"));
                hideLoader();
                return;
            }

            const response = await fetch("http://localhost:8080/api/auth/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: values.email,
                    newPassword: values.password,
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
                    if (typeof data === "object" && Object.keys(data).length > 0) {
                        const errorMessages = [];
                        for (const [field, errMsg] of Object.entries(data)) {
                            errorMessages.push(`${field}: ${errMsg}`);
                        }
                        setErrorMessage(errorMessages.join(". "));
                        setSubmitStatus("error");
                        throw new Error("Validation failed");
                    }

                    if ((data as any).message) {
                        setErrorMessage((data as any).message as string);
                        setSubmitStatus("error");
                        throw new Error((data as any).message as string);
                    }
                }

                throw new Error("Password change failed");
            }

            setSubmitStatus("success");
            message.success({
                content: t("user.profile.passwordChangeSuccess", "Password successfully changed!"),
                duration: 4,
                icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />
            });
            form.resetFields();
        } catch (error: any) {
            console.error("Error changing password:", error);
            setSubmitStatus("error");
            setErrorMessage(error.message || t("user.profile.passwordChangeError", "Failed to change password. Please try again."));
        } finally {
            hideLoader();
        }
    };

    const getButtonProps = () => {
        if (submitStatus === "success") {
            return {
                className: "bg-green-600 hover:bg-green-700",
                children: t("user.profile.passwordChangeSuccessButton", "Password Changed")
            };
        }
        if (submitStatus === "error") {
            return {
                className: "bg-red-600 hover:bg-red-700",
                children: t("user.profile.passwordChangeErrorButton", "Error Changing Password")
            };
        }
        return {
            className: "bg-blue-600 hover:bg-blue-700",
            children: t("user.profile.passwordChangeButton", "Change Password")
        };
    };

    return (
        <div className="flex flex-col sm:flex-row h-screen bg-gray-100 mt-20">
            {/* Left Section: Hotel data */}
            <div className="sm:w-1/2 w-full bg-white shadow-lg p-8 text-center sm:text-left">
                <h2 className="text-2xl font-bold mb-6">{t("user.profile.hotelInfo", "Hotel Information")}</h2>
                <ul className="space-y-4">
                    <li>
                        <strong>{t("user.profile.fields.hotelName", "Hotel Name")}:</strong> Grand Hotel
                    </li>
                    <li>
                        <strong>{t("user.profile.fields.location", "Location")}:</strong> 123 Main Street, Cityville
                    </li>
                    <li>
                        <strong>{t("user.profile.fields.checkInTime", "Check-in Time")}:</strong> 3:00 PM
                    </li>
                    <li>
                        <strong>{t("user.profile.fields.checkOutTime", "Check-out Time")}:</strong> 11:00 AM
                    </li>
                    <li>
                        <strong>{t("user.profile.fields.contact", "Contact")}:</strong> +1 234 567 890
                    </li>
                </ul>
            </div>

            {/* Right Section: User data */}
            <div className="sm:w-1/2 w-full bg-gray-50 shadow-lg p-8 flex flex-col items-center">
                <img
                    src={`http://localhost:8080/api/users/${user?.userId}/image` || "https://via.placeholder.com/160"}
                    alt={t("user.profile.userPhoto", "User Photo")}
                    className="w-32 h-32 rounded-full mb-6 shadow-md"
                />
                <h2 className="text-2xl font-bold mb-4">
                    {user?.firstName} {user?.lastName}
                </h2>
                <ul className="space-y-4 text-center">
                    <li>
                        <strong>{t("user.profile.fields.email", "Email")}:</strong> {user?.email}
                    </li>
                    <li>
                        <strong>{t("user.profile.fields.address", "Address")}:</strong> {user?.addressInformation?.address || t("user.profile.notProvided", "Not provided")}
                    </li>
                    <li>
                        <strong>{t("user.profile.fields.phone", "Phone")}:</strong> {user?.contactInformation?.phoneNumber || t("user.profile.notProvided", "Not provided")}
                    </li>
                    <li>
                        <strong>{t("user.profile.fields.position", "Position")}:</strong> {user?.position || t("user.profile.notProvided", "Not provided")}
                    </li>
                </ul>

                <Card className="w-full mt-8 shadow-md">
                    {submitStatus === "success" && (
                        <Alert
                            message={t("user.profile.passwordChangeSuccessAlert", "Success")}
                            description={t("user.profile.passwordChangeSuccessDescription", "Your password has been updated.")}
                            type="success"
                            showIcon
                            className="mb-4"
                            closable
                        />
                    )}

                    {submitStatus === "error" && (
                        <Alert
                            message={t("user.profile.passwordChangeErrorAlert", "Error")}
                            description={errorMessage || t("user.profile.passwordChangeErrorDescription", "There was a problem changing your password. Please try again.")}
                            type="error"
                            showIcon
                            className="mb-4"
                            closable
                        />
                    )}

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handlePasswordChange}
                        requiredMark={false}
                        initialValues={{ email: user?.email }}
                    >
                        <Form.Item
                            name="email"
                            label={t("user.profile.passwordChangeEmail", "Email")}
                            rules={[
                                { required: true, message: t("user.profile.passwordChangeEmailRequired", "Email is required") },
                                { type: "email", message: t("user.profile.passwordChangeEmailValid", "Please enter a valid email") }
                            ]}
                        >
                            <Input disabled={!user?.email} placeholder={user?.email || "email"} prefix={<span className="text-gray-400">@</span>} />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={t("user.profile.passwordChangeNewPassword", "New Password")}
                            rules={[
                                { required: true, message: t("user.profile.passwordRequired", "New password is required") },
                                { min: 6, message: t("user.profile.passwordLength", "Password must be at least 6 characters long") }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label={t("user.profile.passwordChangeConfirmPassword", "Confirm Password")}
                            rules={[
                                { required: true, message: t("user.profile.confirmPasswordRequired", "Please confirm your password") },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error(t("user.profile.passwordsMismatch", "The two passwords do not match!")));
                                    },
                                }),
                            ]}
                            dependencies={["password"]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>

                        <Form.Item className="flex justify-center mt-4">
                            <Button
                                id="changePasswordButton"
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
    );
}