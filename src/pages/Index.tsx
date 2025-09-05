import { useState, useRef } from "react";
import GatewayForm, { FormData } from "@/components/GatewayForm";
import GatewayResults from "@/components/GatewayResults";
import { ScoreConfigProvider } from "@/lib/ScoreConfigContext";

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    country: "",
    industry: "",
    annualRevenue: "",
    avgSubscriptionAmount: 0,
    avgSubscriptionsPerMonth: 0,
    currencies: [],
    paymentMethods: []
  });
  const [showResults, setShowResults] = useState(false);
  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFormChange = (data: FormData, isComplete: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setFormData(data);
      setShowResults(isComplete);
    }, 500);
  };

  const handleDetailedQuestionsToggle = (enabled: boolean) => {
    setShowDetailedQuestions(enabled);
  };

  return (
    <ScoreConfigProvider>
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-yellow-brand to-yellow-brand/90 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-yellow-brand-foreground mb-4">
                Find Your Perfect Payment Gateway
              </h1>
              <p className="text-lg text-yellow-brand-foreground/80 max-w-3xl mx-auto mb-6">
                Recurly works with multiple payment gateways globally. Use our tool to quickly
                compare costs and find the best gateway for your business.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className={`transition-all duration-500 ease-in-out ${showResults ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'flex justify-center'}`}>
            <div id="business-form" className={`transition-all duration-500 ease-in-out ${showResults ? 'w-full' : 'w-full max-w-2xl'}`}>
              <h2 className="text-2xl font-semibold mb-6">Tell us about your business</h2>
              <GatewayForm onFormChange={handleFormChange} onDetailedQuestionsToggle={handleDetailedQuestionsToggle} />
            </div>

            {showResults && (
              <div className="transition-all duration-500 ease-in-out">
                <GatewayResults formData={formData} showResults={showResults} showDetailedQuestions={showDetailedQuestions} />
              </div>
            )}
          </div>
        </div>
      </div>
    </ScoreConfigProvider>
  );
};

export default Index;

// Helper function to calculate a bonus based on country, industry, and revenue.
const calculateContextualBonus = (gateway: PaymentGateway, formData: FormData, scoreConfig: any): number => {
    let bonus = 0;

    if (scoreConfig.bonuses.regionalBonus[formData.country]?.[gateway.name]) {
        bonus += scoreConfig.bonuses.regionalBonus[formData.country][gateway.name];
    }
    
    if (scoreConfig.bonuses.industryBonus[formData.industry]?.[gateway.name]) {
        bonus += scoreConfig.bonuses.industryBonus[formData.industry][gateway.name];
    }

    if (scoreConfig.bonuses.revenueBonus[formData.annualRevenue]?.[gateway.name]) {
        bonus += scoreConfig.bonuses.revenueBonus[formData.annualRevenue][gateway.name];
    }

    return bonus;
};

// Helper function to calculate a bonus based on special features.
const calculateFeatureBonus = (gateway: PaymentGateway, formData: FormData, scoreConfig: any): number => {
    let bonus = 0;
    if (formData.needGatewayTokens && gateway.gatewayTokensSupported === "Yes") {
        bonus += scoreConfig.bonuses.featureBonus.gatewayTokens;
    }
    if (formData.admitToolImport && gateway.admitToolCanImportData === "Yes") {
        bonus += scoreConfig.bonuses.featureBonus.admitTool;
    }
    return bonus;
};

// Main function to calculate the total score for a gateway.
const calculateGatewayScore = (gateway: PaymentGateway, formData: FormData, scoreConfig: any): number => {
  let score = scoreConfig.baseScore; // Use the base score from the config

  score += calculatePerfectMatchBonus(gateway, formData, scoreConfig);
  score += calculateContextualBonus(gateway, formData, scoreConfig);
  score += calculateFeatureBonus(gateway, formData, scoreConfig);

  // Additional bonus for extensive coverage
  const globalGateways = ["Adyen", "Stripe", "PayPal", "Worldpay", "Checkout.com"];
  if (formData.currencies.length > 3 && globalGateways.includes(gateway.name)) {
      score += scoreConfig.bonuses.globalCoverage;
  }
  if (formData.paymentMethods.length > 5 && globalGateways.includes(gateway.name)) {
      score += scoreConfig.bonuses.globalCoverage;
  }

  // Ensure score does not exceed 100
  return Math.min(score, 100);
};


export default function GatewayResults({ formData, showResults, showDetailedQuestions }: Props) {
  const [detailedData, setDetailedData] = useState<Partial<FormData>>({});
  const [marketSearch, setMarketSearch] = useState("");
  const [targetMarketSearch, setTargetMarketSearch] = useState("");
  const scoreConfig = useScoreConfig(); // Get the dynamic score config

  const markets = [
    "United States", "United Kingdom", "Canada", "Germany", "France", "Australia",
    "Netherlands", "Sweden", "Norway", "Denmark", "Switzerland", "Belgium",
    "Austria", "Ireland", "Finland", "Spain", "Italy", "Portugal", "Japan",
    "Singapore", "New Zealand", "Brazil", "Mexico", "India", "China", "South Korea",
    "EMEA", "LATAM", "APAC", "NA"
  ];

  if (!showResults) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <div className="text-4xl mb-4">💳</div>
          <p>Fill out the form to see recommended payment gateways</p>
        </div>
      </div>
    );
  }

  const scoredGateways = gatewayDatabase.map(gateway => ({
    ...gateway,
    score: calculateGatewayScore(gateway, formData, scoreConfig)
  }));

  const filteredGateways = scoredGateways
    .filter(gateway => gateway.score > 30)
    .sort((a, b) => {
      // Primary sort by score (descending)
      if (a.score !== b.score) {
          return b.score - a.score;
      }
      // Secondary sort by name (alphabetical) for tie-breaking
      return a.name.localeCompare(b.name);
    })
    .slice(0, 6);

  // Mark top gateway as recommended and system suggested
  if (filteredGateways.length > 0) {
    filteredGateways[0].isRecommended = true;
    filteredGateways[0].isSystemSuggested = true;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recommended Gateways</h2>
        <div className="text-sm text-muted-foreground">
          {filteredGateways.length} results found
        </div>
      </div>

      {filteredGateways.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            loop: false,
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredGateways.map((gateway) => (
              <CarouselItem key={gateway.id} className="pl-2 md:pl-4 md:basis-1/2">
                <GatewayCard 
                  gateway={gateway} 
                  formData={formData}
                  isSystemSuggested={gateway.isSystemSuggested || false}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-background" />
          <CarouselNext className="right-0 bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-background" />
        </Carousel>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-4xl mb-4">🔍</div>
          <p>No payment gateways match your criteria.</p>
          <p className="text-sm">Try adjusting your requirements or contact us for custom recommendations.</p>
        </div>
      )}
    </div>
  );
}
