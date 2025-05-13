import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import Hotel1 from "../assets/hotel1.webp";
import Hotel2 from "../assets/hotel2.webp";
import Hotel3 from "../assets/hotel3.webp";
import Hotel4 from "../assets/hotel4.webp";
import { useTranslation } from 'react-i18next';

export default function AdvertisementBanner() {
    const { t } = useTranslation();

    const scrollToMenu = () => {
        const productsSection = document.getElementById("menu");
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
    };

    const adImages = [Hotel1, Hotel2, Hotel4, Hotel3];

    return (
        <div className='w-full'>
            <Slider {...settings} className="advertisement_banner mt-20">
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="relative">
                        <div
                            style={{
                                backgroundImage: `url(${adImages[index]})`,
                                width: "100%",
                                objectFit: 'scale-down',
                            }}
                            className="relative h-[calc(100vh-5rem)] bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-in-out"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70 bg-black"></div>
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center space-y-4 md:space-y-6 p-8">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg">
                                    {t(`advertisements.${index}.title`)}
                                </h2>
                                <p className="sm:text-lg md:text-xl lg:text-2xl text-white drop-shadow-md">
                                    {t(`advertisements.${index}.description`)}
                                </p>
                                <button
                                    onClick={scrollToMenu}
                                    className="mt-2 md:mt-4 px-6 md:px-8 py-2 md:py-3 bg-amber-700 text-white font-bold text-sm md:text-base lg:text-lg rounded-full hover:bg-amber-600 transition-transform transform hover:scale-105 shadow-lg cursor-pointer"
                                >
                                    {t('general.exploreNow', 'Explore Now')}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}