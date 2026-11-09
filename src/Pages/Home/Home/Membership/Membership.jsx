import { useNavigate } from "react-router-dom";

const Membership = () => {
    const navigate = useNavigate();

    const memberships = [
        {
            name: "BASIC",
            price: "15",
            duration: "1 Month",
            benefits: [
                "Duration: 1 month",
                "Bring 1 friend",
                "Buy 1 entry, get 1 free",
            ],
            border: "border-[#00A8FF]/60",
            title: "text-[#31BFFF]",
            button: "bg-gradient-to-r from-[#0077C8] to-[#00BFFF]",
        },
        {
            name: "PREMIUM",
            price: "30",
            duration: "3 Months",
            benefits: [
                "Duration: 3 months",
                "Bring up to 2 friends",
                "Buy 1 entry, get 1 free per visit",
                "Free party access",
                "Exclusive promotions",
            ],
            border: "border-[#FF8C00]/70",
            title: "text-[#FFAD42]",
            button: "bg-gradient-to-r from-[#E66B00] to-[#FFB12B]",
        },
        {
            name: "VIP",
            price: "60",
            duration: "6 Months",
            benefits: [
                "Duration: 6 months",
                "Bring up to 3 friends",
                "All Premium benefits",
                "Discounts on selected items",
                "Complimentary parties with champagne",
                "Access to exclusive social events",
            ],
            border: "border-[#D4A017]/70",
            title: "text-[#E6C15A]",
            button:
                "bg-gradient-to-r from-[#A87912] via-[#F5D778] to-[#B38728]",
        },
    ];

    const handleSelectPlan = (planName) => {
        navigate(`/registration/${planName.toLowerCase()}`);
    };

    return (
        <div className="mx-5">
            <div
                id="membership"
                className="relative overflow-hidden bg-[#05070B] px-4 sm:px-6"
            >
                <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#0077C8]/10 blur-[120px]"></div>

                <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#FF8C00]/10 blur-[120px]"></div>

                <div className="relative mx-auto max-w-7xl">
                    <div className="mb-14 text-center md:mb-16">
                        <h2
                            className="relative mx-auto w-fit text-3xl font-semibold text-white md:text-4xl
                            after:absolute after:-bottom-3 after:left-0 after:h-[2px] after:w-full
                            after:bg-gradient-to-r after:from-[#BF953F] after:via-[#FCF6BA] after:to-[#AA771C] after:content-['']"
                        >
                            Membership Plans
                        </h2>
                    </div>

                    <div className="flex flex-col items-stretch justify-center gap-8 lg:flex-row lg:gap-6">
                        {memberships.map((plan) => (
                            <div
                                key={plan.name}
                                className={`mx-auto flex w-full max-w-xl flex-1 flex-col rounded-2xl border ${plan.border} bg-gradient-to-b from-[#111923] to-[#080B10] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.4)] sm:p-8`}
                            >
                                <h3
                                    className={`text-center text-2xl font-extrabold tracking-[3px] sm:text-3xl ${plan.title}`}
                                >
                                    {plan.name}
                                </h3>

                                <div className="my-7 text-center">
                                    <div className="flex items-start justify-center">
                                        <span className={`mt-2 text-xl font-bold ${plan.title}`}>
                                            $
                                        </span>

                                        <span className="text-6xl font-extrabold tracking-tight text-white sm:text-7xl">
                                            {plan.price}
                                        </span>
                                    </div>

                                    <p className={`mt-2 text-sm font-medium ${plan.title}`}>
                                        / {plan.duration}
                                    </p>
                                </div>

                                <div className="mb-7 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                                <div className="mb-9 flex-grow space-y-5">
                                    {plan.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <span className={`text-lg font-bold leading-5 ${plan.title}`}>
                                                ✓
                                            </span>

                                            <p className="text-sm leading-6 text-white sm:text-base">
                                                {benefit}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleSelectPlan(plan.name)}
                                    className={`w-full rounded-lg py-3.5 text-sm font-extrabold tracking-[2px] text-black transition hover:brightness-110 active:scale-[0.98] ${plan.button}`}
                                >
                                    SELECT
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Membership;