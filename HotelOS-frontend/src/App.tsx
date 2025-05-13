import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { LoadingProvider } from "./contexts/LoaderContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Page imports
import Homepage from "./pages/Homepage";
import Userpage from "./pages/Userpage";
import Login from "./pages/Login";
import HotelPage from "./pages/Hotelpage";

// Admin pages
import Hotels from "./pages/admin/hotel/hotels";
import Users from "./pages/admin/user/Adminpage_users";
import AddHotel from "./pages/AddHotel";
import AddUser from "./pages/AddUser";
import Admin_User_Edit from "./pages/admin/user/Adminpage_user_edit";
import Admin_user_overview from "./pages/admin/user/Adminpage_user_overview";
import Admin_Hotel_Edit from "./pages/admin/hotel/edit";
import Admin_Hotel_overview from "./pages/admin/hotel/overview";
import Admin_Hotel_Rooms from "./pages/admin/hotel/rooms";
import Admin_Hotel_Users from "./pages/admin/hotel/users";
import Admin_Hotel_Room_details from "./pages/admin/hotel/room_details";
import Admin_Hotel_Room_Details_Edit from "./pages/admin/hotel/room_details_edit";
import Admin_Hotel_Room_Reservations from "./pages/admin/hotel/room_reservations";
import Admin_Hotel_Room_Reservation_Details from "./pages/admin/hotel/room_reservation_details";
import Adminpage_hotel_room_reservation_details_edit from "./pages/admin/hotel/room_reservation_details_edit";
import AddRoom from "./pages/AddRoom";
import AddReservation from "./pages/AddReservation";

const App = () => {
    return (
        <LoadingProvider>
            <UserProvider>
                <Router>
                    <div className="flex flex-col min-h-screen bg-gray-100">
                        <Header />
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<Homepage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/hotels/:id/overview" element={<HotelPage />} />
                            <Route path="/user" element={<Userpage />} />

                            {/* Admin hotel routes */}
                            <Route path="/admin/hotels" element={<Hotels />} />
                            <Route path="/admin/hotels/add" element={<AddHotel />} />
                            <Route path="/admin/hotels/:id" element={<Admin_Hotel_overview />} />
                            <Route path="/admin/hotels/:id/edit" element={<Admin_Hotel_Edit />} />

                            {/* Admin hotel rooms routes */}
                            <Route path="/admin/hotels/:hotelId/rooms" element={<Admin_Hotel_Rooms />} />
                            <Route path="/admin/hotels/:hotelId/rooms/add" element={<AddRoom />} />
                            <Route path="/admin/hotels/:hotelId/rooms/:roomId" element={<Admin_Hotel_Room_details />} />
                            <Route path="/admin/hotels/:hotelId/rooms/:roomId/edit" element={<Admin_Hotel_Room_Details_Edit />} />

                            {/* Admin hotel users routes */}
                            <Route path="/admin/hotels/:hotelId/users" element={<Admin_Hotel_Users />} />

                            {/* Admin hotel reservations routes */}
                            <Route path="/admin/hotels/:hotelId/reservations" element={<Admin_Hotel_Room_Reservations />} />
                            <Route path="/admin/hotels/:hotelId/reservations/add" element={<AddReservation />} />
                            <Route path="/admin/hotels/:hotelId/reservations/:reservationId" element={<Admin_Hotel_Room_Reservation_Details />} />
                            <Route path="/admin/hotels/:hotelId/reservations/:reservationId/edit" element={<Adminpage_hotel_room_reservation_details_edit />} />

                            {/* Admin user routes */}
                            <Route path="/admin/users" element={<Users />} />
                            <Route path="/admin/users/add" element={<AddUser />} />
                            <Route path="/admin/users/:id" element={<Admin_user_overview />} />
                            <Route path="/admin/users/:id/edit" element={<Admin_User_Edit />} />

                            {/* Manager */}
                            {/* <Route path="/manager/hotel/:id/overview" element={<HotelPage />} />
                            <Route path="/manager/hotel/:hotelId/rooms" element={<Admin_Hotel_Rooms />} />
                            <Route path="/manager/hotel/:hotelId/rooms/:roomId" element={<Admin_Hotel_Room_details />} />
                            <Route path="/manager/hotel/:hotelId/rooms/:roomId/edit" element={<Admin_Hotel_Room_Details_Edit />} />
                            <Route path="/manager/hotel/:id/edit" element={<Admin_Hotel_Edit />} /> */}

                            {/* 404 route */}
                            <Route path="*" element={<h1>Not Found</h1>} />

                        </Routes>
                    </div>
                    <Footer />

                </Router>
            </UserProvider>
        </LoadingProvider>
    );
};

export default App;