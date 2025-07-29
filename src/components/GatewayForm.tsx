import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export interface FormData {
  country: string;
  industry: string;
  annualRevenue: string;
  avgSubscriptionAmount: number;
  avgSubscriptionsPerMonth: number;
  currencies: string[];
  paymentMethods: string[];
  // Detailed questions (optional)
  projectedGrowthRate?: number;
  localAcquiringNeeded?: boolean;
  top80RevenueMarkets?: string[];
  targetMarkets?: string[];
  merchantOfRecord?: boolean;
  fraudDetectionRequired?: boolean;
}

interface Props {
  onFormChange: (data: FormData, isComplete: boolean) => void;
  onDetailedQuestionsToggle: (enabled: boolean) => void;
}

const countries = [
  "United States", "United Kingdom", "Canada", "Germany", "France", "Australia",
  "Netherlands", "Sweden", "Norway", "Denmark", "Switzerland", "Belgium",
  "Austria", "Ireland", "Finland", "Spain", "Italy", "Portugal", "Japan",
  "Singapore", "New Zealand", "Brazil", "Mexico", "India", "China"
];

const industries = [
  "Construction", "Retail", "Software", "Financial Services", "Healthcare",
  "Education", "Entertainment", "Manufacturing", "Professional Services",
  "Real Estate", "Travel & Hospitality", "Food & Beverage", "Automotive",
  "Technology", "Consulting", "Media & Publishing", "Non-profit"
];

const revenueRanges = [
  "0-20 M", "20-50 M", "50-200 M", "200+M"
];

const currencies = [
  "United States Dollar (USD)", "Euro (EUR)", "British Pound (GBP)",
  "Canadian Dollar (CAD)", "Australian Dollar (AUD)", "Japanese Yen (JPY)",
  "Swiss Franc (CHF)", "Swedish Krona (SEK)", "Norwegian Krone (NOK)",
  "Danish Krone (DKK)", "Singapore Dollar (SGD)", "Hong Kong Dollar (HKD)",
  "Brazilian Real (BRL)", "Mexican Peso (MXN)", "Indian Rupee (INR)",
  "Chinese Yuan (CNY)"
];

const paymentMethods = [
  "Visa", "MasterCard", "American Express", "Discover", "PayPal",
  "Apple Pay", "Google Pay", "Bank Transfer", "SEPA Direct Debit",
  "iDEAL", "Klarna", "Afterpay", "WeChat Pay", "Alipay",
  "Stripe", "Square", "Venmo", "Zelle"
];

export default function GatewayForm({ onFormChange, onDetailedQuestionsToggle }: Props) {
  const [formData, setFormData] = useState<FormData>({
    country: "",
    industry: "",
    annualRevenue: "",
    avgSubscriptionAmount: 0,
    avgSubscriptionsPerMonth: 0,
    currencies: [],
    paymentMethods: []
  });

  const [currencySearch, setCurrencySearch] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDetailedQuestions, setShowDetailedQuestions] = useState(false);

  const isFormComplete = formData.country && formData.industry && formData.annualRevenue;

  useEffect(() => {
    onFormChange(formData, isFormComplete && isSubmitted);
  }, [formData, isFormComplete, isSubmitted, onFormChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormComplete) {
      setIsSubmitted(true);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addCurrency = (currency: string) => {
    if (!formData.currencies.includes(currency)) {
      updateFormData({ currencies: [...formData.currencies, currency] });
    }
    setCurrencySearch("");
  };

  const removeCurrency = (currency: string) => {
    updateFormData({ 
      currencies: formData.currencies.filter(c => c !== currency) 
    });
  };

  const addPaymentMethod = (method: string) => {
    if (!formData.paymentMethods.includes(method)) {
      updateFormData({ paymentMethods: [...formData.paymentMethods, method] });
    }
    setPaymentSearch("");
  };

  const removePaymentMethod = (method: string) => {
    updateFormData({ 
      paymentMethods: formData.paymentMethods.filter(m => m !== method) 
    });
  };

  const filteredCurrencies = currencies.filter(currency =>
    currency.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const filteredPaymentMethods = paymentMethods.filter(method =>
    method.toLowerCase().includes(paymentSearch.toLowerCase())
  );

  return (
    <Card className="p-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="country">Corporate headquarters country</Label>
          <Select 
            value={formData.country} 
            onValueChange={(value) => updateFormData({ country: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border max-h-60 overflow-y-auto">
              {countries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select 
            value={formData.industry} 
            onValueChange={(value) => updateFormData({ industry: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border max-h-60 overflow-y-auto">
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenue">Annual Revenue</Label>
          <Select 
            value={formData.annualRevenue} 
            onValueChange={(value) => updateFormData({ annualRevenue: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border">
              {revenueRanges.map(range => (
                <SelectItem key={range} value={range}>{range}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subscription-amount">Average Subscription Amount</Label>
          <Input
            id="subscription-amount"
            type="number"
            placeholder="0"
            value={formData.avgSubscriptionAmount || ""}
            onChange={(e) => updateFormData({ avgSubscriptionAmount: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subscriptions-count">Average # of subscriptions a month</Label>
          <Input
            id="subscriptions-count"
            type="number"
            placeholder="0"
            value={formData.avgSubscriptionsPerMonth || ""}
            onChange={(e) => updateFormData({ avgSubscriptionsPerMonth: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label>Accepted Currencies</Label>
          <div className="space-y-2">
            <Input
              placeholder="Search a currency"
              value={currencySearch}
              onChange={(e) => setCurrencySearch(e.target.value)}
            />
            {currencySearch && filteredCurrencies.length > 0 && (
              <div className="border border-border rounded-md bg-popover max-h-40 overflow-y-auto">
                {filteredCurrencies.slice(0, 5).map(currency => (
                  <div
                    key={currency}
                    className="px-3 py-2 hover:bg-accent cursor-pointer"
                    onClick={() => addCurrency(currency)}
                  >
                    {currency}
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {formData.currencies.map(currency => (
                <Badge key={currency} variant="secondary" className="pr-1">
                  {currency}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => removeCurrency(currency)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Payment methods</Label>
          <div className="space-y-2">
            <Input
              placeholder="Search payment methods"
              value={paymentSearch}
              onChange={(e) => setPaymentSearch(e.target.value)}
            />
            {paymentSearch && filteredPaymentMethods.length > 0 && (
              <div className="border border-border rounded-md bg-popover max-h-40 overflow-y-auto">
                {filteredPaymentMethods.slice(0, 5).map(method => (
                  <div
                    key={method}
                    className="px-3 py-2 hover:bg-accent cursor-pointer"
                    onClick={() => addPaymentMethod(method)}
                  >
                    {method}
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {formData.paymentMethods.map(method => (
                <Badge key={method} variant="secondary" className="pr-1">
                  {method}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => removePaymentMethod(method)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {!isSubmitted && (
          <Button 
            type="submit" 
            className="w-full"
            disabled={!isFormComplete}
          >
            Find Payment Gateways
          </Button>
        )}
      </form>

      {/* Detailed Questions Toggle */}
      {isSubmitted && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Switch
              id="detailed-questions"
              checked={showDetailedQuestions}
              onCheckedChange={(checked) => {
                setShowDetailedQuestions(checked);
                onDetailedQuestionsToggle(checked);
              }}
            />
            <Label htmlFor="detailed-questions" className="text-sm font-medium cursor-pointer">
              Answer more detailed questions for more accurate results.
            </Label>
          </div>
        </div>
      )}
    </Card>
  );
}