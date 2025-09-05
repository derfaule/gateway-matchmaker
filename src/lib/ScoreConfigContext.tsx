import React, { createContext, useContext, useState, useEffect } from 'react';
import { scoreWeights as defaultWeights } from './scoreConfig';

const ScoreConfigContext = createContext(defaultWeights);

export const ScoreConfigProvider = ({ children }) => {
    const [config, setConfig] = useState(defaultWeights);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                // In a real application, this would be an API call
                const response = await new Promise(resolve => setTimeout(() => resolve({
                    bonuses: {
                        ...defaultWeights.bonuses,
                        perfectMatch: 30, // Example of a dynamic change
                    },
                }), 1000));
                
                setConfig(prevConfig => ({
                    ...prevConfig,
                    ...(response as any),
                }));
            } catch (error) {
                console.error("Failed to fetch score config:", error);
            }
        };

        fetchConfig();
        const intervalId = setInterval(fetchConfig, 60000); // Poll every minute for updates
        return () => clearInterval(intervalId); // Cleanup
    }, []);

    return (
        <ScoreConfigContext.Provider value={config}>
            {children}
        </ScoreConfigContext.Provider>
    );
};

export const useScoreConfig = () => useContext(ScoreConfigContext);
