//// filepath: e:\Projekty\HotelOS\HotelOS-frontend\src\components\Header.tsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faTimes, faHotel } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../contexts/UserContext.tsx";
import { UserType } from "../interfaces/User.tsx";

interface HeaderProps {
    bg_color?: string;
    toColor?: string;
    title?: string;
    showLogo?: boolean;
    fixedHeight?: string;
    textColor?: string;
    onHover?: string;
    isGradient?: boolean; // New prop to toggle gradient
}

export default function Header({
    bg_color = "slate-900",
    title = "HotelOS",
    showLogo = true,
    fixedHeight = "h-20",
    textColor = "white",
    onHover = "opacity-60",
    isGradient = true,
}: HeaderProps) {
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
        navigate("/user");
        setIsUserMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const renderMenuItems = () => {
        if (!user) return null;
        switch (user.userType) {
            case UserType.ADMIN:
                return (
                    <>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigate("/admin/hotels")} className="block w-full text-left text-lg hover:bg-gray-100">
                                Adminpage
                            </button>
                        </li>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigate("/admin/hotels")} className="block w-full text-left text-lg hover:bg-gray-100">
                                Hotels
                            </button>
                        </li>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigate("/admin/users")} className="block w-full text-left text-lg hover:bg-gray-100">
                                Users
                            </button>
                        </li>
                    </>
                );
            case UserType.MANAGER:
                return (
                    <>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigate(`/hotels/${user.hotel.id}/overview`)} className="block w-full text-left text-lg hover:bg-gray-100">
                                Hotel Overview
                            </button>
                        </li>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigate(`/hotels/${user.hotel.id}/staff`)} className="block w-full text-left text-lg hover:bg-gray-100">
                                Staff
                            </button>
                        </li>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigate(`/hotels/${user.hotel.id}/rooms`)} className="block w-full text-left text-lg hover:bg-gray-100">
                                Rooms
                            </button>
                        </li>
                    </>
                );
            case UserType.STAFF:
                return (
                    <li className="py-4 border-b border-gray-300">
                        <button onClick={() => navigate(`/hotels/${user.hotel.id}/rooms`)} className="block w-full text-left text-lg hover:bg-gray-100">
                            Room Occupancy
                        </button>
                    </li>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={`header ${isGradient
                ? `bg-gradient-to-r from-slate-600 to-slate-800`
                : `bg-${bg_color}`
                } shadow-lg ${fixedHeight} w-full fixed top-0 flex items-center justify-between sm:px-6 z-50 transition-transform duration-200`}
        >
            {showLogo && (
                <a href="/" className="flex items-center">
                    <div className="logo text-4xl font-bold cursor-pointer flex items-center p-2" style={{ color: textColor }}>
                        <FontAwesomeIcon icon={faHotel} size="xs" className="mr-1" />
                        {title}
                    </div>
                </a>
            )}

            {currentWidth < 640 ? (
                // Mobile menu
                <div className="relative">
                    <button className="mr-4" onClick={toggleMenu} style={{ color: textColor }}>
                        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="2xl" />
                    </button>
                    <div
                        className={`fixed top-0 left-0 bg-white text-black h-full w-64 shadow-lg transition-transform duration-500 ease-in-out transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                            }`}
                    >
                        <a href="/" className="flex items-center p-5">
                            <div className="logo text-4xl font-bold cursor-pointer flex items-center">
                                <FontAwesomeIcon icon={faHotel} size="xs" className="text-black p-2" />
                                <p className="text-black">{title}</p>
                            </div>
                        </a>
                        <ul className="text-left p-6">
                            <li className="py-4 border-b border-gray-300">
                                <button onClick={handleProfileClick} className="block w-full text-left text-lg hover:bg-gray-100">
                                    {isAuth ? "Profile" : "Login"}
                                </button>
                            </li>
                            {isAuth && renderMenuItems()}
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
                // Desktop layout
                <section className="flex space-x-4 p-4">
                    <div className="relative">
                        <button
                            onClick={handleUserClick}
                            className={`hover:${onHover} flex gap-2 items-center border text-${textColor} border-${textColor} px-4 py-2 rounded-lg ease-in-out duration-200`}
                        >
                            <FontAwesomeIcon icon={faUser} size="lg" />
                            <p>{isAuth ? `${user?.firstName} ${user?.lastName}` : "Login"}</p>
                        </button>

                        {isAuth && (
                            <div
                                className={`fixed top-20 right-0 bg-white text-black h-full w-64 z-20 shadow-lg transition-transform duration-500 ease-in-out transform ${isUserMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                            >
                                <ul className="text-left p-6">
                                    <li className="py-4 border-b border-gray-300">
                                        <button onClick={handleProfileClick} className="block w-full text-left text-lg hover:bg-gray-100">
                                            Profile
                                        </button>
                                    </li>
                                    {renderMenuItems()}
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