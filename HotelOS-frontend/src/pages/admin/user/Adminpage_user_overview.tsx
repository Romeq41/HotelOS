import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, UserType } from "../../../interfaces/User";
import { useLoading } from "../../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../contexts/UserContext";

export default function Admin_User_overview() {
    const { id } = useParams<{ id: string }>();
    const { hotelId } = useParams<{ hotelId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const { user: currentUser } = useUser();

    useEffect(() => {
        const fetchUser = async () => {
            showLoader();
            if (id) {
                try {
                    const res = await fetch(`http://localhost:8080/api/users/${id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                        },
                    });

                    if (!res.ok) {
                        throw new Error('Failed to fetch user data');
                    }

                    const data = await res.json();
                    setUser(data);
                } catch (error) {
                    console.error("Error fetching user:", error);
                } finally {
                    hideLoader();
                }
            } else {
                hideLoader();
            }
        };
        fetchUser();
    }, [id]);

    const getEditUrl = () => {
        const path = location.pathname;

        if (path.includes('/admin/users/')) {
            return `/admin/users/${id}/edit`;
        } else if (path.includes('/manager/hotel/')) {
            return `/manager/hotel/${hotelId}/staff/${id}/edit`;
        } else {
            return currentUser?.userType === UserType.ADMIN
                ? `/admin/users/${id}/edit`
                : `/manager/hotel/${user?.hotel?.id}/staff/${id}/edit`;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Title */}
            <div className="container mt-20 mx-auto py-8 px-4">
                {user ? (
                    <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="md:w-1/2">
                            <img
                                src={`http://localhost:8080/api/users/${user.userId}/image` || "https://via.placeholder.com/160"}
                                alt={user.firstName + " " + user.lastName}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="md:w-1/2 p-6">
                            <h1 className="text-2xl font-bold mb-4">{user.firstName + " " + user.lastName}</h1>
                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.users.details.id', 'ID')}:</strong> {user.userId || t('admin.users.unknown', 'Unknown')}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.users.details.userType', 'User Type')}:</strong> {user.userType || t('admin.users.unknown', 'Unknown')}
                            </p>
                            <hr className="block my-3" />

                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.users.details.hotel', 'Hotel')}:</strong>{" "}
                                {user.hotel
                                    ? `${"(" + user.hotel.id + ") " + user.hotel.name + "  " + user.hotel.city}`
                                    : t('admin.users.unknown', 'Unknown')}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.users.details.position', 'Position')}:</strong> {user.position || t('admin.users.unknown', 'Unknown')}
                            </p>

                            <hr className="block my-3" />

                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.users.details.email', 'Email')}:</strong> {user.email || t('admin.users.unknown', 'Unknown')}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.users.details.phone', 'Phone')}:</strong> {user.phone || t('admin.users.unknown', 'Unknown')}
                            </p>
                            <hr className="block my-3" />

                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.users.details.country', 'Country')}:</strong> {user.country || t('admin.users.unknown', 'Unknown')}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.users.details.state', 'State')}:</strong> {user.state || t('admin.users.unknown', 'Unknown')}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.users.details.city', 'City')}:</strong> {user.city || t('admin.users.unknown', 'Unknown')}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.users.details.address', 'Address')}:</strong> {user.address || t('admin.users.unknown', 'Unknown')}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <strong>{t('admin.users.details.zipCode', 'Zip-code')}:</strong> {user.zipCode || t('admin.users.unknown', 'Unknown')}
                            </p>

                            <button
                                onClick={() => navigate(getEditUrl())}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                {t('admin.users.actions.edit', 'Edit User')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        {t('admin.users.loading', 'Loading User information...')}
                    </p>
                )}
            </div>
        </div>
    );
}