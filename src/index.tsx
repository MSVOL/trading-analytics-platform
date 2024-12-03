import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import App from './App';
import { AnalyticsProvider } from './context/AnalyticsContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnalyticsProvider>
        <App />
      </AnalyticsProvider>
    </ThemeProvider>
  </React.StrictMode>
);
