// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "./contexts/UserContext";
import { UserType } from "./interfaces/User";

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
        if (user.userType === UserType.MANAGER) {
            return <Navigate to={`/manager/hotel/${user.hotel?.id}/overview`} replace />;
        } else if (user.userType === UserType.STAFF) {
            return <Navigate to={`/staff/${user.hotel?.id}/reservations`} replace />;
        } else {
            return <Navigate to="/notfound" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;