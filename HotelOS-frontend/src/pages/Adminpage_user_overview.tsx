import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminHeader from "../components/Adminpage/AdminHeader";
import { User } from "../interfaces/User";

export default function Admin_User_overview() {
    const { id } = useParams<{ id: string }>();
    console.log(id);
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            console.log(`Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`)
            if (id) {
                const res = await fetch(`http://localhost:8080/api/users/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });
                const data = await res.json();
                setUser(data);
                console.log(data);
            }
        };
        fetchUser();
    }, [id]);

    return (

        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <AdminHeader />
            {/* Title */}
            <div className="container mx-auto py-8 px-4">
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
                                <strong>ID:</strong> {user.userId || "Unknown"}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <strong>userType:</strong> {user.userType || "Unknown"}
                            </p>
                            <hr className="block my-3" />

                            <p className="text-gray-700 mb-2">
                                <strong>Hotel:</strong>{" "}
                                {user.hotel
                                    ? `${"(" + user.hotel.id + ") " + user.hotel.name + "  " + user.hotel.city}`
                                    : "Unknown"}
                            </p>


                            <p className="text-gray-700 mb-2">
                                <strong>Position:</strong> {user.position || "Unknown"}
                            </p>

                            <hr className="block my-3" />

                            <p className="text-gray-700 mb-2">
                                <strong>Email:</strong> {user.email || "Unknown"}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <strong>Phone:</strong> {user.phone || "Unknown"}
                            </p>
                            <hr className="block my-3" />


                            <p className="text-gray-700 mb-2">
                                <strong>Country:</strong> {user.country || "Unknown"}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <strong>State:</strong> {user.state || "Unknown"}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <strong>City:</strong> {user.city || "Unknown"}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <strong> Address:</strong> {user.address || "Unknown"}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <strong>Zip-code:</strong> {user.zipCode || "Unknown"}
                            </p>




                            <button
                                onClick={() => navigate(`/admin/users/${id}/edit`)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Edit User
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Loading User information...</p>
                )}
            </div>
        </div>
    );
}