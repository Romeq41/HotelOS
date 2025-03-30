import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Homepage from "./pages/Homepage";
import Userpage from "./pages/Userpage";
import Admin_Hotel_overview from "./pages/Adminpage_hotel_overview";
import Admin_user_overview from "./pages/Adminpage_user_overview";
import Login from "./pages/Login";
import Hotels from "./pages/Adminpage_hotels";
import Users from "./pages/Adminpage_users";
import AddHotel from "./pages/AddHotel";
import AddUser from "./pages/AddUser";
import Admin_User_Edit from "./pages/Adminpage_user_edit";
import Admin_Hotel_Edit from "./pages/Adminpage_hotel_edit";
import HotelPage from "./pages/Hotelpage";
import AddRoom from "./pages/AddRoom";
import Admin_Hotel_Rooms from "./pages/Adminpage_hotel_rooms";
import Admin_Hotel_Room_details from "./pages/Adminpage_hotel_room_details";
import Admin_Hotel_Room_Details_Edit from "./pages/Adminpage_hotel_room_details_edit";




const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/hotels/:id" element={<HotelPage />} />
                    <Route path="/user" element={<Userpage />} />
                    <Route path="/admin/hotels" element={<Hotels />} />
                    <Route path="/admin/hotels/add" element={<AddHotel />} />
                    <Route path="/admin/hotels/:id" element={<Admin_Hotel_overview />} />
                    <Route path="/admin/hotels/:id/edit" element={<Admin_Hotel_Edit />} />
                    <Route path="/admin/hotels/:id/rooms" element={<Admin_Hotel_Rooms />} />
                    <Route path="/admin/hotels/:id/rooms/add" element={<AddRoom />} />
                    <Route path="/admin/hotels/:id/rooms/:id" element={<Admin_Hotel_Room_details />} />
                    <Route path="/admin/hotels/:hotelId/rooms/:roomId/edit" element={<Admin_Hotel_Room_Details_Edit />} />
                    <Route path="/admin/users" element={<Users />} />
                    <Route path="/admin/users/add" element={<AddUser />} />
                    <Route path="/admin/users/:id" element={<Admin_user_overview />} />
                    <Route path="/admin/users/:id/edit" element={<Admin_User_Edit />} />
                    <Route path="*" element={<h1>Not Found</h1>} />
                </Routes>
            </Router>
        </UserProvider>
    );
};



export default App;
