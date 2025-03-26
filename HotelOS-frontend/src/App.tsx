import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Homepage from "./pages/Homepage";
import Userpage from "./pages/Userpage";
import Hotel_overview from "./pages/Hotel_overview";
import Login from "./pages/Login";
import Hotels from "./pages/Adminpage_hotels";
import Users from "./pages/Adminpage_users";
import AddHotel from "./pages/AddHotel";
import AddUser from "./pages/AddUser";




const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/hotel/:id/overview" element={<Hotel_overview />} />
                    <Route path="/user" element={<Userpage />} />
                    <Route path="/admin/hotels" element={<Hotels />} />
                    <Route path="/admin/hotels/add" element={<AddHotel />} />
                    <Route path="/admin/users" element={<Users />} />
                    <Route path="/admin/users/add" element={<AddUser />} />
                    <Route path="*" element={<h1>Not Found</h1>} />
                </Routes>
            </Router>
        </UserProvider>
    );
};



export default App;
