import AdvertisementBanner from "../components/AdvertisementBanner";
import FeaturesSelection from "../components/FeaturesSelection";
import PricingOptions from "../components/PricingOptions";

export default function Homepage() {
    return (
        <div className="homepage bg-gray-200 scroll-smooth min-h-screen relative">
            <AdvertisementBanner />
            <FeaturesSelection />
            <PricingOptions />
        </div>
    );
}
