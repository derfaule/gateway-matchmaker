import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { allPaymentMethods, gatewayDatabase, PaymentGateway } from "@/lib/gatewayData";

interface SuggestionFormData {
  paymentType: string;
  amount: number;
  route: string;
}

export default function GatewaySuggestion() {
  const [formData, setFormData] = useState<SuggestionFormData>({
    paymentType: "",
    amount: 0,
    route: ""
  });
  const [recommendedGateway, setRecommendedGateway] = useState<PaymentGateway | null>(null);
  const [showResult, setShowResult] = useState(false);

  const routeOptions = ["Local", "Global", "Regional"];

  const calculateSuggestionScore = (gateway: PaymentGateway): number => {
    let score = 0;

    // Primary factor: payment type support
    if (gateway.supportedPaymentMethods.includes(formData.paymentType)) {
      score += 50;
    }

    // Amount-based scoring
    if (formData.amount > 10000) {
      // Large amounts - favor enterprise gateways
      const enterpriseBonus: Record<string, number> = {
        "adyen": 30,
        "stripe": 25,
        "cybersource": 20,
        "worldpay": 15
      };
      if (enterpriseBonus[gateway.id]) {
        score += enterpriseBonus[gateway.id];
      }
    } else {
      // Small amounts - favor local/simple gateways
      const localBonus: Record<string, number> = {
        "authorize": 25,
        "square": 25,
        "paypal": 20,
        "stripe": 15
      };
      if (localBonus[gateway.id]) {
        score += localBonus[gateway.id];
      }
    }

    // Route-based scoring
    const routeScores: Record<string, Record<string, number>> = {
      "Global": { "adyen": 20, "stripe": 15, "paypal": 10 },
      "Local": { "square": 20, "authorize": 15, "paypal": 10 },
      "Regional": { "adyen": 15, "stripe": 15, "worldpay": 10, "cybersource": 10 }
    };

    if (routeScores[formData.route]?.[gateway.id]) {
      score += routeScores[formData.route][gateway.id];
    }

    return score;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.paymentType || !formData.amount || !formData.route) {
      return;
    }

    const scoredGateways = gatewayDatabase.map(gateway => ({
      ...gateway,
      suggestionScore: calculateSuggestionScore(gateway)
    }));

    const topGateway = scoredGateways
      .filter(gateway => gateway.suggestionScore > 0)
      .sort((a, b) => b.suggestionScore - a.suggestionScore)[0];

    setRecommendedGateway(topGateway || null);
    setShowResult(true);
  };

  const isFormValid = formData.paymentType && formData.amount > 0 && formData.route;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Gateway Suggestion</h1>
        <p className="text-muted-foreground">Get a personalized payment gateway recommendation</p>
      </div>

      <Card className="p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="paymentType">Payment Type</Label>
            <Select
              value={formData.paymentType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a payment type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-lg z-50">
                {allPaymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Transaction Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="route">Business Route</Label>
            <Select
              value={formData.route}
              onValueChange={(value) => setFormData(prev => ({ ...prev, route: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your business route" />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-lg z-50">
                {routeOptions.map((route) => (
                  <SelectItem key={route} value={route}>
                    {route}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={!isFormValid}>
            Get Recommendation
          </Button>
        </form>
      </Card>

      {showResult && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Our Recommendation</h2>
          {recommendedGateway ? (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{recommendedGateway.logo}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">{recommendedGateway.name}</h3>
                    <Badge className="bg-recommended text-recommended-foreground">
                      Best Match
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {recommendedGateway.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Why this gateway?</h4>
                <div className="space-y-1">
                  {recommendedGateway.supportedPaymentMethods.includes(formData.paymentType) && (
                    <div className="flex items-center text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                      Supports {formData.paymentType}
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    Optimized for {formData.route.toLowerCase()} business routes
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    {formData.amount > 10000 ? "Enterprise-grade for high volumes" : "Cost-effective for your transaction size"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Key Features</h4>
                <div className="space-y-1">
                  {recommendedGateway.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-4">🔍</div>
              <p>No suitable gateway found for your requirements.</p>
              <p className="text-sm">Try adjusting your criteria or contact us for assistance.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}