import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TradeAnalytics } from '../../services/analytics/tradeAnalytics';
import { setTraderData, setFirmData, setError } from '../slices/analyticsSlice';
import { Trade, TraderProfile, FirmProfile } from '../../types/trading';

export const useAnalytics = () => {
    const dispatch = useDispatch();
    const traders = useSelector((state: any) => state.analytics.traders);
    const firms = useSelector((state: any) => state.analytics.firms);

    const analyzeTrades = useCallback(async (trades: Trade[], traderId: string) => {
        try {
            const metrics = await TradeAnalytics.analyzePerformance(trades);
            dispatch(setTraderData({
                id: traderId,
                trades,
                metrics: metrics.metrics,
                lastUpdated: new Date().toISOString()
            }));
        } catch (error) {
            dispatch(setError(error instanceof Error ? error.message : 'Analysis failed'));
        }
    }, [dispatch]);

    const compareFirms = useCallback((firmIds: string[]) => {
        const firmData = firmIds
            .map(id => firms.get(id))
            .filter(Boolean) as FirmProfile[];
        
        return firmData.map(firm => ({
            name: firm.name,
            metrics: {
                avgWinRate: firm.traders.reduce((acc, t) => acc + t.metrics.winRate, 0) / firm.traders.length,
                avgSharpe: firm.traders.reduce((acc, t) => acc + t.metrics.sharpeRatio, 0) / firm.traders.length,
                totalPnL: firm.traders.reduce((acc, t) => 
                    acc + t.trades.reduce((sum, trade) => 
                        sum + (trade.exitPrice - trade.entryPrice) * trade.size, 0
                    ), 0
                )
            }
        }));
    }, [firms]);

    const getFirmMetrics = useCallback((firmId: string) => {
        const firm = firms.get(firmId);
        if (!firm) return null;

        const trades = firm.traders.flatMap(t => t.trades);
        return TradeAnalytics.analyzePerformance(trades);
    }, [firms]);

    return {
        traders,
        firms,
        analyzeTrades,
        compareFirms,
        getFirmMetrics
    };
};