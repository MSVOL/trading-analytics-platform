import { TradeAnalytics } from '../tradeAnalytics';
import { Trade } from '../../../types/trading';

describe('TradeAnalytics', () => {
    const mockTrades: Trade[] = [
        {
            id: '1',
            entryPrice: 100,
            exitPrice: 110,
            size: 1,
            direction: 'LONG',
            entryTimestamp: '2024-01-01T10:00:00Z',
            exitTimestamp: '2024-01-01T11:00:00Z',
            symbol: 'TEST'
        },
        {
            id: '2',
            entryPrice: 110,
            exitPrice: 100,
            size: 1,
            direction: 'LONG',
            entryTimestamp: '2024-01-01T12:00:00Z',
            exitTimestamp: '2024-01-01T13:00:00Z',
            symbol: 'TEST'
        }
    ];

    it('calculates performance metrics correctly', () => {
        const result = TradeAnalytics.analyzePerformance(mockTrades);
        expect(result.metrics.performance.winRate).toBeCloseTo(0.5);
        expect(result.metrics.performance.totalPnL).toBe(0);
    });

    it('handles empty trade array', () => {
        const result = TradeAnalytics.analyzePerformance([]);
        expect(result.metrics.performance.winRate).toBe(0);
        expect(result.metrics.risk.maxDrawdown).toBe(0);
    });

    it('calculates correct drawdown', () => {
        const drawdownTrades: Trade[] = [
            ...mockTrades,
            {
                id: '3',
                entryPrice: 100,
                exitPrice: 80,
                size: 1,
                direction: 'LONG',
                entryTimestamp: '2024-01-01T14:00:00Z',
                exitTimestamp: '2024-01-01T15:00:00Z',
                symbol: 'TEST'
            }
        ];
        const result = TradeAnalytics.analyzePerformance(drawdownTrades);
        expect(result.metrics.risk.maxDrawdown).toBeGreaterThan(0);
    });
});