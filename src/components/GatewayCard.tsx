import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PaymentGateway } from "@/lib/gatewayData";
import { FormData } from "./GatewayForm";
interface Props {
  gateway: PaymentGateway;
  formData: FormData;
  isSystemSuggested?: boolean;
}
export default function GatewayCard({
  gateway,
  formData,
  isSystemSuggested = false
}: Props) {
  const [showDetails, setShowDetails] = useState(false);

  // Get top 6 currencies with user-selected ones prioritized
  const getDisplayCurrencies = () => {
    const userCurrencyCodes = formData.currencies.map(curr => curr.split('(')[1]?.replace(')', '') || curr);
    const prioritized = gateway.supportedCurrencies.filter(curr => userCurrencyCodes.includes(curr));
    const remaining = gateway.supportedCurrencies.filter(curr => !userCurrencyCodes.includes(curr));

    // Shuffle remaining currencies for randomness
    const shuffled = remaining.sort(() => Math.random() - 0.5);
    return [...prioritized, ...shuffled].slice(0, 6);
  };

  // Get top 5 payment methods with user-selected ones prioritized
  const getDisplayPaymentMethods = () => {
    const prioritized = gateway.supportedPaymentMethods.filter(method => formData.paymentMethods.includes(method));
    const remaining = gateway.supportedPaymentMethods.filter(method => !formData.paymentMethods.includes(method));

    // Shuffle remaining methods for randomness
    const shuffled = remaining.sort(() => Math.random() - 0.5);
    return [...prioritized, ...shuffled].slice(0, 5);
  };
  const displayCurrencies = getDisplayCurrencies();
  const displayPaymentMethods = getDisplayPaymentMethods();
  const userCurrencyCodes = formData.currencies.map(curr => curr.split('(')[1]?.replace(')', '') || curr);
  return <Card className="p-6 relative bg-gateway-card border-gateway-border hover:shadow-lg transition-shadow duration-300">
      {gateway.isRecommended && <Badge className="absolute top-3 right-3 bg-recommended text-recommended-foreground">
          Recommended
        </Badge>}
      
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start space-x-4">
          <div className="text-3xl">{gateway.logo}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-xl">{gateway.name}</h4>
              {isSystemSuggested && (
                <Badge className="bg-recommended text-recommended-foreground">
                  Our Pick
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{gateway.description}</p>
          </div>
        </div>

        {/* Top Supported Currencies */}
        <div className="space-y-2">
          <h5 className="font-medium text-sm text-foreground">Top Supported Currencies</h5>
          <div className="flex flex-wrap gap-1">
            {displayCurrencies.map(currency => <Badge key={currency} variant={userCurrencyCodes.includes(currency) ? "default" : "secondary"} className={`text-xs ${userCurrencyCodes.includes(currency) ? 'font-semibold' : ''}`}>
                {currency}
              </Badge>)}
          </div>
        </div>

        {/* Supported Payment Methods */}
        <div className="space-y-2">
          <h5 className="font-medium text-sm text-foreground">Supported Payment Methods</h5>
          <div className="flex flex-wrap gap-1">
            {displayPaymentMethods.map(method => <Badge key={method} variant={formData.paymentMethods.includes(method) ? "default" : "secondary"} className={`text-xs ${formData.paymentMethods.includes(method) ? 'font-semibold' : ''}`}>
                {method}
              </Badge>)}
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-2">
          <h5 className="font-medium text-sm text-foreground">Key Features</h5>
          <div className="space-y-1">
            {gateway.features.slice(0, 3).map((feature, index) => <div key={index} className="flex items-center text-sm">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                {feature}
              </div>)}
          </div>
        </div>

        {/* More Details Button */}
        <Button variant="outline" size="sm" className="w-full" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? <>
              Hide Details <ChevronUp className="w-4 h-4 ml-2" />
            </> : <>
              More Details <ChevronDown className="w-4 h-4 ml-2" />
            </>}
        </Button>

        {/* Expandable Technical Details */}
        {showDetails && <div className="mt-4 p-4 bg-muted rounded-lg space-y-3 border-l-4 border-primary">
            <h5 className="font-medium text-sm text-foreground">Technical Details</h5>
            <div className="space-y-2">
              {gateway.technicalDetails.map((detail, index) => <div key={index} className="flex items-start text-sm">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2 flex-shrink-0"></span>
                  <span className="text-muted-foreground leading-relaxed">{detail}</span>
                </div>)}
            </div>
          </div>}
      </div>
    </Card>;
}