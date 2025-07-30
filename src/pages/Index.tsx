import { useState } from "react";
import GatewayForm, { FormData } from "@/components/GatewayForm";
import GatewayResults from "@/components/GatewayResults";
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
  const handleFormChange = (data: FormData, isComplete: boolean) => {
    setFormData(data);
    setShowResults(isComplete);
  };
  const handleDetailedQuestionsToggle = (enabled: boolean) => {
    setShowDetailedQuestions(enabled);
  };
  return <div className="min-h-screen bg-background">
      {/* Header Section */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`transition-all duration-500 ease-in-out ${showResults ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'flex justify-center'}`}>
          {/* Form Section */}
          <div id="business-form" className={`transition-all duration-500 ease-in-out ${showResults ? 'w-full' : 'w-full max-w-2xl'}`}>
            <h2 className="text-2xl font-semibold mb-6">Tell us about your business</h2>
            <GatewayForm onFormChange={handleFormChange} onDetailedQuestionsToggle={handleDetailedQuestionsToggle} />
          </div>

          {/* Results Section */}
          {showResults && <div className="transition-all duration-500 ease-in-out">
              <GatewayResults formData={formData} showResults={showResults} showDetailedQuestions={showDetailedQuestions} />
            </div>}
        </div>
      </div>
    </div>;
};
export default Index;