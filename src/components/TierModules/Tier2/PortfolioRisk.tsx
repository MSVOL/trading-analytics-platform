import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { useTheme } from '@mui/material/styles';
import { useAnalytics } from '../../../context/AnalyticsContext';
import { TradeAnalytics } from '../../../services/analytics/tradeAnalytics';

interface CorrelationData {
    id: string;
    data: Array<{
        x: string;
        y: number;
    }>;
}

const PortfolioRisk: React.FC = () => {
    const theme = useTheme();
    const { state } = useAnalytics();
    const traders = Array.from(state.traders.values());

    const correlationData = React.useMemo((): CorrelationData[] => {
        if (traders.length < 2) return [];

        const returns = traders.map(trader => ({
            id: trader.id,
            returns: TradeAnalytics.getReturns(trader.trades)
        }));

        return returns.map(trader1 => ({
            id: trader1.id,
            data: returns.map(trader2 => ({
                x: trader2.id,
                y: TradeAnalytics.calculateCorrelation(
                    trader1.returns,
                    trader2.returns
                )
            }))
        }));
    }, [traders]);

    const portfolioMetrics = React.useMemo(() => {
        if (!traders.length) return null;
        
        const allTrades = traders.flatMap(t => t.trades);
        return TradeAnalytics.analyzePerformance(allTrades);
    }, [traders]);

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">Portfolio Risk Analysis</Typography>
                </Grid>

                {/* Portfolio Metrics */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography color="textSecondary">Portfolio VaR (95%)</Typography>
                        <Typography variant="h4" color="error">
                            ${portfolioMetrics?.metrics.risk.dailyVar.toFixed(2)}
                        </Typography>
                    </Box>
                </Grid>

                {/* Correlation Heatmap */}
                <Grid item xs={12}>
                    <Box sx={{ height: 400 }}>
                        <ResponsiveHeatMap
                            data={correlationData}
                            margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
                            valueFormat=">-.2f"
                            axisTop={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: -45,
                                legend: '',
                                legendOffset: 46
                            }}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: -45,
                                legend: '',
                                legendOffset: 46
                            }}
                            colors={{
                                type: 'diverging',
                                scheme: 'red_yellow_blue',
                                divergeAt: 0.5,
                                minValue: -1,
                                maxValue: 1
                            }}
                            emptyColor="#555555"
                            legends={[
                                {
                                    anchor: 'bottom',
                                    translateX: 0,
                                    translateY: 30,
                                    length: 400,
                                    thickness: 8,
                                    direction: 'row',
                                    tickPosition: 'after',
                                    tickSize: 3,
                                    tickSpacing: 4,
                                    tickOverlap: false,
                                    title: 'Correlation →',
                                    titleAlign: 'start',
                                    titleOffset: 4
                                }
                            ]}
                            theme={{
                                axis: {
                                    ticks: {
                                        text: {
                                            fill: theme.palette.text.primary
                                        }
                                    }
                                },
                                legends: {
                                    text: {
                                        fill: theme.palette.text.primary
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

export default PortfolioRisk;