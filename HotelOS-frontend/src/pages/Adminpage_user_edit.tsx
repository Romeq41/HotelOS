import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminHeader from "../components/Adminpage/AdminHeader";
import { User } from "../interfaces/User";
import { Hotel } from "../interfaces/Hotel";

export default function Admin_User_Edit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<(User & { hotel: { id: number } | null }) | null>(null);
    const [hotels, setHotels] = useState<Hotel[] | null>(null); // Adjust the type as per your data structure

    useEffect(() => {
        console.log(id);
        console.log(`Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`);
        const fetchHotelsData = async () => {

            try {
                const response = await fetch('http://localhost:8080/api/hotels', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                if (response.status === 401) {
                    console.log('Unauthorized access. Redirecting to login page...');
                    window.location.href = '/login';
                }
                if (response.status === 403) {
                    console.log('Forbidden access. Redirecting to login page...');
                    window.location.href = '/login';
                }


                if (response.status === 200) {
                    console.log('Hotels data fetched successfully:', response);
                }

                const data = await response.json();
                console.log('Hotels data:', data);

                setHotels(data);

            } catch (error) {
                console.error('Error fetching hotels data:', error);
            }

        }



        const fetchUser = async () => {
            if (id) {
                const res = await fetch(`http://localhost:8080/api/users/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });
                const data: User = await res.json();
                setUser(data);
                const {
                    firstName,
                    lastName,
                    email,
                    phone,
                    address,
                    city,
                    state,
                    zipCode,
                    country,
                    position,
                    userType
                } = data;
                setFormData({
                    userId: data.userId || "",
                    password: data.password || "",
                    hotel: data.hotel && data.hotel.id ? { id: data.hotel.id } : null, // Updated line
                    firstName,
                    lastName,
                    email,
                    phone,
                    address,
                    city,
                    state,
                    zipCode,
                    country,
                    position,
                    userType,
                });

                console.log(data);
            }
        };

        fetchHotelsData();
        fetchUser();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "hotel") {
            setFormData((prev: any) => (prev ? { ...prev, hotel: { id: parseInt(value) } } : null));
        } else {
            setFormData((prev: any) => (prev ? { ...prev, [name]: value } : null));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        if (id && formData) {
            console.log('Form submitted:', formData);
            await fetch(`http://localhost:8080/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                },
                body: JSON.stringify(formData),
            });

            window.location.reload();

            const submitButton = document.getElementById('submitButton') as HTMLButtonElement;
            if (submitButton) {
                submitButton.classList.remove('bg-blue-600');
                submitButton.classList.add('bg-green-600', 'transition', 'duration-300', 'ease-in-out');
                submitButton.innerText = 'Success!';

                setTimeout(() => {
                    submitButton.classList.remove('bg-green-600');
                    submitButton.classList.add('bg-blue-600');
                    submitButton.innerText = 'Edit User';
                    navigate("/admin/users");
                }, 2000);
            }

        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <AdminHeader />
            <div className="container mx-auto py-8 px-4">
                {formData ? (
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                        <h1 className="text-2xl font-bold mb-4">Edit User id: {id}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">UserType</label>
                                <select
                                    name="userType"
                                    value={formData.userType || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="GUEST">User</option>
                                    <option value="STAFF">Staff</option>
                                    <option value="MANAGER">Manager</option>
                                    {/* <option value="ADMIN">ADMIN</option> */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Hotel</label>
                                <select
                                    name="hotel"
                                    value={formData.hotel?.id || ""} // Use optional chaining to avoid errors
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    {/* Current hotel as the first option */}
                                    <option value={user?.hotel?.id || ""}>
                                        Current hotel: {user?.hotel ? `id: ${user.hotel.id}, ${user.hotel.name}` : "NONE"}
                                    </option>

                                    {/* List all hotels */}
                                    {hotels && hotels.length > 0 ? (
                                        hotels.map((hotel: Hotel) => (
                                            <option key={hotel.id} value={hotel.id}>
                                                {hotel.id + ": " + hotel.name + ", " + hotel.city + ", " + hotel.state}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            No hotels available
                                        </option>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Zip Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                id="submitButton"
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-center text-gray-500">Loading User information...</p>
                )}
            </div>
        </div>
    );
}