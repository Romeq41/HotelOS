import Header from "../components/Header"
import Footer from "../components/Footer";
import AdvertisementBanner from "../components/AdvertisementBanner";
import FeaturesSelection from "../components/FeaturesSelection";
import PricingOptions from "../components/PricingOptions";

export default function Homepage() {
    return (
        <div className="homepage bg-gray-200 scroll-smooth h-screen relative">
            <Header />
            <AdvertisementBanner />
            <FeaturesSelection />
            <PricingOptions />
            <Footer />
        </div>
    );
}
