import { Trade, TraderMetrics, TimeFrame } from '../types/trading';

export class AnalysisService {
    private static calculateReturns(trades: Trade[]): number[] {
        return trades.map(trade => {
            const multiplier = trade.direction === 'LONG' ? 1 : -1;
            return ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * multiplier;
        });
    }

    static calculateMetrics(trades: Trade[]): TraderMetrics {
        const returns = this.calculateReturns(trades);
        const profitableTrades = trades.filter(t => 
            (t.direction === 'LONG' && t.exitPrice > t.entryPrice) ||
            (t.direction === 'SHORT' && t.exitPrice < t.entryPrice)
        );

        const wins = profitableTrades.length;
        const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
        const stdDev = Math.sqrt(
            returns.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (returns.length - 1)
        );

        return {
            winRate: wins / trades.length,
            profitFactor: Math.abs(
                profitableTrades.reduce((sum, t) => sum + Math.abs(t.pnl || 0), 0) /
                trades.filter(t => !profitableTrades.includes(t))
                    .reduce((sum, t) => sum + Math.abs(t.pnl || 0), 0)
            ),
            sharpeRatio: mean / stdDev * Math.sqrt(252), // Annualized
            maxDrawdown: this.calculateMaxDrawdown(trades),
            averageWin: profitableTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / wins,
            averageLoss: trades.filter(t => !profitableTrades.includes(t))
                .reduce((sum, t) => sum + (t.pnl || 0), 0) / (trades.length - wins),
            totalTrades: trades.length,
            profitableTrades: wins
        };
    }

    private static calculateMaxDrawdown(trades: Trade[]): number {
        const equity = trades.reduce((acc, trade) => {
            acc.push((acc[acc.length - 1] || 0) + (trade.pnl || 0));
            return acc;
        }, [] as number[]);

        let maxDrawdown = 0;
        let peak = equity[0];

        for (const value of equity) {
            if (value > peak) peak = value;
            const drawdown = (peak - value) / peak;
            if (drawdown > maxDrawdown) maxDrawdown = drawdown;
        }

        return maxDrawdown;
    }
}