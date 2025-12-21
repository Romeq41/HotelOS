import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faTimes, faHotel, faGlobe, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../contexts/UserContext.tsx";
import { UserType } from "../interfaces/User.tsx";
import { useTranslation } from "react-i18next";
import { Input } from "antd";

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
    }, [isMenuOpen, isUserMenuOpen, isLanguageMenuOpen]);

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
                        <button onClick={() => navigateAndCloseMenus(`/staff/${user.hotel?.id}/reservations`)} className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer">
                            {t("hotel.reservations", "Reservations")}
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
                <a href="/" className="flex items-center group">
                    <div className="logo text-4xl font-bold cursor-pointer flex items-center p-2 transition-all duration-300 hover:scale-105 group-hover:text-opacity-80" style={{ color: textColor }}>
                        <FontAwesomeIcon
                            icon={faHotel}
                            size="xs"
                            className="mr-1 transition-transform duration-300 group-hover:rotate-12"
                        />
                        {title}
                    </div>
                </a>
            )}

            {currentWidth < 640 ? (
                // Mobile menu
                <div className="relative">
                    <button
                        ref={menuButtonRef}
                        className="mr-4 transition-all duration-300 hover:scale-110 hover:rotate-3"
                        onClick={toggleMenu}
                        style={{ color: textColor }}
                    >
                        <FontAwesomeIcon
                            icon={isMenuOpen ? faTimes : faBars}
                            size="2xl"
                            className="transition-transform duration-300"
                        />
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
                                <button
                                    onClick={handleProfileClick}
                                    className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-105 hover:pl-2 rounded px-2 py-1"
                                >
                                    {isAuth ? t("header.profile") : t("auth.login")}
                                </button>
                            </li>
                            <li className="py-4 border-b border-gray-300">
                                <button
                                    onClick={() => navigateAndCloseMenus("/explore")}
                                    className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-105 hover:pl-2 rounded px-2 py-1"
                                >
                                    {t("header.otherHotels", "Explore Other Hotels")}
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
                                            className={`text-left px-2 py-1 rounded transition-all duration-200 hover:scale-105 hover:pl-4 ${i18n.language === lang.code
                                                ? 'bg-blue-100 text-blue-700 shadow-sm'
                                                : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            </li>

                            {isAuth && (
                                <li className="py-4 border-b border-gray-300">
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left text-lg hover:bg-red-100 hover:text-red-600 cursor-pointer transition-all duration-200 hover:scale-105 hover:pl-2 rounded px-2 py-1"
                                    >
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
                    <button
                        onClick={() => navigateAndCloseMenus("/explore")}
                        className={`flex gap-2 items-center border text-${textColor} border-${textColor} hover:bg-${onHover} hover:scale-105 hover:shadow-lg px-4 py-2 rounded-lg ease-in-out duration-300 cursor-pointer transition-all transform hover:border-opacity-80 backdrop-blur-sm`}
                    >
                        {t("header.otherHotels", "Explore Other Hotels")}
                    </button>
                    {/* Language selector */}
                    <div className="relative">
                        <button
                            ref={languageButtonRef}
                            onClick={toggleLanguageMenu}
                            className={`flex gap-2 items-center border text-${textColor} border-${textColor} hover:bg-${onHover} hover:scale-105 hover:shadow-lg px-4 py-2 rounded-lg ease-in-out duration-300 cursor-pointer transition-all transform hover:border-opacity-80 backdrop-blur-sm`}
                        >
                            <FontAwesomeIcon icon={faGlobe} size="lg" className="transition-transform duration-300 hover:rotate-12" />
                            <p className="transition-all duration-300">{i18n.language.toUpperCase()}</p>
                            <FontAwesomeIcon
                                icon={isLanguageMenuOpen ? faChevronUp : faChevronDown}
                                size="sm"
                                className="transition-transform duration-300 ml-1"
                            />
                        </button>

                        <div
                            ref={languageMenuRef}
                            className={`absolute top-14 left-0 bg-white text-black shadow-xl rounded-lg overflow-hidden transition-all duration-300 transform ${isLanguageMenuOpen
                                ? 'opacity-100 scale-100 translate-y-0'
                                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                } backdrop-blur-md border border-gray-200`}
                        >
                            <div className="p-2">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        className={`block w-full text-left px-4 py-2 rounded transition-all duration-200 hover:scale-105 ${i18n.language === lang.code
                                            ? 'bg-blue-100 text-blue-700 shadow-sm'
                                            : 'hover:bg-gray-100 hover:shadow-sm'
                                            }`}
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
                            className={`flex gap-2 items-center border text-${textColor} border-${textColor} hover:bg-${onHover} hover:scale-105 hover:shadow-lg px-4 py-2 rounded-lg ease-in-out duration-300 cursor-pointer transition-all transform hover:border-opacity-80 backdrop-blur-sm group`}
                        >
                            <FontAwesomeIcon
                                icon={faUser}
                                size="lg"
                                className="transition-transform duration-300 group-hover:scale-110"
                            />
                            <p className="transition-all duration-300">{isAuth ? `${user?.firstName} ${user?.lastName}` : t("auth.login")}</p>
                            {isAuth && (
                                <FontAwesomeIcon
                                    icon={isUserMenuOpen ? faChevronUp : faChevronDown}
                                    size="sm"
                                    className="transition-transform duration-300 ml-1"
                                />
                            )}
                        </button>

                        {isAuth && (
                            <div
                                ref={userMenuRef}
                                className={`fixed top-20 right-0 bg-white text-black h-full w-64 z-20 shadow-2xl transition-all duration-500 ease-in-out transform ${isUserMenuOpen
                                    ? "translate-x-0 opacity-100"
                                    : "translate-x-full opacity-0"
                                    } backdrop-blur-md border-l border-gray-200`}
                            >
                                <ul className="text-left p-6">
                                    <li className="py-4 border-b border-gray-300">
                                        <button
                                            onClick={handleProfileClick}
                                            className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-105 hover:pl-2 rounded px-2 py-1"
                                        >
                                            {t("header.profile")}
                                        </button>
                                    </li>
                                    {renderMenuItems()}
                                    <li className="py-4 border-b border-gray-300">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left text-lg hover:bg-red-100 hover:text-red-600 cursor-pointer transition-all duration-200 hover:scale-105 hover:pl-2 rounded px-2 py-1"
                                        >
                                            {t("auth.logout")}
                                        </button>
                                    </li>
                                    {/* todo hotel operations section */}
                                    <h1 className="m-3 text-lg text-center font-bold transition-all duration-300 hover:scale-105">{t("header.clientOperationsHeaderSectionTitle", "Client Operations")}</h1>
                                    <li className="py-4 border-b border-gray-300">
                                        <button
                                            onClick={() => navigateAndCloseMenus("/explore")}
                                            className="block w-full text-left text-lg hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-105 hover:pl-2 rounded px-2 py-1"
                                        >
                                            {t("header.otherHotels", "Explore Other Hotels")}
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