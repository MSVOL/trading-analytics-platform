import React from 'react';
import { 
    Paper, 
    Grid, 
    Typography, 
    List, 
    ListItem, 
    ListItemText,
    ListItemIcon,
    Alert
} from '@mui/material';
import { Warning, CheckCircle, Error } from '@mui/icons-material';
import { useAnalytics } from '../../../context/AnalyticsContext';
import { TradeAnalytics } from '../../../services/analytics/tradeAnalytics';

interface RuleViolation {
    id: string;
    severity: 'high' | 'medium' | 'low';
    message: string;
    timestamp: string;
}

const ComplianceModule: React.FC = () => {
    const { state } = useAnalytics();
    const activeTrader = Array.from(state.traders.values())[0];

    const violations = React.useMemo(() => {
        if (!activeTrader?.trades.length) return [];
        
        const metrics = TradeAnalytics.analyzePerformance(activeTrader.trades);
        const violations: RuleViolation[] = [];

        // Check drawdown violations
        if (metrics.metrics.risk.maxDrawdown > 0.1) {
            violations.push({
                id: 'DD_VIOLATION',
                severity: 'high',
                message: 'Maximum drawdown exceeded 10%',
                timestamp: new Date().toISOString()
            });
        }

        // Check position sizing
        const oversizedTrades = activeTrader.trades.filter(t => 
            Math.abs(t.size) > 100 // Example limit
        );
        
        if (oversizedTrades.length) {
            violations.push({
                id: 'SIZE_VIOLATION',
                severity: 'medium',
                message: `${oversizedTrades.length} trades exceeded position limits`,
                timestamp: new Date().toISOString()
            });
        }

        return violations;
    }, [activeTrader]);

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high':
                return <Error color="error" />;
            case 'medium':
                return <Warning color="warning" />;
            default:
                return <CheckCircle color="success" />;
        }
    };

    if (!activeTrader) return <Typography>No trader data available</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Compliance Status
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    {violations.length === 0 ? (
                        <Alert severity="success">
                            All compliance checks passed
                        </Alert>
                    ) : (
                        <List>
                            {violations.map((violation) => (
                                <ListItem key={violation.id}>
                                    <ListItemIcon>
                                        {getSeverityIcon(violation.severity)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={violation.message}
                                        secondary={new Date(violation.timestamp).toLocaleString()}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ComplianceModule;
