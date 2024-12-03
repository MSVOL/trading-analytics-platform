export interface AnalyticsFilter {
    startDate: string;
    endDate: string;
    symbols?: string[];
    traders?: string[];
    firms?: string[];
}

export interface AnalyticsResult {
    type: 'INDIVIDUAL' | 'GROUP' | 'FIRM';
    timestamp: string;
    metrics: {
        performance: {
            totalPnL: number;
            winRate: number;
            sharpeRatio: number;
        };
        risk: {
            currentDrawdown: number;
            maxDrawdown: number;
            dailyVar: number;
        };
        behavior: {
            averageHoldingTime: number;
            tradeFrequency: number;
            consistencyScore: number;
        };
    };
}
