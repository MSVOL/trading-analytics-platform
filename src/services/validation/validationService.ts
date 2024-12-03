import { Trade, TraderProfile, FirmConfig } from '../../types/trading';
import { UploadError } from '../../types/upload';

export class ValidationService {
    static validateTraderProfile(
        profile: Partial<TraderProfile>, 
        firmConfig: FirmConfig
    ): UploadError[] {
        const errors: UploadError[] = [];

        // Validate basic profile data
        if (!profile.id) {
            errors.push({
                line: 0,
                field: 'id',
                message: 'Trader ID is required'
            });
        }

        // Validate trades
        if (profile.trades) {
            profile.trades.forEach((trade, index) => {
                const tradeErrors = this.validateTrade(trade, firmConfig);
                errors.push(...tradeErrors.map(error => ({
                    ...error,
                    line: index + 1
                })));
            });
        }

        return errors;
    }

    private static validateTrade(trade: Trade, firmConfig: FirmConfig): UploadError[] {
        const errors: UploadError[] = [];

        // Size validation
        if (trade.size > firmConfig.riskParameters.maxPositionSize) {
            errors.push({
                line: 0,
                field: 'size',
                message: `Position size exceeds maximum allowed (${firmConfig.riskParameters.maxPositionSize})`,
                value: trade.size
            });
        }

        // Trading hours validation
        const tradeTime = new Date(trade.entryTimestamp);
        const [startHour, startMinute] = firmConfig.tradingHours.start.split(':').map(Number);
        const [endHour, endMinute] = firmConfig.tradingHours.end.split(':').map(Number);

        if (
            tradeTime.getHours() < startHour || 
            (tradeTime.getHours() === startHour && tradeTime.getMinutes() < startMinute) ||
            tradeTime.getHours() > endHour ||
            (tradeTime.getHours() === endHour && tradeTime.getMinutes() > endMinute)
        ) {
            errors.push({
                line: 0,
                field: 'entryTimestamp',
                message: 'Trade outside allowed trading hours',
                value: trade.entryTimestamp
            });
        }

        return errors;
    }
}