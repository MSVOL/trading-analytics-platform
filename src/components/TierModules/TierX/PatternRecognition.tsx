import React from 'react';
import { Grid, Paper, Typography, Box, Chip, Alert } from '@mui/material';
import { ResponsiveRadar, ResponsiveScatterPlot } from '@nivo/radar';
import { useTheme } from '@mui/material/styles';
import { useAnalytics } from '../../../context/AnalyticsContext';

interface Pattern {
    name: string;
    confidence: number;
    type: 'RISK' | 'BEHAVIOR' | 'OPPORTUNITY';
    description: string;
}

interface BehaviorMetric {
    dimension: string;
    value: number;
}

const PatternRecognition: React.FC = () => {
    const theme = useTheme();
    const { state } = useAnalytics();
    const trader = Array.from(state.traders.values())[0];

    const patterns = React.useMemo((): Pattern[] => {
        if (!trader?.trades.length) return [];

        const patterns: Pattern[] = [];
        const trades = trader.trades;

        // Revenge Trading Detection
        const lossesByHour = trades.reduce((acc, trade) => {
            const hour = new Date(trade.entryTimestamp).getHours();
            const pnl = (trade.exitPrice - trade.entryPrice) * trade.size;
            if (pnl < 0) {
                acc[hour] = (acc[hour] || 0) + 1;
            }
            return acc;
        }, {} as Record<number, number>);

        if (Object.values(lossesByHour).some(count => count > 3)) {
            patterns.push({
                name: 'Potential Revenge Trading',
                confidence: 0.85,
                type: 'RISK',
                description: 'Multiple losses in short time periods detected'
            });
        }

        // Size Escalation Pattern
        const sizeProgression = trades.map(t => Math.abs(t.size));
        const sizeEscalation = sizeProgression.some((size, i) => 
            i > 0 && size > sizeProgression[i-1] * 2
        );

        if (sizeEscalation) {
            patterns.push({
                name: 'Position Size Escalation',
                confidence: 0.92,
                type: 'RISK',
                description: 'Dramatic increase in position sizing detected'
            });
        }

        // Winner's Tilt Detection
        const recentWins = trades.slice(-5).filter(t => 
            (t.exitPrice - t.entryPrice) * (t.direction === 'LONG' ? 1 : -1) > 0
        ).length;

        if (recentWins >= 4) {
            patterns.push({
                name: 'Potential Overconfidence',
                confidence: 0.78,
                type: 'BEHAVIOR',
                description: 'High win rate may lead to overconfidence'
            });
        }

        return patterns;
    }, [trader]);

    const behaviorMetrics: BehaviorMetric[] = React.useMemo(() => {
        if (!trader?.trades.length) return [];

        const trades = trader.trades;
        const avgHoldingTime = trades.reduce((sum, t) => 
            sum + (new Date(t.exitTimestamp).getTime() - new Date(t.entryTimestamp).getTime()),
            0
        ) / trades.length / (1000 * 60 * 60); // Convert to hours

        return [
            {
                dimension: 'Risk Management',
                value: trader.metrics.sharpeRatio / 3 // Normalized to 0-1
            },
            {
                dimension: 'Consistency',
                value: Math.min(1, trader.metrics.profitFactor / 2)
            },
            {
                dimension: 'Discipline',
                value: 1 - Math.min(1, trader.metrics.maxDrawdown / 0.2)
            },
            {
                dimension: 'Timing',
                value: Math.min(1, avgHoldingTime / 24)
            },
            {
                dimension: 'Adaptability',
                value: Math.min(1, trader.metrics.winRate)
            }
        ];
    }, [trader]);

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">Pattern Recognition</Typography>
                </Grid>

                {/* Pattern Alerts */}
                <Grid item xs={12}>
                    {patterns.map((pattern, index) => (
                        <Alert 
                            key={index}
                            severity={pattern.type === 'RISK' ? 'error' : 'warning'}
                            sx={{ mb: 2 }}
                            action={
                                <Chip 
                                    label={`${(pattern.confidence * 100).toFixed()}% confidence`}
                                    color={pattern.confidence > 0.9 ? 'error' : 'warning'}
                                />
                            }
                        >
                            <Typography variant="subtitle2">{pattern.name}</Typography>
                            <Typography variant="body2">{pattern.description}</Typography>
                        </Alert>
                    ))}
                </Grid>

                {/* Behavior Radar */}
                <Grid item xs={12}>
                    <Box sx={{ height: 400 }}>
                        <ResponsiveRadar
                            data={[{
                                ...behaviorMetrics.reduce((acc, metric) => ({
                                    ...acc,
                                    [metric.dimension]: metric.value
                                }), {})
                            }]}
                            keys={behaviorMetrics.map(m => m.dimension)}
                            indexBy="dimension"
                            maxValue={1}
                            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                            curve="linearClosed"
                            borderWidth={2}
                            borderColor={{ from: 'color' }}
                            gridLevels={5}
                            gridShape="circular"
                            theme={{
                                axis: {
                                    ticks: {
                                        text: {
                                            fill: theme.palette.text.primary
                                        }
                                    }
                                }
                            }}
                            fillOpacity={0.25}
                            blendMode="multiply"
                            animate={true}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default PatternRecognition;
