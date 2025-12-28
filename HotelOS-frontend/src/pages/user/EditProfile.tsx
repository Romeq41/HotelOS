import { useEffect, useState } from "react";
import { Card, Form, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser } from "../../contexts/UserContext";
import { useLoading } from "../../contexts/LoaderContext";
import useApi from "../../api/useApi";
import FormItemWithVerification from "../../components/FormItemWithVerification";
import { UserType } from "../../interfaces/User";

interface FormValues {
    contactEmail?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    zipCode?: string;
}

export default function EditProfile() {
    const { user, isAuth, setUser } = useUser();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { showLoader, hideLoader } = useLoading();
    const { user: userApi } = useApi();
    const [form] = Form.useForm<FormValues>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
            return;
        }
        if (user && user.userType !== UserType.Guest) {
            message.warning(t("user.editProfile.onlyGuests", "Only guests can edit this information."));
            navigate("/user");
        }
    }, [isAuth, user, navigate, t]);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                contactEmail: user.contactInformation?.email || user.email || "",
                phone: user.contactInformation?.phoneNumber || "",
                country: user.addressInformation?.country || "",
                state: user.addressInformation?.state || "",
                city: user.addressInformation?.city || "",
                address: user.addressInformation?.address || "",
                zipCode: user.addressInformation?.zipCode || "",
            });
        }
    }, [user, form]);

    const onFinish = async (values: FormValues) => {
        if (!user?.userId) return;
        setIsSubmitting(true);
        showLoader();
        try {
            const payload: any = {
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType,
                position: (user as any).position,
                hotel: (user as any).hotel ? { id: (user as any).hotel.id } : undefined,
                email: user.email,
                contactInformation: {
                    email: values.contactEmail || user.contactInformation?.email || user.email,
                    phoneNumber: values.phone || user.contactInformation?.phoneNumber || "",
                },
                addressInformation: {
                    address: values.address || "",
                    city: values.city || "",
                    state: values.state || "",
                    zipCode: values.zipCode || "",
                    country: values.country || "",
                },
            };

            await userApi.updateUserById(Number(user.userId), payload);

            // Refresh user context with latest data
            try {
                const { data } = await userApi.getUserById(Number(user.userId));
                setUser(data as any);
            } catch (refreshError) {
                console.warn("Could not refresh user after update", refreshError);
            }
            message.success(t("user.editProfile.success", "Profile updated."));
            navigate("/user");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            const apiMessage = error?.response?.data?.message;
            const validation = error?.response?.data;
            if (validation && typeof validation === "object" && !apiMessage) {
                const messages = Object.entries(validation).map(([field, msg]) => `${field}: ${msg}`);
                message.error(messages.join(". "));
            } else {
                message.error(apiMessage || error.message || t("user.editProfile.error", "Failed to update profile."));
            }
        } finally {
            hideLoader();
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center bg-gray-100 min-h-screen">
            <div className="w-full max-w-3xl px-4 mt-24 mb-12">
                <Card className="shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">
                        {t("user.editProfile.title", "Edit your contact and address information")}
                    </h1>
                    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormItemWithVerification
                                type="email"
                                name="contactEmail"
                                label={t("user.editProfile.contactEmail", "Contact email") as string}
                                placeholder={t("user.editProfile.contactEmailPlaceholder", "your@email.com") as string}
                                required
                                requiredMessage={t("user.editProfile.contactEmailRequired", "Email is required") as string}
                            />
                            <FormItemWithVerification
                                type="text"
                                name="phone"
                                label={t("user.editProfile.phone", "Phone number") as string}
                                placeholder={t("user.editProfile.phonePlaceholder", "+48 123 456 789") as string}
                                minLength={6}
                            />
                            <FormItemWithVerification
                                type="text"
                                name="country"
                                label={t("user.editProfile.country", "Country") as string}
                                placeholder={t("user.editProfile.countryPlaceholder", "Country") as string}
                            />
                            <FormItemWithVerification
                                type="text"
                                name="state"
                                label={t("user.editProfile.state", "State/Region") as string}
                                placeholder={t("user.editProfile.statePlaceholder", "State/Region") as string}
                            />
                            <FormItemWithVerification
                                type="text"
                                name="city"
                                label={t("user.editProfile.city", "City") as string}
                                placeholder={t("user.editProfile.cityPlaceholder", "City") as string}
                            />
                            <FormItemWithVerification
                                type="text"
                                name="address"
                                label={t("user.editProfile.address", "Street address") as string}
                                placeholder={t("user.editProfile.addressPlaceholder", "Street and number") as string}
                            />
                            <FormItemWithVerification
                                type="text"
                                name="zipCode"
                                label={t("user.editProfile.zip", "Postal code") as string}
                                placeholder={t("user.editProfile.zipPlaceholder", "00-000") as string}
                            />
                        </div>
                        <div className="flex justify-center mt-6">
                            <Button type="primary" htmlType="submit" size="large" loading={isSubmitting}>
                                {t("user.editProfile.save", "Save changes")}
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
}
