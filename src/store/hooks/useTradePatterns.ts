import { useMemo } from 'react';
import { Trade } from '../../types/trading';

interface Pattern {
    type: 'REVENGE' | 'OVERCONFIDENT' | 'HESITANT';
    confidence: number;
    trades: Trade[];
}

export const useTradePatterns = (trades: Trade[]) => {
    const patterns = useMemo(() => {
        const detected: Pattern[] = [];

        // Revenge Trading Detection
        const lossByHour = new Map<number, Trade[]>();
        trades.forEach(trade => {
            const hour = new Date(trade.entryTimestamp).getHours();
            const pnl = (trade.exitPrice - trade.entryPrice) * trade.size;
            if (pnl < 0) {
                const hourTrades = lossByHour.get(hour) || [];
                hourTrades.push(trade);
                lossByHour.set(hour, hourTrades);
            }
        });

        lossByHour.forEach((hourTrades) => {
            if (hourTrades.length >= 3) {
                detected.push({
                    type: 'REVENGE',
                    confidence: 0.8 + (hourTrades.length - 3) * 0.05,
                    trades: hourTrades
                });
            }
        });

        // Overconfidence Detection
        const windows = trades.reduce((acc, _, i) => {
            if (i < 5) return acc;
            return [...acc, trades.slice(i-5, i)];
        }, [] as Trade[][]);

        windows.forEach(window => {
            const wins = window.filter(t => 
                (t.exitPrice - t.entryPrice) * (t.direction === 'LONG' ? 1 : -1) > 0
            ).length;
            
            if (wins >= 4) {
                detected.push({
                    type: 'OVERCONFIDENT',
                    confidence: 0.7 + (wins/5) * 0.2,
                    trades: window
                });
            }
        });

        return detected;
    }, [trades]);

    return patterns;
};