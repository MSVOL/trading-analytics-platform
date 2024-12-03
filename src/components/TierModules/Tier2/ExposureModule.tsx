import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { useTheme } from '@mui/material/styles';
import { useAnalytics } from '../../../context/AnalyticsContext';

interface ExposureData {
    symbol: string;
    long: number;
    short: number;
    net: number;
}

const ExposureModule: React.FC = () => {
    const theme = useTheme();
    const { state } = useAnalytics();
    const traders = Array.from(state.traders.values());

    const exposureData = React.useMemo((): ExposureData[] => {
        const exposureMap = new Map<string, ExposureData>();

        traders.forEach(trader => {
            trader.trades.forEach(trade => {
                const current = exposureMap.get(trade.symbol) || {
                    symbol: trade.symbol,
                    long: 0,
                    short: 0,
                    net: 0
                };

                const exposure = trade.size * trade.exitPrice;
                if (trade.direction === 'LONG') {
                    current.long += exposure;
                } else {
                    current.short += exposure;
                }
                current.net = current.long - current.short;

                exposureMap.set(trade.symbol, current);
            });
        });

        return Array.from(exposureMap.values());
    }, [traders]);

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">Exposure Analysis</Typography>
                </Grid>

                {/* Net Exposure Summary */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography color="textSecondary">Net Exposure</Typography>
                        <Typography variant="h4">
                            ${exposureData.reduce((sum, exp) => sum + exp.net, 0).toFixed(2)}
                        </Typography>
                    </Box>
                </Grid>

                {/* Exposure Bar Chart */}
                <Grid item xs={12}>
                    <Box sx={{ height: 400 }}>
                        <ResponsiveBar
                            data={exposureData}
                            keys={['long', 'short']}
                            indexBy="symbol"
                            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                            padding={0.3}
                            valueScale={{ type: 'linear' }}
                            indexScale={{ type: 'band', round: true }}
                            colors={[theme.palette.success.main, theme.palette.error.main]}
                            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Symbol',
                                legendPosition: 'middle',
                                legendOffset: 32
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Exposure ($)',
                                legendPosition: 'middle',
                                legendOffset: -40
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{
                                from: 'color',
                                modifiers: [['darker', 1.6]]
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
                                    symbolSize: 20
                                }
                            ]}
                            theme={{
                                axis: {
                                    ticks: {
                                        text: {
                                            fill: theme.palette.text.primary
                                        }
                                    },
                                    legend: {
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

export default ExposureModule;