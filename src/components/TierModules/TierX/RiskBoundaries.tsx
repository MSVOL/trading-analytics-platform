import React from 'react';
import { Grid, Paper, Typography, Box, Alert, LinearProgress } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { useTheme } from '@mui/material/styles';
import { useAnalytics } from '../../../context/AnalyticsContext';

interface RiskLimit {
    metric: string;
    current: number;
    limit: number;
    usage: number;
}

const RiskBoundaries: React.FC = () => {
    const theme = useTheme();
    const { state } = useAnalytics();
    const trader = Array.from(state.traders.values())[0];

    const riskLimits = React.useMemo((): RiskLimit[] => {
        if (!trader?.trades.length) return [];

        const dailyPnL = trader.trades.reduce((acc, trade) => {
            const date = trade.exitTimestamp.split('T')[0];
            const pnl = (trade.exitPrice - trade.entryPrice) * trade.size;
            acc[date] = (acc[date] || 0) + pnl;
            return acc;
        }, {} as Record<string, number>);

        const maxDrawdown = Math.min(...Object.values(dailyPnL));
        const maxDailyLoss = Math.min(...Object.values(dailyPnL));
        const maxPositionSize = Math.max(...trader.trades.map(t => Math.abs(t.size)));

        return [
            {
                metric: 'Daily Loss',
                current: Math.abs(maxDailyLoss),
                limit: 5000,
                usage: Math.abs(maxDailyLoss) / 5000
            },
            {
                metric: 'Drawdown',
                current: Math.abs(maxDrawdown),
                limit: 10000,
                usage: Math.abs(maxDrawdown) / 10000
            },
            {
                metric: 'Position Size',
                current: maxPositionSize,
                limit: 100,
                usage: maxPositionSize / 100
            }
        ];
    }, [trader]);

    const barData = React.useMemo(() => 
        riskLimits.map(limit => ({
            metric: limit.metric,
            Current: limit.current,
            Limit: limit.limit,
        }))
    , [riskLimits]);

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">Risk Boundaries</Typography>
                </Grid>

                {/* Risk Limit Progress Bars */}
                {riskLimits.map((limit) => (
                    <Grid item xs={12} key={limit.metric}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                {limit.metric} Usage
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={limit.usage * 100}
                                color={limit.usage > 0.8 ? 'error' : limit.usage > 0.6 ? 'warning' : 'primary'}
                                sx={{ height: 10, borderRadius: 5 }}
                            />
                            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption">
                                    Current: ${limit.current.toFixed(2)}
                                </Typography>
                                <Typography variant="caption">
                                    Limit: ${limit.limit.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                ))}

                {/* Warnings */}
                {riskLimits.some(limit => limit.usage > 0.8) && (
                    <Grid item xs={12}>
                        <Alert severity="error">
                            Critical risk limit breach detected!
                        </Alert>
                    </Grid>
                )}

                {/* Risk Comparison Chart */}
                <Grid item xs={12}>
                    <Box sx={{ height: 400 }}>
                        <ResponsiveBar
                            data={barData}
                            keys={['Current', 'Limit']}
                            indexBy="metric"
                            groupMode="grouped"
                            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                            padding={0.3}
                            valueScale={{ type: 'linear' }}
                            colors={[theme.palette.error.main, theme.palette.success.main]}
                            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            theme={{
                                axis: {
                                    ticks: {
                                        text: {
                                            fill: theme.palette.text.primary
                                        }
                                    }
                                }
                            }}
                            legends={[
                                {
                                    dataFrom: 'keys',
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 120,
                                    translateY: 0,
                                    itemsSpacing: 2,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 0.85,
                                    symbolSize: 20,
                                }
                            ]}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default RiskBoundaries;