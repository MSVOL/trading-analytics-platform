export interface FirmConfig {
    id: string;
    name: string;
    riskParameters: {
        maxDailyLoss: number;
        maxDrawdown: number;
        maxPositionSize: number;
        requiredWinRate: number;
        minProfitableDays: number;
    };
    tradingHours: {
        start: string;  // "09:30"
        end: string;    // "16:00"
        timezone: string;
    };
}

export interface FirmMetrics {
    totalTraders: number;
    activeTraders: number;
    averageWinRate: number;
    programSuccess: number;  // % of traders meeting criteria
    riskScore: number;      // 0-100
}
