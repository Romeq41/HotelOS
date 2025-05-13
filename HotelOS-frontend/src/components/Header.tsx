import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faTimes, faHotel, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../contexts/UserContext.tsx";
import { UserType } from "../interfaces/User.tsx";
import { useTranslation } from "react-i18next";

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
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

    const { t, i18n } = useTranslation();

    const userMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const userButtonRef = useRef<HTMLButtonElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const languageMenuRef = useRef<HTMLDivElement>(null);
    const languageButtonRef = useRef<HTMLButtonElement>(null);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'pl', name: 'Polski' },
    ];

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

            if (
                isLanguageMenuOpen &&
                languageMenuRef.current &&
                !languageMenuRef.current.contains(event.target as Node) &&
                languageButtonRef.current &&
                !languageButtonRef.current.contains(event.target as Node)
            ) {
                setIsLanguageMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen, isUserMenuOpen, isLanguageMenuOpen]); ``

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

    const toggleLanguageMenu = () => {
        setIsLanguageMenuOpen(!isLanguageMenuOpen);
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsLanguageMenuOpen(false);
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
                                {t("header.adminDashboard")}
                            </button>
                        </li>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigateAndCloseMenus("/admin/hotels")} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                {t("header.hotels")}
                            </button>
                        </li>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigateAndCloseMenus("/admin/users")} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                {t("header.users")}
                            </button>
                        </li>
                    </>
                );
            case UserType.MANAGER:
                return (
                    <>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigateAndCloseMenus(`/manager/hotel/${user.hotel?.id}/overview`)} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                {t("hotel.overview", "Hotel Overview")}
                            </button>
                        </li>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigateAndCloseMenus(`/manager/hotel/${user.hotel?.id}/staff`)} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                {t("hotel.staff", "Staff")}
                            </button>
                        </li>
                        <li className="py-4 border-b border-gray-300">
                            <button onClick={() => navigateAndCloseMenus(`/manager/hotel/${user.hotel?.id}/rooms`)} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                {t("hotel.rooms")}
                            </button>
                        </li>
                    </>
                );
            case UserType.STAFF:
                return (
                    <li className="py-4 border-b border-gray-300">
                        <button onClick={() => navigateAndCloseMenus(`/hotels/${user.hotel?.id}/rooms`)} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                            {t("hotel.roomOccupancy", "Room Occupancy")}
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
                                    {isAuth ? t("header.profile") : t("auth.login")}
                                </button>
                            </li>
                            {isAuth && renderMenuItems()}

                            {/* Language selector in mobile menu */}
                            <li className="py-4 border-b border-gray-300">
                                <p className="text-lg font-medium mb-2">{t("header.language")}</p>
                                <div className="flex flex-col gap-2">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`text-left px-2 py-1 rounded ${i18n.language === lang.code ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            </li>

                            {isAuth && (
                                <li className="py-4 border-b border-gray-300">
                                    <button onClick={handleLogout} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                        {t("auth.logout")}
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            ) : (
                // Desktop layout
                <section className="flex space-x-4 p-4">
                    {/* Language selector */}
                    <div className="relative">
                        <button
                            ref={languageButtonRef}
                            onClick={toggleLanguageMenu}
                            className={`flex gap-2 items-center border text-${textColor} border-${textColor} hover:bg-${onHover} px-4 py-2 rounded-lg ease-in-out duration-200 cursor-pointer`}
                        >
                            <FontAwesomeIcon icon={faGlobe} size="lg" />
                            <p>{i18n.language.toUpperCase()}</p>
                        </button>

                        <div
                            ref={languageMenuRef}
                            className={`absolute top-14 left-0 bg-white text-black shadow-lg rounded-lg overflow-hidden transition-opacity duration-300 ${isLanguageMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                            <div className="p-2">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        className={`block w-full text-left px-4 py-2 rounded ${i18n.language === lang.code ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* User menu */}
                    <div className="relative">
                        <button
                            ref={userButtonRef}
                            onClick={handleUserClick}
                            className={`flex gap-2 items-center border text-${textColor} border-${textColor} hover:bg-${onHover} px-4 py-2 rounded-lg ease-in-out duration-200 cursor-pointer`}
                        >
                            <FontAwesomeIcon icon={faUser} size="lg" />
                            <p>{isAuth ? `${user?.firstName} ${user?.lastName}` : t("auth.login")}</p>
                        </button>

                        {isAuth && (
                            <div
                                ref={userMenuRef}
                                className={`fixed top-20 right-0 bg-white text-black h-full w-64 z-20 shadow-lg transition-transform duration-500 ease-in-out transform ${isUserMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                            >
                                <ul className="text-left p-6">
                                    <li className="py-4 border-b border-gray-300">
                                        <button onClick={handleProfileClick} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                            {t("header.profile")}
                                        </button>
                                    </li>
                                    {renderMenuItems()}
                                    <li className="py-4 border-b border-gray-300">
                                        <button onClick={handleLogout} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                                            {t("auth.logout")}
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