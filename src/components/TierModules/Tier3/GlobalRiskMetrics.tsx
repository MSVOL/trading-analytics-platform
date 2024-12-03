import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { ResponsiveCalendar } from '@nivo/calendar';
import { ResponsiveNetwork } from '@nivo/network';
import { useTheme } from '@mui/material/styles';
import { useAnalytics } from '../../../context/AnalyticsContext';

interface RiskNode {
    id: string;
    radius: number;
    color: string;
}

interface RiskLink {
    source: string;
    target: string;
    distance: number;
}

const GlobalRiskMetrics: React.FC = () => {
    const theme = useTheme();
    const { state } = useAnalytics();
    const firms = Array.from(state.firms.values());

    const networkData = React.useMemo(() => {
        const nodes: RiskNode[] = [];
        const links: RiskLink[] = [];

        firms.forEach(firm => {
            // Create nodes for firms
            nodes.push({
                id: firm.name,
                radius: Math.sqrt(firm.traders.length) * 5,
                color: theme.palette.primary.main
            });

            // Create links between firms based on strategy similarity
            firms.forEach(otherFirm => {
                if (firm.id !== otherFirm.id) {
                    const correlation = calculateFirmCorrelation(firm, otherFirm);
                    if (correlation > 0.5) {
                        links.push({
                            source: firm.name,
                            target: otherFirm.name,
                            distance: 200 * (1 - correlation)
                        });
                    }
                }
            });
        });

        return { nodes, links };
    }, [firms, theme]);

    const calendarData = React.useMemo(() => {
        const allTrades = firms.flatMap(firm => 
            firm.traders.flatMap(trader => trader.trades)
        );

        const dailyRisk = allTrades.reduce((acc, trade) => {
            const date = trade.exitTimestamp.split('T')[0];
            const pnl = (trade.exitPrice - trade.entryPrice) * trade.size;
            acc[date] = (acc[date] || 0) + Math.abs(pnl);
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(dailyRisk).map(([day, value]) => ({
            day,
            value: Math.log(value)
        }));
    }, [firms]);

    const calculateFirmCorrelation = (firm1: typeof firms[0], firm2: typeof firms[0]): number => {
        // Complex correlation calculation based on trading patterns
        return Math.random(); // Placeholder
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">Global Risk Network</Typography>
                </Grid>

                {/* Systemic Risk Network */}
                <Grid item xs={12}>
                    <Box sx={{ height: 400 }}>
                        <ResponsiveNetwork
                            data={networkData}
                            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                            linkDistance={link => link.distance}
                            centeringStrength={0.3}
                            repulsivity={6}
                            nodeSize={node => node.radius}
                            activeNodeSize={node => node.radius * 1.4}
                            nodeColor={node => node.color}
                            nodeBorderWidth={1}
                            nodeBorderColor={{
                                from: 'color',
                                modifiers: [['darker', 0.8]]
                            }}
                            linkThickness={link => 2}
                            linkBlendMode="multiply"
                            motionConfig="gentle"
                        />
                    </Box>
                </Grid>

                {/* Risk Calendar */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Risk Intensity Calendar</Typography>
                    <Box sx={{ height: 200 }}>
                        <ResponsiveCalendar
                            data={calendarData}
                            from={calendarData[0]?.day}
                            to={calendarData[calendarData.length - 1]?.day}
                            emptyColor="#eeeeee"
                            colors={[
                                theme.palette.info.light,
                                theme.palette.info.main,
                                theme.palette.warning.main,
                                theme.palette.error.main
                            ]}
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                            yearSpacing={40}
                            monthBorderColor="#ffffff"
                            dayBorderWidth={2}
                            dayBorderColor="#ffffff"
                            legends={[
                                {
                                    anchor: 'bottom-right',
                                    direction: 'row',
                                    translateY: 36,
                                    itemCount: 4,
                                    itemWidth: 42,
                                    itemHeight: 36,
                                    itemsSpacing: 14,
                                    itemDirection: 'right-to-left'
                                }
                            ]}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default GlobalRiskMetrics;
