import Header from "../components/Header"
import Footer from "../components/Footer";
import UserView from "../components/UserView";

export default function Userpage() {
    return (
        <div className="userpage bg-gray-200 scroll-smooth h-screen relative">
            <Header />
            <UserView />
            <Footer />
        </div>
    );
}
