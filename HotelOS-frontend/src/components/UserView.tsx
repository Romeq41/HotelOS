import { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Alert, Tag, Spin } from "antd";
import { LockOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useUser } from "../contexts/UserContext.tsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLoading } from "../contexts/LoaderContext";
import useApi from "../api/useApi";
import { UserType } from "../interfaces/User";
import { ReservationDto } from "../api/generated/api";
import { API_BASE_PATH, getToken } from "../api/apiConfig";

export default function UserView() {
    const navigate = useNavigate();
    const { user } = useUser();
    const { t } = useTranslation();
    const { showLoader, hideLoader } = useLoading();
    const { auth: authApi } = useApi();
    const [form] = Form.useForm();
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const isGuest = (user?.userType || "").toString().toUpperCase() === UserType.Guest;
    const [reservations, setReservations] = useState<ReservationDto[]>([]);
    const [reservationsLoading, setReservationsLoading] = useState(false);
    const [reservationsError, setReservationsError] = useState("");

    const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString() : t("user.profile.dateUnknown", "Unknown date");

    useEffect(() => {
        const fetchReservations = async () => {
            if (!user?.userId) return;
            setReservationsLoading(true);
            setReservationsError("");
            try {
                const token = getToken();
                const response = await fetch(`${API_BASE_PATH}/api/reservations/user/${user.userId}?page=0&size=20`, {
                    headers: {
                        Accept: "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    }
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const data = await response.json();
                const content = Array.isArray(data) ? data : (data?.content || []);
                setReservations(content as ReservationDto[]);
            } catch (err: any) {
                console.error("Failed to load reservations", err);
                setReservationsError(t("user.profile.reservationsLoadError", "Could not load your reservations."));
            } finally {
                setReservationsLoading(false);
            }
        };

        fetchReservations();
    }, [user?.userId, t]);

    const handlePasswordChange = async (values: any) => {
        showLoader();
        try {
            if (values.password !== values.confirmPassword) {
                setSubmitStatus("error");
                setErrorMessage(t("user.profile.passwordsMismatch", "Passwords do not match"));
                hideLoader();
                return;
            }

            await authApi.changePassword({
                email: (values.email || user?.email || "").trim().toLowerCase(),
                currentPassword: values.currentPassword,
                newPassword: values.password,
            });

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
            const apiMessage = error?.response?.data?.message;
            const validation = error?.response?.data;
            if (validation && typeof validation === "object" && !apiMessage) {
                const messages = Object.entries(validation).map(([field, msg]) => `${field}: ${msg}`);
                setErrorMessage(messages.join(". "));
            } else {
                setErrorMessage(apiMessage || error.message || t("user.profile.passwordChangeError", "Failed to change password. Please try again."));
            }
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
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 mt-20 gap-6 p-8 pb-10">
            {/* Left: User information */}
            <div className="lg:w-1/2 w-full">
                <Card className="shadow-md h-full">
                    <h2 className="text-2xl font-bold mb-4">
                        {user?.firstName} {user?.lastName}
                    </h2>
                    {isGuest && (
                        <Button
                            type="primary"
                            className="mb-6"
                            onClick={() => navigate("/user/edit")}
                        >
                            {t("user.profile.editProfile", "Edit contact & address")}
                        </Button>
                    )}
                    <ul className="space-y-3 text-left">
                        <li>
                            <div className="text-xs text-gray-500">{t("user.profile.fields.email", "Email")}</div>
                            <div className="font-medium break-all">{user?.email || t("user.profile.notProvided", "Not provided")}</div>
                        </li>
                        <li>
                            <div className="text-xs text-gray-500">{t("user.profile.fields.address", "Address")}</div>
                            <div className="font-medium">{user?.addressInformation?.address || t("user.profile.notProvided", "Not provided")}</div>
                        </li>
                        <li className="grid grid-cols-2 gap-3">
                            <div>
                                <div className="text-xs text-gray-500">{t("user.profile.fields.city", "City")}</div>
                                <div className="font-medium">{user?.addressInformation?.city || t("user.profile.notProvided", "Not provided")}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">{t("user.profile.fields.country", "Country")}</div>
                                <div className="font-medium">{user?.addressInformation?.country || t("user.profile.notProvided", "Not provided")}</div>
                            </div>
                        </li>
                        <li>
                            <div className="text-xs text-gray-500">{t("user.profile.fields.phone", "Phone")}</div>
                            <div className="font-medium">{user?.contactInformation?.phoneNumber || t("user.profile.notProvided", "Not provided")}</div>
                        </li>
                        <li>
                            <div className="text-xs text-gray-500">{t("user.profile.fields.position", "Position")}</div>
                            <div className="font-medium">{user?.position || t("user.profile.notProvided", "Not provided")}</div>
                        </li>
                    </ul>

                    <hr className="my-6 text-gray-500" />

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
                            name="currentPassword"
                            label={t("user.profile.passwordChangeCurrentPassword", "Current Password")}
                            rules={[
                                { required: true, message: t("user.profile.currentPasswordRequired", "Current password is required") },
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} autoComplete="current-password" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={t("user.profile.passwordChangeNewPassword", "New Password")}
                            rules={[
                                { required: true, message: t("user.profile.passwordRequired", "New password is required") },
                                { min: 8, message: t("user.profile.passwordLength", "Password must be at least 8 characters long") }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
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

            {/* Right: reservations and password */}
            <div className="lg:w-1/2 w-full space-y-4">
                <Card className="shadow-md">
                    <h3 className="text-xl font-semibold mb-2">{t("user.profile.reservations", "Reservation history")}</h3>
                    <p className="text-sm text-gray-600 mb-2">{t("user.profile.reservationsInfo", "Your reservations will appear here.")}</p>

                    {reservationsError && (
                        <Alert
                            message={t("user.profile.reservations", "Reservation history")}
                            description={reservationsError}
                            type="error"
                            showIcon
                            className="mb-3"
                        />
                    )}

                    {reservationsLoading ? (
                        <div className="flex items-center gap-2 text-gray-600">
                            <Spin size="small" />
                            <span>{t("user.profile.reservationsLoading", "Loading your reservations...")}</span>
                        </div>
                    ) : reservations.length === 0 ? (
                        <Alert
                            type="info"
                            message={t("user.profile.noReservations", "No reservations yet")}
                            description={t("user.profile.noReservationsDescription", "Book a stay to see it listed here.")}
                            showIcon
                        />
                    ) : (
                        <div className="space-y-3">
                            {reservations.map((reservation) => (
                                <Card key={reservation.reservationId || reservation.checkInDate} className="border rounded-md shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="font-semibold text-lg">{reservation.reservationName || t("user.profile.unnamedReservation", "Reservation")}</div>
                                        <Tag color="blue">{reservation.status ? t(`admin.reservations.columns.status.${String(reservation.status).toLowerCase()}`, { defaultValue: String(reservation.status) }) : ""}</Tag>
                                    </div>
                                    <div className="text-sm text-gray-700 flex flex-wrap gap-3">
                                        <span>{formatDate(reservation.checkInDate)} → {formatDate(reservation.checkOutDate)}</span>
                                        {reservation.room?.roomNumber && (
                                            <span>{t("user.profile.room", "Room")}: {reservation.room.roomNumber}</span>
                                        )}
                                        {reservation.room?.hotel?.name && (
                                            <span>{reservation.room.hotel.name}</span>
                                        )}
                                        {reservation.totalAmount !== undefined && (
                                            <span>{t("user.profile.total", "Total")}: {reservation.totalAmount}</span>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2 flex-wrap mt-4">
                        <Button type="primary" onClick={() => navigate("/explore")}>{t("user.profile.explore", "Explore offers")}</Button>
                        <Button onClick={() => navigate(0)}>{t("user.profile.refresh", "Refresh")}</Button>
                    </div>
                </Card>


            </div>
        </div>
    );
}