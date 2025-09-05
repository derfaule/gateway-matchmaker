import { useState } from "react";
import { FormData } from "./GatewayForm";
import { gatewayDatabase, PaymentGateway } from "@/lib/gatewayData";
import GatewayCard from "./GatewayCard";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useScoreConfig } from './ScoreConfigContext'; // Import the new hook

interface Props {
  formData: FormData;
  showResults: boolean;
  showDetailedQuestions: boolean;
}

// Helper function to calculate a bonus for a perfect match in payment methods and currencies.
const calculatePerfectMatchBonus = (gateway: PaymentGateway, formData: FormData, scoreConfig: any): number => {
    const userCurrencyCodes = formData.currencies; // No need for conversion, already three-letter codes
    const supportsAllPaymentMethods = formData.paymentMethods.every(method => gateway.supportedPaymentMethods.includes(method));
    const supportsAllCurrencies = userCurrencyCodes.every(currency => gateway.supportedCurrencies.includes(currency));
    return (supportsAllPaymentMethods && supportsAllCurrencies) ? scoreConfig.bonuses.perfectMatch : 0;
};

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
