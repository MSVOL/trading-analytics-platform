import { Trade, TraderMetrics, AnalyticsResult } from '../../types/trading';

export class TradeAnalytics {
    static readonly ANNUAL_TRADING_DAYS = 252;

    static analyzePerformance(trades: Trade[]): AnalyticsResult {
        const sortedTrades = [...trades].sort((a, b) => 
            new Date(a.exitTimestamp).getTime() - new Date(b.exitTimestamp).getTime()
        );

        const returns = this.calculateReturns(sortedTrades);
        const metrics = this.calculateMetrics(returns);
        const behavior = this.analyzeBehavior(sortedTrades);

        return {
            type: 'INDIVIDUAL',
            timestamp: new Date().toISOString(),
            metrics: {
                performance: {
                    totalPnL: trades.reduce((sum, t) => sum + (t.pnL || 0), 0),
                    winRate: metrics.winRate,
                    sharpeRatio: metrics.sharpeRatio
                },
                risk: {
                    currentDrawdown: this.calculateCurrentDrawdown(sortedTrades),
                    maxDrawdown: metrics.maxDrawdown,
                    dailyVar: this.calculateVaR(returns, 0.95)
                },
                behavior: {
                    averageHoldingTime: behavior.avgHoldingTime,
                    tradeFrequency: behavior.frequency,
                    consistencyScore: behavior.consistency
                }
            }
        };
    }

    private static calculateReturns(trades: Trade[]): number[] {
        return trades.map(trade => {
            const direction = trade.direction === 'LONG' ? 1 : -1;
            return ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * direction;
        });
    }

    private static calculateVaR(returns: number[], confidence: number): number {
        const sortedReturns = [...returns].sort((a, b) => a - b);
        const index = Math.floor(returns.length * (1 - confidence));
        return -sortedReturns[index];
    }

    private static analyzeBehavior(trades: Trade[]): {
        avgHoldingTime: number;
        frequency: number;
        consistency: number;
    } {
        // Actual behavior analysis logic here
        return {
            avgHoldingTime: 0,
            frequency: 0,
            consistency: 0
        };
    }
}