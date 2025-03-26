import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Homepage from "./pages/Homepage";
import Userpage from "./pages/Userpage";
import Hotel_overview from "./pages/Hotel_overview";
import Login from "./pages/Login";




const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/hotel/:id/overview" element={<Hotel_overview />} />
                    <Route path="/user" element={<Userpage />} />
                    <Route path="*" element={<h1>Not Found</h1>} />
                </Routes>
            </Router>
        </UserProvider>
    );
};



export default App;
