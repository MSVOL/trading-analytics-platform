import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import MultiFirmAnalytics from './MultiFirmAnalytics';
import ProgramComparisons from './ProgramComparisons';
import GlobalRiskMetrics from './GlobalRiskMetrics';
import { useAnalytics } from '../../../hooks/useAnalytics';

const Tier3: React.FC = () => {
  const { state } = useAnalytics();
  const firms = Array.from(state.firms.values());

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h4" gutterBottom>Cross-Firm Analytics</Typography>
      
      {firms.length > 1 ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MultiFirmAnalytics firms={firms} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ProgramComparisons firms={firms} />
          </Grid>
          <Grid item xs={12} md={6}>
            <GlobalRiskMetrics firms={firms} />
          </Grid>
        </Grid>
      ) : (
        <Typography color="textSecondary">Add multiple firm data to enable comparisons</Typography>
      )}
    </Paper>
  );
};

export default Tier3;
