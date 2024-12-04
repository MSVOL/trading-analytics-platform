import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import RiskMetrics from './RiskMetrics';
import ComplianceModule from './ComplianceModule';
import PerformanceModule from './PerformanceModule';
import { useAnalytics } from '../../../hooks/useAnalytics';

const Tier1: React.FC = () => {
  const { state } = useAnalytics();
  const selectedTrader = Array.from(state.traders.values())[0];

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h4" gutterBottom>Trader Qualification Analysis</Typography>
      
      {selectedTrader ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <RiskMetrics trader={selectedTrader} />
          </Grid>
          <Grid item xs={12} md={4}>
            <ComplianceModule trader={selectedTrader} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PerformanceModule trader={selectedTrader} />
          </Grid>
        </Grid>
      ) : (
        <Typography color="textSecondary">Select a trader to begin analysis</Typography>
      )}
    </Paper>
  );
};

export default Tier1;