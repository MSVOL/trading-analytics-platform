import React from 'react';
import { Paper, Grid, Typography, Box } from '@mui/material';
import { TrendChart } from '../../shared/TrendChart';
import { useAnalytics } from '../../../context/AnalyticsContext';
import { TradeAnalytics } from '../../../services/analytics/tradeAnalytics';

const RiskMetrics: React.FC = () => {
    const { state } = useAnalytics();
    const activeTrader = Array.from(state.traders.values())[0]; // Just for now, we'll make this selectable later

    const riskMetrics = React.useMemo(() => {
        if (!activeTrader?.trades.length) return null;
        return TradeAnalytics.analyzePerformance(activeTrader.trades);
    }, [activeTrader]);

    const equityCurveData = React.useMemo(() => {
        if (!activeTrader?.trades.length) return [];
        
        let cumPnL = 0;
        return [{
            id: 'Equity Curve',
            data: activeTrader.trades.map(trade => {
                cumPnL += (trade.exitPrice - trade.entryPrice) * trade.size;
                return {
                    x: trade.exitTimestamp,
                    y: cumPnL
                };
            })
        }];
    }, [activeTrader]);

    if (!riskMetrics) return <Typography>No data available</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Risk Profile
                    </Typography>
                </Grid>
                
                {/* Risk Metrics Cards */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography color="textSecondary" gutterBottom>
                            Sharpe Ratio
                        </Typography>
                        <Typography variant="h4">
                            {riskMetrics.metrics.performance.sharpeRatio.toFixed(2)}
                        </Typography>
                    </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography color="textSecondary" gutterBottom>
                            Max Drawdown
                        </Typography>
                        <Typography variant="h4" color="error">
                            {(riskMetrics.metrics.risk.maxDrawdown * 100).toFixed(2)}%
                        </Typography>
                    </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography color="textSecondary" gutterBottom>
                            Win Rate
                        </Typography>
                        <Typography variant="h4" color="success.main">
                            {(riskMetrics.metrics.performance.winRate * 100).toFixed(2)}%
                        </Typography>
                    </Box>
                </Grid>

                {/* Equity Curve */}
                <Grid item xs={12}>
                    <Box sx={{ height: 400 }}>
                        <TrendChart 
                            data={equityCurveData}
                            yAxisLabel="P&L ($)"
                            xAxisLabel="Time"
                        />
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default RiskMetrics;