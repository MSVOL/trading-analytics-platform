import React from 'react';
import { Box, Container } from '@mui/material';
import Tier1 from './components/TierModules/Tier1';
import Tier2 from './components/TierModules/Tier2';
import Tier3 from './components/TierModules/Tier3';
import TierX from './components/TierModules/TierX';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth={false}>
        <ErrorBoundary>
          <Tier1 />
          <Tier2 />
          <Tier3 />
          <TierX />
        </ErrorBoundary>
      </Container>
    </Box>
  );
};

export default App;
