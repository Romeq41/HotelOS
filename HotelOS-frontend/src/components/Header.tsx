import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
    isGradient?: boolean;
}

export default function Header({
    bg_color = "slate-900",
    title = "HotelOS",
    showLogo = true,
    fixedHeight = "h-20",
    textColor = "white",
    onHover = "gray-700",
    isGradient = true,
}: HeaderProps) {
    const navigate = useNavigate();
    const { isAuth, user, logout } = useUser();
    const [currentWidth, setCurrentWidth] = useState(window.innerWidth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const userMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const userButtonRef = useRef<HTMLButtonElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleResize = () => setCurrentWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        const handleClickOutside = (event: MouseEvent) => {
            if (
                isMenuOpen &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }

            if (
                isUserMenuOpen &&
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node) &&
                userButtonRef.current &&
                !userButtonRef.current.contains(event.target as Node)
            ) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen, isUserMenuOpen]);

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
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navigateAndCloseMenus = (path: string) => {
        navigate(path);
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    const renderMenuItems = () => {
        if (!user) return null;
        switch (user.userType) {
            case UserType.ADMIN:
                return (
                    <>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigateAndCloseMenus("/admin/hotels")} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                Adminpage
                            </button>
                        </li>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigateAndCloseMenus("/admin/hotels")} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                Hotels
                            </button>
                        </li>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigateAndCloseMenus("/admin/users")} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                Users
                            </button>
                        </li>
                    </>
                );
            case UserType.MANAGER:
                return (
                    <>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigateAndCloseMenus(`/hotels/${user.hotel.id}/overview`)} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                Hotel Overview
                            </button>
                        </li>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigateAndCloseMenus(`/hotels/${user.hotel.id}/staff`)} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                Staff
                            </button>
                        </li>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigateAndCloseMenus(`/hotels/${user.hotel.id}/rooms`)} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                Rooms
                            </button>
                        </li>
                    </>
                );
            case UserType.STAFF:
                return (
                    <li className="py-4 border-b border-gray-300">
                        <button onClick={() => navigateAndCloseMenus(`/hotels/${user.hotel.id}/rooms`)} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                            Room Occupancy
                        </button>
                    </li>
                );
            default:
                return null;
        }
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
        navigate("/login");
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
                    <button
                        ref={menuButtonRef}
                        className="mr-4"
                        onClick={toggleMenu}
                        style={{ color: textColor }}
                    >
                        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="2xl" />
                    </button>
                    <div
                        ref={mobileMenuRef}
                        className={`fixed top-0 left-0 bg-white text-black h-full w-64 shadow-lg cursor-pointer transition-transform duration-500 ease-in-out transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
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
                                <button onClick={handleProfileClick} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                    {isAuth ? "Profile" : "Login"}
                                </button>
                            </li>
                            {isAuth && renderMenuItems()}
                            {isAuth && (
                                <li className="py-4 border-b border-gray-300">
                                    <button onClick={handleLogout} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
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
                            ref={userButtonRef}
                            onClick={handleUserClick}
                            className={`flex gap-2 items-center border text-${textColor} border-${textColor} hover:bg-${onHover} px-4 py-2 rounded-lg ease-in-out duration-200 cursor-pointer`}
                        >
                            <FontAwesomeIcon icon={faUser} size="lg" />
                            <p>{isAuth ? `${user?.firstName} ${user?.lastName}` : "Login"}</p>
                        </button>

                        {isAuth && (
                            <div
                                ref={userMenuRef}
                                className={`fixed top-20 right-0 bg-white text-black h-full w-64 z-20 shadow-lg transition-transform duration-500 ease-in-out transform ${isUserMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                            >
                                <ul className="text-left p-6">
                                    <li className="py-4 border-b border-gray-300">
                                        <button onClick={handleProfileClick} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                            Profile
                                        </button>
                                    </li>
                                    {renderMenuItems()}
                                    <li className="py-4 border-b border-gray-300">
                                        <button onClick={handleLogout} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
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