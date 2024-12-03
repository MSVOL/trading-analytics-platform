import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { useTheme } from '@mui/material/styles';
import { useAnalytics } from '../../../context/AnalyticsContext';

interface CapitalAllocation {
    name: string;
    children: Array<{
        name: string;
        size: number;
        efficiency: number;
    }>;
}

const CapitalModule: React.FC = () => {
    const theme = useTheme();
    const { state } = useAnalytics();
    const traders = Array.from(state.traders.values());

    const capitalData: CapitalAllocation = React.useMemo(() => ({
        name: 'Capital Allocation',
        children: traders.map(trader => {
            const totalCapital = trader.trades.reduce((sum, trade) => 
                sum + Math.abs(trade.size * trade.entryPrice), 0);
            const efficiency = trader.metrics.profitFactor * (1 - trader.metrics.maxDrawdown);
            
            return {
                name: `Trader ${trader.id}`,
                size: totalCapital,
                efficiency
            };
        })
    }), [traders]);

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">Capital Management</Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography color="textSecondary">Total Capital Deployed</Typography>
                        <Typography variant="h4">
                            ${capitalData.children.reduce((sum, t) => sum + t.size, 0).toFixed(2)}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ height: 400 }}>
                        <ResponsiveTreeMap
                            data={capitalData}
                            identity="name"
                            value="size"
                            valueFormat=">-$.2f"
                            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                            labelSkipSize={12}
                            labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
                            parentLabelPosition="left"
                            parentLabelTextColor={{
                                from: 'color',
                                modifiers: [['darker', 2]]
                            }}
                            borderColor={{ from: 'color', modifiers: [['darker', 0.1]] }}
                            colors={{ scheme: 'blues' }}
                            nodeOpacity={0.85}
                            borderWidth={2}
                            theme={{
                                labels: {
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

export default CapitalModule;