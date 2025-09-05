// Index.tsx
import { useState } from "react";
import { ScoreConfigProvider } from './ScoreConfigContext'; // Import the provider
import GatewayForm, { FormData } from "@/components/GatewayForm";
import GatewayResults from "@/components/GatewayResults";

const Index = () => {
    // ... (rest of your component logic)

    return (
        <ScoreConfigProvider>
            <div className="min-h-screen bg-background">
                {/* ... (rest of your JSX, including the form and results) */}
            </div>
        </ScoreConfigProvider>
    );
};
export default Index;
