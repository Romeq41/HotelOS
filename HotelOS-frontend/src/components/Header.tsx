import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser, faBars, faTimes, faHotel } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../contexts/UserContext.tsx";

export default function Header() {
    const navigate = useNavigate();
    const { isAuth, user, logout } = useUser();
    const [currentWidth, setCurrentWidth] = useState(window.innerWidth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setCurrentWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const handleUserClick = () => {
        if (isAuth) {
            setIsUserMenuOpen(!isUserMenuOpen);
        } else {
            navigate("/login");
        }
    };

    const handleProfileClick = () => {
        console.log("Profile clicked");
        navigate("/user");
        setIsUserMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="header bg-gradient-to-r from-slate-600 to-slate-800 shadow-lg h-20 w-full fixed top-0 flex items-center justify-between sm:px-6 z-50 transition-transform duration-200">
            {/* Logo */}
            <a href="/" className="flex items-center">
                <div className="logo text-4xl font-bold cursor-pointer flex items-center">
                    <FontAwesomeIcon icon={faHotel} size="xs" className="text-white p-2" />
                    <p className="text-white ">HotelOS</p>
                </div>
            </a>


            {/* Hamburger Menu for small screens */}
            {currentWidth < 640 ? (
                <div className="relative">
                    <button className="text-white hover:text-gray-200 mr-4" onClick={toggleMenu}>
                        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="2xl" />
                    </button>

                    <div
                        className={`fixed top-0 left-0 bg-white text-black h-full w-64 shadow-lg transition-transform duration-500 ease-in-out transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                            }`}
                    >
                        <a href="/" className="flex items-center p-5">
                            <div className="logo text-4xl font-bold cursor-pointer flex items-center">
                                <FontAwesomeIcon icon={faShoppingCart} size="xs" className="text-black p-2" />
                                <p className="text-black">Shoppy</p>
                            </div>
                        </a>
                        <ul className="text-left p-6">
                            <li className="py-4 border-b border-gray-300">
                                <button onClick={handleProfileClick} className="block w-full text-left text-lg hover:bg-gray-100">
                                    {isAuth ? "Profile" : "Login"}
                                </button>
                            </li>
                            {isAuth && (
                                <li className="py-4 border-b border-gray-300">
                                    <button onClick={logout} className="block w-full text-left text-lg hover:bg-gray-100">
                                        Logout
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            ) : (
                // Navigation buttons for larger screens
                <section className="flex space-x-4 p-4 ">
                    <div className="relative">
                        <button
                            onClick={handleUserClick}
                            className="text-white hover:text-gray-300 flex gap-2 items-center border border-white px-4 py-2 rounded-lg"
                        >
                            <FontAwesomeIcon icon={faUser} size="lg" />
                            <p>{isAuth ? `${user?.firstName} ${user?.lastName}` : "Login"}</p>
                        </button>

                        {isAuth && (
                            <div
                                className={`fixed top-20 right-0 bg-white text-black h-full w-64 z-20  shadow-lg transition-transform duration-500 ease-in-out transform ${isUserMenuOpen ? "translate-x-0" : "translate-x-full"
                                    }`}
                            >
                                <ul className="text-left p-6">
                                    <li className="py-4 border-b border-gray-300">
                                        <button onClick={handleProfileClick} className="block w-full text-left text-lg hover:bg-gray-100">
                                            Profile
                                        </button>
                                    </li>
                                    <li className="py-4 border-b border-gray-300">
                                        <button onClick={logout} className="block w-full text-left text-lg hover:bg-gray-100">
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                </section>
            )}
        </div>
    );
}
