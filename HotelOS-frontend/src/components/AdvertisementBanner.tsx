import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import Hotel1 from "../assets/hotel1.webp";
import Hotel2 from "../assets/hotel2.webp";
import Hotel3 from "../assets/hotel3.webp";
import Hotel4 from "../assets/hotel4.webp";



export default function AdvertisementBanner() {
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

    const advertisements = [
        {
            image: Hotel1,
            title: "🏨 HotelOS – The Future of Hotel Management!",
            description: "Streamline operations, boost efficiency, and deliver exceptional guest experiences—all in one powerful system!"
        },
        {
            image: Hotel2,
            title: "📊 Simplify, Automate, and Grow with HotelOS!",
            description: "From booking to billing, manage every aspect of your hotel with ease. Elevate your business today!"
        },
        {
            image: Hotel4,
            title: "🔑 Seamless Check-ins, Happier Guests!",
            description: "Reduce wait times, enhance guest satisfaction, and improve efficiency with our smart front desk management."
        },
        {
            image: Hotel3,
            title: "💼 Optimize Your Hotel’s Revenue!",
            description: "Get real-time analytics, automated pricing, and revenue insights to maximize your earnings effortlessly!"
        }
    ];


    return (
        <div className='w-full'>
            <Slider {...settings} className="advertisement_banner  mt-20">
                {advertisements.map((ad, index) => (
                    <div key={index} className="relative">
                        <div
                            style={{
                                backgroundImage: `url(${ad.image})`,
                                width: "100%",
                                objectFit: 'scale-down',

                            }}
                            className="relative h-[calc(100vh-5rem)] bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-in-out"
                        >

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70 bg-black"></div>
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center space-y-4 md:space-y-6 p-8">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg">
                                    {ad.title}
                                </h2>
                                <p className="sm:text-lg md:text-xl lg:text-2xl text-white drop-shadow-md">
                                    {ad.description}
                                </p>
                                <button
                                    onClick={scrollToMenu}
                                    className="mt-2 md:mt-4 px-6 md:px-8 py-2 md:py-3 bg-amber-700 text-white font-bold text-sm md:text-base lg:text-lg rounded-full hover:bg-amber-600 transition-transform transform hover:scale-105 shadow-lg"
                                >
                                    Explore Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
