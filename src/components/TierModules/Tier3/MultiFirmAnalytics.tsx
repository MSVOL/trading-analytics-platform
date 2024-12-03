import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { ResponsiveRadar } from '@nivo/radar';
import { useTheme } from '@mui/material/styles';
import { useAnalytics } from '../../../context/AnalyticsContext';
import type { FirmProfile } from '../../../types/trading';

interface RadarMetric {
    metric: string;
    [key: string]: number | string;  // Firm IDs as keys
}

const MultiFirmAnalytics: React.FC = () => {
    const theme = useTheme();
    const { state } = useAnalytics();
    const firms = Array.from(state.firms.values());

    const radarData = React.useMemo((): RadarMetric[] => {
        const metrics = [
            'winRate',
            'sharpeRatio',
            'profitFactor',
            'capitalEfficiency',
            'riskScore'
        ];

        return metrics.map(metric => ({
            metric,
            ...firms.reduce((acc, firm) => ({
                ...acc,
                [firm.name]: calculateFirmMetric(firm, metric)
            }), {})
        }));
    }, [firms]);

    // Normalized scoring function for fair comparison
    const calculateFirmMetric = (firm: FirmProfile, metric: string): number => {
        const traders = firm.traders;
        switch(metric) {
            case 'winRate':
                return traders.reduce((sum, t) => sum + t.metrics.winRate, 0) / traders.length;
            case 'sharpeRatio':
                return traders.reduce((sum, t) => sum + t.metrics.sharpeRatio, 0) / traders.length;
            case 'profitFactor':
                return traders.reduce((sum, t) => sum + t.metrics.profitFactor, 0) / traders.length;
            case 'capitalEfficiency':
                // Custom capital efficiency calculation
                return traders.reduce((sum, t) => 
                    sum + (t.metrics.totalTrades > 0 ? 
                        t.metrics.profitableTrades / t.metrics.totalTrades : 0), 0) / traders.length;
            case 'riskScore':
                // Composite risk score calculation
                return traders.reduce((sum, t) => 
                    sum + (1 - t.metrics.maxDrawdown) * t.metrics.sharpeRatio, 0) / traders.length;
            default:
                return 0;
        }
    };

    if (firms.length < 2) {
        return (
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography>Need at least two firms for comparison</Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">Multi-Firm Performance Analysis</Typography>
                </Grid>

                {/* Radar Chart */}
                <Grid item xs={12}>
                    <Box sx={{ height: 500 }}>
                        <ResponsiveRadar
                            data={radarData}
                            keys={firms.map(f => f.name)}
                            indexBy="metric"
                            maxValue="auto"
                            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                            curve="linearClosed"
                            borderWidth={2}
                            borderColor={{ from: 'color' }}
                            gridLevels={5}
                            gridShape="circular"
                            gridLabelOffset={36}
                            enableDots={true}
                            dotSize={8}
                            dotColor={{ theme: 'background' }}
                            dotBorderWidth={2}
                            dotBorderColor={{ from: 'color' }}
                            enableDotLabel={true}
                            dotLabel="value"
                            dotLabelYOffset={-12}
                            colors={{ scheme: 'nivo' }}
                            fillOpacity={0.25}
                            blendMode="multiply"
                            animate={true}
                            motionConfig="wobbly"
                            isInteractive={true}
                            theme={{
                                axis: {
                                    ticks: {
                                        text: {
                                            fill: theme.palette.text.primary
                                        }
                                    }
                                },
                                dots: {
                                    text: {
                                        fill: theme.palette.text.primary
                                    }
                                },
                                legends: {
                                    text: {
                                        fill: theme.palette.text.primary
                                    }
                                }
                            }}
                            legends={[
                                {
                                    anchor: 'top-left',
                                    direction: 'column',
                                    translateX: -50,
                                    translateY: -40,
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    itemTextColor: theme.palette.text.primary,
                                    symbolSize: 12,
                                    symbolShape: 'circle',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: theme.palette.primary.main
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default MultiFirmAnalytics;