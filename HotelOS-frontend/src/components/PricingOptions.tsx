import { useTranslation } from "react-i18next";

export default function PricingOptions() {
    const { t } = useTranslation();

    const pricingPlans = [
        {
            title: t("pricing.basic.title", "Basic Plan"),
            price: t("pricing.basic.price", "$49/month"),
            features: [
                t("pricing.basic.features.0", "Basic hotel management tools"),
                t("pricing.basic.features.1", "Email support"),
                t("pricing.basic.features.2", "Access to analytics dashboard"),
            ],
            buttonText: t("pricing.basic.buttonText", "Get Started"),
        },
        {
            title: t("pricing.pro.title", "Pro Plan"),
            price: t("pricing.pro.price", "$99/month"),
            features: [
                t("pricing.pro.features.0", "Advanced management tools"),
                t("pricing.pro.features.1", "Priority support"),
                t("pricing.pro.features.2", "Revenue optimization features"),
            ],
            buttonText: t("pricing.pro.buttonText", "Upgrade Now"),
        },
        {
            title: t("pricing.enterprise.title", "Enterprise Plan"),
            price: t("pricing.enterprise.price", "Custom Pricing"),
            features: [
                t("pricing.enterprise.features.0", "Full suite of tools"),
                t("pricing.enterprise.features.1", "Dedicated account manager"),
                t("pricing.enterprise.features.2", "Custom integrations"),
            ],
            buttonText: t("pricing.enterprise.buttonText", "Contact Us"),
        },
    ];

    return (
        <div id="menu" className="w-full bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-12">
                    {t("pricing.chooseYourPlan", "Choose Your Plan")}
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
                            <button className="px-6 py-2 bg-amber-700 text-white font-bold rounded-full hover:bg-amber-600 transition-transform transform hover:scale-105 cursor-pointer">
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}