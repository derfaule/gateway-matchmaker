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

interface Props {
  formData: FormData;
  showResults: boolean;
}

export default function GatewayResults({ formData, showResults }: Props) {
  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recommended Payment Gateways</h3>
        <span className="text-sm text-muted-foreground">
          {filteredGateways.length} results found
        </span>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
        {filteredGateways.map((gateway) => (
          <GatewayCard key={gateway.id} gateway={gateway} formData={formData} />
        ))}
      </div>
      
      {filteredGateways.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-4">🔍</div>
          <p>No payment gateways match your current criteria.</p>
          <p className="text-sm">Try adjusting your requirements.</p>
        </div>
      )}

      {/* Detailed Questions Toggle */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
          <Switch
            id="detailed-questions"
            checked={showDetailedQuestions}
            onCheckedChange={setShowDetailedQuestions}
          />
          <Label htmlFor="detailed-questions" className="text-sm font-medium cursor-pointer">
            Answer more detailed questions for more accurate results.
          </Label>
        </div>

        {/* Detailed Questions Section */}
        {showDetailedQuestions && (
          <Card className="mt-4 p-6 space-y-6 bg-accent/5 border-accent/20">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Optional Details</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailedQuestions(false)}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Projected Growth Rate */}
              <div className="space-y-2">
                <Label htmlFor="growth-rate">
                  Projected Growth Rate <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="growth-rate"
                    type="number"
                    placeholder="0"
                    value={detailedData.projectedGrowthRate || ""}
                    onChange={(e) => setDetailedData(prev => ({ 
                      ...prev, 
                      projectedGrowthRate: Number(e.target.value) 
                    }))}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>

              {/* Local Acquiring Needed */}
              <div className="space-y-2">
                <Label>
                  Local Acquiring Needed? <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="acquiring-yes"
                      name="localAcquiring"
                      checked={detailedData.localAcquiringNeeded === true}
                      onChange={() => setDetailedData(prev => ({ ...prev, localAcquiringNeeded: true }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="acquiring-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="acquiring-no"
                      name="localAcquiring"
                      checked={detailedData.localAcquiringNeeded === false}
                      onChange={() => setDetailedData(prev => ({ ...prev, localAcquiringNeeded: false }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="acquiring-no" className="text-sm">No</Label>
                  </div>
                </div>
              </div>

              {/* Top 80% Revenue Markets */}
              <div className="space-y-2">
                <Label>
                  Which markets generate your top 80% of revenue today? <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Search markets..."
                    value={marketSearch}
                    onChange={(e) => setMarketSearch(e.target.value)}
                  />
                  {marketSearch && (
                    <div className="border border-border rounded-md bg-popover max-h-40 overflow-y-auto">
                      {markets
                        .filter(market => market.toLowerCase().includes(marketSearch.toLowerCase()))
                        .slice(0, 5)
                        .map(market => (
                          <div
                            key={market}
                            className="px-3 py-2 hover:bg-accent cursor-pointer"
                            onClick={() => {
                              const currentMarkets = detailedData.top80RevenueMarkets || [];
                              if (!currentMarkets.includes(market)) {
                                setDetailedData(prev => ({
                                  ...prev,
                                  top80RevenueMarkets: [...currentMarkets, market]
                                }));
                              }
                              setMarketSearch("");
                            }}
                          >
                            {market}
                          </div>
                        ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {(detailedData.top80RevenueMarkets || []).map(market => (
                      <Badge key={market} variant="secondary" className="pr-1">
                        {market}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => {
                            setDetailedData(prev => ({
                              ...prev,
                              top80RevenueMarkets: (prev.top80RevenueMarkets || []).filter(m => m !== market)
                            }));
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Markets */}
              <div className="space-y-2">
                <Label>
                  Which markets are you targeting next? <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Search target markets..."
                    value={targetMarketSearch}
                    onChange={(e) => setTargetMarketSearch(e.target.value)}
                  />
                  {targetMarketSearch && (
                    <div className="border border-border rounded-md bg-popover max-h-40 overflow-y-auto">
                      {markets
                        .filter(market => market.toLowerCase().includes(targetMarketSearch.toLowerCase()))
                        .slice(0, 5)
                        .map(market => (
                          <div
                            key={market}
                            className="px-3 py-2 hover:bg-accent cursor-pointer"
                            onClick={() => {
                              const currentTargets = detailedData.targetMarkets || [];
                              if (!currentTargets.includes(market)) {
                                setDetailedData(prev => ({
                                  ...prev,
                                  targetMarkets: [...currentTargets, market]
                                }));
                              }
                              setTargetMarketSearch("");
                            }}
                          >
                            {market}
                          </div>
                        ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {(detailedData.targetMarkets || []).map(market => (
                      <Badge key={market} variant="secondary" className="pr-1">
                        {market}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => {
                            setDetailedData(prev => ({
                              ...prev,
                              targetMarkets: (prev.targetMarkets || []).filter(m => m !== market)
                            }));
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Merchant of Record */}
              <div className="space-y-2">
                <Label>
                  Are you a Merchant of Record/Payout Requirements? <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="merchant-yes"
                      name="merchantOfRecord"
                      checked={detailedData.merchantOfRecord === true}
                      onChange={() => setDetailedData(prev => ({ ...prev, merchantOfRecord: true }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="merchant-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="merchant-no"
                      name="merchantOfRecord"
                      checked={detailedData.merchantOfRecord === false}
                      onChange={() => setDetailedData(prev => ({ ...prev, merchantOfRecord: false }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="merchant-no" className="text-sm">No</Label>
                  </div>
                </div>
              </div>

              {/* Fraud Detection Required */}
              <div className="space-y-2">
                <Label>
                  Do you require Fraud Detection? <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="fraud-yes"
                      name="fraudDetection"
                      checked={detailedData.fraudDetectionRequired === true}
                      onChange={() => setDetailedData(prev => ({ ...prev, fraudDetectionRequired: true }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="fraud-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="fraud-no"
                      name="fraudDetection"
                      checked={detailedData.fraudDetectionRequired === false}
                      onChange={() => setDetailedData(prev => ({ ...prev, fraudDetectionRequired: false }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="fraud-no" className="text-sm">No</Label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}