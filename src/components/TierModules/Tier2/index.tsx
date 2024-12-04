import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import PortfolioRisk from './PortfolioRisk';
import ExposureModule from './ExposureModule';
import CapitalModule from './CapitalModule';
import { useAnalytics } from '../../../hooks/useAnalytics';

const Tier2: React.FC = () => {
  const { state } = useAnalytics();
  const traders = Array.from(state.traders.values());

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h4" gutterBottom>Risk Management Dashboard</Typography>
      
      {traders.length > 0 ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <PortfolioRisk traders={traders} />
          </Grid>
          <Grid item xs={12} md={4}>
            <ExposureModule traders={traders} />
          </Grid>
          <Grid item xs={12} md={4}>
            <CapitalModule traders={traders} />
          </Grid>
        </Grid>
      ) : (
        <Typography color="textSecondary">Upload trader data to view portfolio analysis</Typography>
      )}
    </Paper>
  );
};

export default Tier2;
