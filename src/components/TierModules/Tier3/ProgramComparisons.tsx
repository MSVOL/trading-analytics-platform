import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { ResponsiveSankey } from '@nivo/sankey';
import { useTheme } from '@mui/material/styles';
import { useAnalytics } from '../../../context/AnalyticsContext';

interface SankeyNode {
    id: string;
    nodeColor: string;
}

interface SankeyLink {
    source: string;
    target: string;
    value: number;
}

const ProgramComparisons: React.FC = () => {
    const theme = useTheme();
    const { state } = useAnalytics();
    const firms = Array.from(state.firms.values());

    const { nodes, links } = React.useMemo(() => {
        const sankeyNodes: SankeyNode[] = [];
        const sankeyLinks: SankeyLink[] = [];

        // Stages in trader journey
        const stages = ['Evaluation', 'Funded', 'Profitable'];
        
        firms.forEach(firm => {
            stages.forEach(stage => {
                sankeyNodes.push({
                    id: `${firm.name}-${stage}`,
                    nodeColor: theme.palette.primary.main
                });
            });

            // Calculate transitions
            const traderCount = firm.traders.length;
            const fundedCount = firm.traders.filter(t => t.metrics.profitFactor > 1).length;
            const profitableCount = firm.traders.filter(t => 
                t.metrics.profitFactor > 1.5 && t.metrics.sharpeRatio > 1
            ).length;

            sankeyLinks.push(
                {
                    source: `${firm.name}-Evaluation`,
                    target: `${firm.name}-Funded`,
                    value: fundedCount
                },
                {
                    source: `${firm.name}-Funded`,
                    target: `${firm.name}-Profitable`,
                    value: profitableCount
                }
            );
        });

        return { nodes: sankeyNodes, links: sankeyLinks };
    }, [firms, theme]);

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">Program Success Flow</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ height: 500 }}>
                        <ResponsiveSankey
                            data={{
                                nodes,
                                links
                            }}
                            margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
                            align="justify"
                            colors={{ scheme: 'category10' }}
                            nodeOpacity={1}
                            nodeHoverOthersOpacity={0.35}
                            nodeThickness={18}
                            nodeSpacing={24}
                            nodeBorderWidth={0}
                            nodeBorderColor={{
                                from: 'color',
                                modifiers: [['darker', 0.8]]
                            }}
                            linkOpacity={0.5}
                            linkHoverOthersOpacity={0.1}
                            linkContract={3}
                            enableLinkGradient={true}
                            labelPosition="outside"
                            labelOrientation="horizontal"
                            labelPadding={16}
                            labelTextColor={{
                                from: 'color',
                                modifiers: [['darker', 1]]
                            }}
                            theme={{
                                labels: {
                                    text: {
                                        fill: theme.palette.text.primary
                                    }
                                }
                            }}
                            animate={true}
                            motionConfig="gentle"
                        />
                    </Box>
                </Grid>

                {/* Success Metrics */}
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {firms.map(firm => (
                            <Grid item xs={12} md={4} key={firm.id}>
                                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                                    <Typography color="textSecondary">{firm.name} Success Rate</Typography>
                                    <Typography variant="h4">
                                        {((firm.traders.filter(t => t.metrics.profitFactor > 1.5).length / 
                                           firm.traders.length) * 100).toFixed(1)}%
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ProgramComparisons;