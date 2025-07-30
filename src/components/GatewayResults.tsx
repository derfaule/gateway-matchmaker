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

  const calculateGatewayScore = (gateway: PaymentGateway): number => {
    let score = 50; // Base score

    // Country-based scoring
    const countryScores: Record<string, Record<string, number>> = {
      "United States": { "stripe": 20, "square": 15, "authorize": 15, "paypal": 10 },
      "United Kingdom": { "adyen": 20, "worldpay": 15, "stripe": 15, "paypal": 10 },
      "Germany": { "adyen": 20, "cybersource": 15, "paypal": 10, "stripe": 15 },
      "Netherlands": { "adyen": 25, "stripe": 15, "paypal": 10 },
      "Canada": { "stripe": 20, "paypal": 15, "authorize": 10, "square": 10 },
      "Australia": { "stripe": 20, "paypal": 15, "adyen": 15, "square": 10 }
    };

    if (countryScores[formData.country]?.[gateway.id]) {
      score += countryScores[formData.country][gateway.id];
    }

    // Industry-based scoring
    const industryScores: Record<string, Record<string, number>> = {
      "Software": { "stripe": 20, "braintree": 15, "adyen": 10 },
      "Retail": { "square": 20, "paypal": 15, "adyen": 15, "worldpay": 10 },
      "Financial Services": { "cybersource": 20, "adyen": 15, "authorize": 10 },
      "Healthcare": { "authorize": 15, "cybersource": 15, "stripe": 10 },
      "Education": { "paypal": 15, "stripe": 15, "authorize": 10 }
    };

    if (industryScores[formData.industry]?.[gateway.id]) {
      score += industryScores[formData.industry][gateway.id];
    }

    // Revenue-based scoring
    const revenueScores: Record<string, Record<string, number>> = {
      "0-20 M": { "stripe": 15, "square": 15, "paypal": 10 },
      "20-50 M": { "stripe": 15, "adyen": 10, "braintree": 10, "authorize": 10 },
      "50-200 M": { "adyen": 20, "cybersource": 15, "worldpay": 10 },
      "200+M": { "adyen": 25, "cybersource": 20, "worldpay": 15 }
    };

    if (revenueScores[formData.annualRevenue]?.[gateway.id]) {
      score += revenueScores[formData.annualRevenue][gateway.id];
    }

    // Transaction volume scoring
    const totalMonthlyVolume = formData.avgSubscriptionAmount * formData.avgSubscriptionsPerMonth;
    if (totalMonthlyVolume > 100000) {
      const highVolumeBonus: Record<string, number> = {
        "adyen": 15, "cybersource": 15, "worldpay": 10, "stripe": 10
      };
      if (highVolumeBonus[gateway.id]) {
        score += highVolumeBonus[gateway.id];
      }
    } else if (totalMonthlyVolume > 10000) {
      const mediumVolumeBonus: Record<string, number> = {
        "stripe": 10, "braintree": 10, "paypal": 8, "adyen": 8
      };
      if (mediumVolumeBonus[gateway.id]) {
        score += mediumVolumeBonus[gateway.id];
      }
    } else {
      const lowVolumeBonus: Record<string, number> = {
        "stripe": 15, "square": 15, "paypal": 12, "authorize": 10
      };
      if (lowVolumeBonus[gateway.id]) {
        score += lowVolumeBonus[gateway.id];
      }
    }

    // Currency and payment method coverage
    const globalGateways = ["adyen", "stripe", "paypal", "cybersource", "worldpay"];
    if (formData.currencies.length > 3 && globalGateways.includes(gateway.id)) {
      score += 10;
    }

    if (formData.paymentMethods.length > 5 && globalGateways.includes(gateway.id)) {
      score += 10;
    }

    return Math.min(score, 100);
  };

  const scoredGateways = gatewayDatabase.map(gateway => ({
    ...gateway,
    score: calculateGatewayScore(gateway)
  }));

  const filteredGateways = scoredGateways
    .filter(gateway => gateway.score > 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  // Mark top gateway as recommended
  if (filteredGateways.length > 0) {
    filteredGateways[0].isRecommended = true;
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