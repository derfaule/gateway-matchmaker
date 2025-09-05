export const scoreWeights = {
    baseScore: 50,
    bonuses: {
        perfectMatch: 25,
        regionalBonus: {
            "United States": { "Stripe": 20, "Adyen": 15 },
            "United Kingdom": { "Adyen": 20, "Stripe": 15 },
            "Germany": { "Adyen": 20, "Stripe": 15 },
        },
        industryBonus: {
            "Software": { "Stripe": 20, "Adyen": 10 },
            "Retail": { "Adyen": 15, "PayPal": 15 },
        },
        revenueBonus: {
            "0-20 M": { "Stripe": 15, "PayPal": 15 },
            "200+M": { "Adyen": 25, "Checkout.com": 20 },
        },
        featureBonus: {
            gatewayTokens: 15,
            admitTool: 15,
        },
        globalCoverage: 10,
    },
};
