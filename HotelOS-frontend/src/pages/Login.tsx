import Header from "../components/Header"
import Footer from "../components/Footer";
import LoginView from "../components/LoginView";

export default function Homepage() {
    return (
        <div className="homepage bg-gray-200 scroll-smooth h-screen relative">
            <Header />
            <LoginView />
            <Footer />
        </div>
    );
}
