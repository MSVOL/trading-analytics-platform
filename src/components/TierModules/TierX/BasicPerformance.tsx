import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@mui/material/styles';
import { useAnalytics } from '../../../context/AnalyticsContext';
import { TraderMetrics } from '../../../types/trading';

const BasicPerformance: React.FC = () => {
    const theme = useTheme();
    const { state } = useAnalytics();
    const trader = Array.from(state.traders.values())[0];

    const performanceData = React.useMemo(() => {
        if (!trader?.trades) return [];

        let cumPnL = 0;
        return [{
            id: 'Cumulative P&L',
            data: trader.trades.map(trade => {
                cumPnL += (trade.exitPrice - trade.entryPrice) * trade.size;
                return {
                    x: trade.exitTimestamp,
                    y: cumPnL
                };
            })
        }];
    }, [trader]);

    const metrics: Partial<TraderMetrics> = React.useMemo(() => {
        if (!trader?.trades.length) return {};

        const wins = trader.trades.filter(t => 
            (t.exitPrice - t.entryPrice) * (t.direction === 'LONG' ? 1 : -1) > 0
        ).length;

        return {
            winRate: wins / trader.trades.length,
            profitFactor: trader.metrics.profitFactor,
            sharpeRatio: trader.metrics.sharpeRatio
        };
    }, [trader]);

    if (!trader) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">Basic Performance Analysis</Typography>
                </Grid>

                {/* Quick Stats */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography color="textSecondary">Win Rate</Typography>
                        <Typography variant="h4" color={metrics.winRate! > 0.5 ? 'success.main' : 'error.main'}>
                            {(metrics.winRate! * 100).toFixed(1)}%
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography color="textSecondary">Profit Factor</Typography>
                        <Typography variant="h4" color={metrics.profitFactor! > 1 ? 'success.main' : 'error.main'}>
                            {metrics.profitFactor?.toFixed(2)}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography color="textSecondary">Sharpe Ratio</Typography>
                        <Typography variant="h4" color={metrics.sharpeRatio! > 1 ? 'success.main' : 'error.main'}>
                            {metrics.sharpeRatio?.toFixed(2)}
                        </Typography>
                    </Box>
                </Grid>

                {/* Performance Chart */}
                <Grid item xs={12}>
                    <Box sx={{ height: 400 }}>
                        <ResponsiveLine
                            data={performanceData}
                            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                            xScale={{
                                type: 'time',
                                format: '%Y-%m-%dT%H:%M:%S.%LZ',
                                useUTC: false,
                            }}
                            yScale={{
                                type: 'linear',
                            }}
                            axisLeft={{
                                legend: 'P&L ($)',
                                legendOffset: -40,
                            }}
                            axisBottom={{
                                format: '%b %d',
                                legendOffset: 36,
                                legendPosition: 'middle',
                            }}
                            enablePoints={false}
                            enableGridX={false}
                            curve="monotoneX"
                            animate={true}
                            theme={{
                                axis: {
                                    ticks: {
                                        text: {
                                            fill: theme.palette.text.primary,
                                        }
                                    }
                                }
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default BasicPerformance;