export default function PricingOptions() {
    const pricingPlans = [
        {
            title: "Basic Plan",
            price: "$49/month",
            features: [
                "Basic hotel management tools",
                "Email support",
                "Access to analytics dashboard",
            ],
            buttonText: "Get Started",
        },
        {
            title: "Pro Plan",
            price: "$99/month",
            features: [
                "Advanced management tools",
                "Priority support",
                "Revenue optimization features",
            ],
            buttonText: "Upgrade Now",
        },
        {
            title: "Enterprise Plan",
            price: "Custom Pricing",
            features: [
                "Full suite of tools",
                "Dedicated account manager",
                "Custom integrations",
            ],
            buttonText: "Contact Us",
        },
    ];

    return (
        <div className="w-full bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-12">
                    Choose Your Plan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingPlans.map((plan, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4">{plan.title}</h3>
                            <p className="text-2xl font-extrabold text-amber-700 mb-6">{plan.price}</p>
                            <ul className="space-y-2 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="text-gray-600">
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className="px-6 py-2 bg-amber-700 text-white font-bold rounded-full hover:bg-amber-600 transition-transform transform hover:scale-105">
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}