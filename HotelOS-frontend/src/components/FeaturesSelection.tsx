import { faChartLine, faSmile, faCogs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FeaturesSection() {
    const features = [
        {
            icon: <FontAwesomeIcon icon={faChartLine} size="2xl" className="text-black p-2" />,
            title: "Revenue Growth",
            description: "Maximize your hotel's revenue with real-time analytics and automated pricing strategies.",
        },
        {
            icon: <FontAwesomeIcon icon={faCogs} size="2xl" className="text-black p-2" />,
            title: "Operational Optimization",
            description: "Streamline your operations and improve efficiency with our all-in-one management tools.",
        },
        {
            icon: <FontAwesomeIcon icon={faSmile} size="2xl" className="text-black p-2" />,
            title: "Enhanced Guest Experience",
            description: "Deliver exceptional guest experiences with seamless check-ins and personalized services.",
        },
    ];

    return (
        <div className="w-full bg-gray-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-12">
                    Why Choose HotelOS?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-4">
                            {feature.icon}
                            <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}