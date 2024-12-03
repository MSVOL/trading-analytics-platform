export type Direction = 'LONG' | 'SHORT';
export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'YTD';

export interface Trade {
    id: string;
    entryPrice: number;
    exitPrice: number;
    size: number;
    direction: Direction;
    entryTimestamp: string;
    exitTimestamp: string;
    symbol: string;
    pnl?: number;
    fees?: number;
}

export interface TraderMetrics {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    averageWin: number;
    averageLoss: number;
    totalTrades: number;
    profitableTrades: number;
}

export interface TraderProfile {
    id: string;
    firmId: string;
    trades: Trade[];
    metrics: TraderMetrics;
    lastUpdated: string;
}

export interface FirmProfile {
    id: string;
    name: string;
    traders: TraderProfile[];
    aggregateMetrics: TraderMetrics;
}

export interface AnalysisRequest {
    scope: 'INDIVIDUAL' | 'GROUP' | 'FIRM';
    timeFrame: TimeFrame;
    traderIds?: string[];
    firmIds?: string[];
}