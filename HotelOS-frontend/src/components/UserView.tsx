import { useEffect } from "react";
import { useUser } from "../contexts/UserContext.tsx";
import { useNavigate } from "react-router-dom";

export default function UserView() {
    const navigate = useNavigate();
    const { user, isAuth } = useUser();

    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
    }, [isAuth, navigate]);

    return (
        <div className="flex flex-col sm:flex-row h-screen bg-gray-100 mt-20">
            {/* Left Section: Hotel data */}
            <div className="sm:w-1/2 w-full bg-white shadow-lg p-8 text-center sm:text-left">
                <h2 className="text-2xl font-bold mb-6">Hotel Information</h2>
                <ul className="space-y-4">
                    <li>
                        <strong>Hotel Name:</strong> Grand Hotel
                    </li>
                    <li>
                        <strong>Location:</strong> 123 Main Street, Cityville
                    </li>
                    <li>
                        <strong>Check-in Time:</strong> 3:00 PM
                    </li>
                    <li>
                        <strong>Check-out Time:</strong> 11:00 AM
                    </li>
                    <li>
                        <strong>Contact:</strong> +1 234 567 890
                    </li>
                </ul>
            </div>

            {/* Right Section: User data */}
            <div className="sm:w-1/2 w-full bg-gray-50 shadow-lg p-8 flex flex-col items-center">
                <img
                    src={`http://localhost:8080/api/users/${user?.userId}/image` || "https://via.placeholder.com/160"}
                    alt="User"
                    className="w-32 h-32 rounded-full mb-6 shadow-md"
                />
                <h2 className="text-2xl font-bold mb-4">
                    {user?.firstName} {user?.lastName}
                </h2>
                <ul className="space-y-4 text-center">
                    <li>
                        <strong>Email:</strong> {user?.email}
                    </li>
                    <li>
                        <strong>Address:</strong> {user?.address || "Not provided"}
                    </li>
                    <li>
                        <strong>Phone:</strong> {user?.phone || "Not provided"}
                    </li>
                    <li>
                        <strong>Position:</strong> {user?.position || "Not provided"}
                    </li>
                </ul>
            </div>
        </div>
    );
}