// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "./contexts/UserContext";
import { UserType } from "./interfaces/User";
import { getBaseUrl } from "./utils/routeUtils";

interface ProtectedRouteProps {
    allowedRoles: UserType[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuth, user, isAuthDone } = useUser();
    const location = useLocation();
    if (isAuthDone && !isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user && !allowedRoles.includes(user.userType)) {
        const base = getBaseUrl(user.userType, user.hotel?.id ?? '');
        const fallback = user.userType === UserType.MANAGER ? `${base}/overview` : `${base}/reservations`;
        return <Navigate to={fallback} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;