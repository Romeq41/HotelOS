import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserType } from "../../../interfaces/User";
import { useLoading } from "../../../contexts/LoaderContext";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../contexts/UserContext";
import { getEditUrl, getPermissionContext } from "../../../utils/routeUtils";
import { useApi } from "../../../api/useApi";
import { API_BASE_PATH } from "../../../api/apiConfig";
import { UserDto } from "../../../api/generated/api";
import { message } from "antd";

export default function Admin_User_overview() {
    const { id } = useParams<{ id: string }>();
    const { hotelId } = useParams<{ hotelId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserDto | null>(null);
    const { showLoader, hideLoader } = useLoading();
    const { t } = useTranslation();
    const { user: currentUser } = useUser();
    const { user: userApi } = useApi();

    useEffect(() => {
        const fetchUser = async () => {
            showLoader();
            if (!id) {
                hideLoader();
                return;
            }
            try {
                const res = await userApi.getUserById(Number(id));
                setUser(res.data as UserDto);
            } catch (error: any) {
                console.error("Error fetching user:", error);
                if (error?.response?.status === 401 || error?.response?.status === 403) {
                    message.error(t('common.unauthorized', 'Unauthorized access'));
                    navigate('/login');
                    return;
                }
            } finally {
                hideLoader();
            }
        };
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, userApi]);

    const permissionContext = getPermissionContext(location.pathname);
    const computeEditUrl = () => {
        console.log(permissionContext, hotelId, user, currentUser);
        // Users live under different entity bases: admin has /admin/users, manager/staff under hotel context.
        if (permissionContext === UserType.Admin) {
            return `/admin/users/${id}/edit`;
        }
        // For manager/staff, treat entity type as 'staff' and use hotel context
        const hotelCtx = hotelId || user?.hotel?.id || currentUser?.hotel?.id;
        return getEditUrl(permissionContext, hotelCtx ?? '', 'staff', id || '');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="container mt-20 mx-auto py-8 px-4">
                {user ? (
                    <div className="flex flex-col md:flex-row items-start gap-4 bg-white shadow-md rounded-lg overflow-hidden p-4">
                        {/* Left: Image */}
                        <div className="md:w-1/2 relative rounded-lg overflow-hidden border border-gray-200">
                            <img
                                src={`${API_BASE_PATH}/api/users/${id}/image` || "https://via.placeholder.com/600x400"}
                                alt={`${user.firstName || ''} ${user.lastName || ''}`}
                                className="w-full h-full object-cover"
                                style={{ minHeight: 320 }}
                            />
                        </div>

                        {/* Right: Details */}
                        <div className="md:w-1/2 p-4 md:p-6 flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-3">
                                <h1 className="text-2xl font-bold leading-tight">{`${user.firstName || ''} ${user.lastName || ''}`.trim()}</h1>
                                <span className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                    <span className="opacity-80">#</span>{id ?? t('admin.users.unknown', 'Unknown')}
                                </span>
                            </div>

                            {/* Position & Role */}
                            <div className="flex items-center gap-3 text-gray-700">
                                <div><strong>{t('admin.users.details.position', 'Position')}:</strong> {(user as any)?.position || t('admin.users.unknown', 'Unknown')}</div>
                                <div className="hidden sm:block text-gray-300">|</div>
                                <div><strong>{t('admin.users.details.userType', 'User Type')}:</strong> {(user as any)?.userType || t('admin.users.unknown', 'Unknown')}</div>
                            </div>

                            {/* Hotel */}
                            <div>
                                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('admin.users.details.hotel', 'Hotel')}</h2>
                                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                                    {user.hotel
                                        ? `${"(" + user.hotel.id + ") " + (user.hotel as any)?.name} ${(user.hotel as any)?.addressInformation?.city ? '— ' + (user.hotel as any)?.addressInformation?.city : ''}`
                                        : t('admin.users.unknown', 'Unknown')}
                                </div>
                            </div>

                            {/* Contact */}
                            <div>
                                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('admin.users.details.contact', 'Contact')}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <a
                                        href={(user as any)?.email ? `mailto:${(user as any).email}` : undefined}
                                        className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 transition-colors"
                                    >
                                        <div className="text-xs uppercase text-gray-500">{t('admin.users.details.accountEmail', 'Account Email (login)')}</div>
                                        <div className="text-blue-700 break-all">{(user as any)?.email || t('admin.users.unknown', 'Unknown')}</div>
                                    </a>
                                    <a
                                        href={(user as any)?.contactInformation?.email ? `mailto:${(user as any)?.contactInformation?.email}` : undefined}
                                        className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 transition-colors"
                                    >
                                        <div className="text-xs uppercase text-gray-500">{t('admin.users.details.contactEmail', 'Contact Email')}</div>
                                        <div className="text-blue-700 break-all">{(user as any)?.contactInformation?.email || t('admin.users.unknown', 'Unknown')}</div>
                                    </a>
                                    <a
                                        href={(user as any)?.contactInformation?.phoneNumber ? `tel:${(user as any)?.contactInformation?.phoneNumber}` : undefined}
                                        className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 transition-colors"
                                    >
                                        <div className="text-xs uppercase text-gray-500">{t('admin.users.details.phone', 'Phone')}</div>
                                        <div className="text-blue-700">{(user as any)?.contactInformation?.phoneNumber || t('admin.users.unknown', 'Unknown')}</div>
                                    </a>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('admin.users.details.addressInfo', 'Address')}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                                        <div className="text-xs uppercase text-gray-500">{t('admin.users.details.country', 'Country')}</div>
                                        <div className="text-gray-800">{(user as any)?.addressInformation?.country || t('admin.users.unknown', 'Unknown')}</div>
                                    </div>
                                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                                        <div className="text-xs uppercase text-gray-500">{t('admin.users.details.state', 'State')}</div>
                                        <div className="text-gray-800">{(user as any)?.addressInformation?.state || t('admin.users.unknown', 'Unknown')}</div>
                                    </div>
                                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                                        <div className="text-xs uppercase text-gray-500">{t('admin.users.details.city', 'City')}</div>
                                        <div className="text-gray-800">{(user as any)?.addressInformation?.city || t('admin.users.unknown', 'Unknown')}</div>
                                    </div>
                                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 sm:col-span-2">
                                        <div className="text-xs uppercase text-gray-500">{t('admin.users.details.address', 'Address')}</div>
                                        <div className="text-gray-800">{(user as any)?.addressInformation?.address || t('admin.users.unknown', 'Unknown')}</div>
                                    </div>
                                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                                        <div className="text-xs uppercase text-gray-500">{t('admin.users.details.zipCode', 'Zip-code')}</div>
                                        <div className="text-gray-800">{(user as any)?.addressInformation?.zipCode || t('admin.users.unknown', 'Unknown')}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-2 pt-3 border-t border-gray-200 flex flex-wrap gap-2">
                                <button
                                    onClick={() => navigate(computeEditUrl())}
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                >
                                    ✏️ {t('admin.users.actions.edit', 'Edit User')}
                                </button>
                            </div>
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