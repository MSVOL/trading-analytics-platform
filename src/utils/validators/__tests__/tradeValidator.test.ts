import { TradeValidator } from '../tradeValidator';
import { Trade } from '../../../types/trading';

describe('TradeValidator', () => {
    const validTrade: Trade = {
        id: '1',
        entryPrice: 100,
        exitPrice: 110,
        size: 1,
        direction: 'LONG',
        entryTimestamp: '2024-01-01T10:00:00Z',
        exitTimestamp: '2024-01-01T11:00:00Z',
        symbol: 'TEST'
    };

    it('validates correct trade data', () => {
        const errors = TradeValidator.validateTrade(validTrade);
        expect(errors).toHaveLength(0);
    });

    it('catches missing required fields', () => {
        const invalidTrade = { ...validTrade, entryPrice: undefined };
        const errors = TradeValidator.validateTrade(invalidTrade);
        expect(errors).toContain('Entry price is required');
    });

    it('validates timestamp order', () => {
        const invalidTrade = {
            ...validTrade,
            entryTimestamp: '2024-01-01T12:00:00Z',
            exitTimestamp: '2024-01-01T11:00:00Z'
        };
        const errors = TradeValidator.validateTrade(invalidTrade);
        expect(errors).toContain('Entry time must be before exit time');
    });

    it('validates batch trades correctly', () => {
        const trades = [validTrade, { ...validTrade, size: -1 }];
        const errors = TradeValidator.validateBatch(trades);
        expect(errors.size).toBe(1);
        expect(errors.get(1)).toContain('Size must be positive');
    });
});