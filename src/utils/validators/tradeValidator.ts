import { Trade, Direction } from '../../types/trading';

export class TradeValidator {
    static validateTrade(trade: Partial<Trade>): string[] {
        const errors: string[] = [];

        // Required fields
        if (!trade.entryPrice) errors.push('Entry price is required');
        if (!trade.exitPrice) errors.push('Exit price is required');
        if (!trade.size) errors.push('Size is required');
        if (!trade.direction) errors.push('Direction is required');
        if (!trade.entryTimestamp) errors.push('Entry timestamp is required');
        if (!trade.exitTimestamp) errors.push('Exit timestamp is required');

        // Type validations
        if (typeof trade.entryPrice !== 'number') errors.push('Entry price must be a number');
        if (typeof trade.exitPrice !== 'number') errors.push('Exit price must be a number');
        if (typeof trade.size !== 'number') errors.push('Size must be a number');
        if (!['LONG', 'SHORT'].includes(trade.direction as Direction)) {
            errors.push('Direction must be either LONG or SHORT');
        }

        // Business logic validations
        if (trade.entryPrice && trade.entryPrice <= 0) {
            errors.push('Entry price must be positive');
        }
        if (trade.exitPrice && trade.exitPrice <= 0) {
            errors.push('Exit price must be positive');
        }
        if (trade.size && trade.size <= 0) {
            errors.push('Size must be positive');
        }

        // Timestamp validations
        if (trade.entryTimestamp && trade.exitTimestamp) {
            const entry = new Date(trade.entryTimestamp);
            const exit = new Date(trade.exitTimestamp);
            if (isNaN(entry.getTime())) errors.push('Invalid entry timestamp');
            if (isNaN(exit.getTime())) errors.push('Invalid exit timestamp');
            if (entry > exit) errors.push('Entry time must be before exit time');
        }

        return errors;
    }

    static validateBatch(trades: Partial<Trade>[]): Map<number, string[]> {
        const errors = new Map<number, string[]>();
        trades.forEach((trade, index) => {
            const tradeErrors = this.validateTrade(trade);
            if (tradeErrors.length > 0) {
                errors.set(index, tradeErrors);
            }
        });
        return errors;
    }
}