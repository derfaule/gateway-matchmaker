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

interface Props {
  formData: FormData;
  showResults: boolean;
  showDetailedQuestions: boolean;
}

// Helper function to calculate a bonus for a perfect match in payment methods and currencies.
const calculatePerfectMatchBonus = (gateway: PaymentGateway, formData: FormData): number => {
    const userCurrencyCodes = formData.currencies.map(curr => curr.split('(')[1]?.replace(')', '') || curr);
    const supportsAllPaymentMethods = formData.paymentMethods.every(method => gateway.supportedPaymentMethods.includes(method));
    const supportsAllCurrencies = userCurrencyCodes.every(currency => gateway.supportedCurrencies.includes(currency));
    return (supportsAllPaymentMethods && supportsAllCurrencies) ? 25 : 0;
};

// Helper function to calculate a bonus based on country, industry, and revenue.
const calculateContextualBonus = (gateway: PaymentGateway, formData: FormData): number => {
    let bonus = 0;

    const countryScores: Record<string, Record<string, number>> = {
        "United States": { "Adyen": 15, "PayPal": 10, "Worldpay": 5, "Stripe": 20, "Checkout.com": 5 },
        "United Kingdom": { "Adyen": 20, "Worldpay": 15, "Stripe": 15, "Checkout.com": 10, "PayPal": 10 },
        "Germany": { "Adyen": 20, "Stripe": 15, "PayPal": 10, "Checkout.com": 10, "Klarna": 15 },
        "Brazil": { "dLocal": 20, "Stripe": 10, "Adyen": 10, "PayPal": 5 },
        "Mexico": { "dLocal": 20, "Stripe": 10, "PayPal": 5 },
        "South Korea": { "KakaoPay": 25, "NaverPay": 20, "Payco": 15, "Adyen": 10, "Stripe": 10 },
    };
    if (countryScores[formData.country]?.[gateway.name]) {
        bonus += countryScores[formData.country][gateway.name];
    }
    
    const industryScores: Record<string, Record<string, number>> = {
      "Software": { "Stripe": 20, "PayPal": 15, "Adyen": 10 },
      "Retail": { "Stripe": 15, "PayPal": 15, "Adyen": 15, "Worldpay": 10 },
      "Financial Services": { "Adyen": 15, "Checkout.com": 10, "Worldpay": 10 },
      "Healthcare": { "Stripe": 10, "Adyen": 5 },
      "Education": { "PayPal": 15, "Stripe": 15 },
    };
    if (industryScores[formData.industry]?.[gateway.name]) {
        bonus += industryScores[formData.industry][gateway.name];
    }

    const revenueScores: Record<string, Record<string, number>> = {
      "0-20 M": { "Stripe": 15, "PayPal": 15, "Fiserv": 10 },
      "20-50 M": { "Stripe": 15, "Adyen": 10, "PayPal": 10 },
      "50-200 M": { "Adyen": 20, "Checkout.com": 15, "Worldpay": 10 },
      "200+M": { "Adyen": 25, "Checkout.com": 20, "Worldpay": 15 }
    };
    if (revenueScores[formData.annualRevenue]?.[gateway.name]) {
        bonus += revenueScores[formData.annualRevenue][gateway.name];
    }

    return bonus;
};

// Helper function to calculate a bonus based on special features.
const calculateFeatureBonus = (gateway: PaymentGateway, formData: FormData): number => {
    let bonus = 0;
    if (formData.needGatewayTokens && gateway.gatewayTokensSupported === "Yes") {
        bonus += 15;
    }
    if (formData.admitToolImport && gateway.admitToolCanImportData === "Yes") {
        bonus += 15;
    }
    return bonus;
};

// Main function to calculate the total score for a gateway.
const calculateGatewayScore = (gateway: PaymentGateway, formData: FormData): number => {
  let score = 50; // Base score

  score += calculatePerfectMatchBonus(gateway, formData);
  score += calculateContextualBonus(gateway, formData);
  score += calculateFeatureBonus(gateway, formData);

  // Additional bonus for extensive coverage
  const globalGateways = ["Adyen", "Stripe", "PayPal", "Worldpay", "Checkout.com"];
  if (formData.currencies.length > 3 && globalGateways.includes(gateway.name)) {
      score += 10;
  }
  if (formData.paymentMethods.length > 5 && globalGateways.includes(gateway.name)) {
      score += 10;
  }

  // Ensure score does not exceed 100
  return Math.min(score, 100);
};


export default function GatewayResults({ formData, showResults, showDetailedQuestions }: Props) {
  const [detailedData, setDetailedData] = useState<Partial<FormData>>({});
  const [marketSearch, setMarketSearch] = useState("");
  const [targetMarketSearch, setTargetMarketSearch] = useState("");

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
    score: calculateGatewayScore(gateway, formData)
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
