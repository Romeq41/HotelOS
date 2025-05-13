import { useEffect } from "react";
import { useUser } from "../contexts/UserContext.tsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function UserView() {
    const navigate = useNavigate();
    const { user, isAuth } = useUser();
    const { t } = useTranslation();

    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
    }, [isAuth, navigate]);

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
                        <strong>{t("user.profile.fields.address", "Address")}:</strong> {user?.address || t("user.profile.notProvided", "Not provided")}
                    </li>
                    <li>
                        <strong>{t("user.profile.fields.phone", "Phone")}:</strong> {user?.phone || t("user.profile.notProvided", "Not provided")}
                    </li>
                    <li>
                        <strong>{t("user.profile.fields.position", "Position")}:</strong> {user?.position || t("user.profile.notProvided", "Not provided")}
                    </li>
                </ul>
            </div>
        </div>
    );
}