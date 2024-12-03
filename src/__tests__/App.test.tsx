import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import { analyticsSlice } from '../store/slices/analyticsSlice';
import { theme } from '../theme';

const store = configureStore({
    reducer: {
        analytics: analyticsSlice.reducer
    }
});

describe('App', () => {
    const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </Provider>
    );

    it('renders main layout', () => {
        render(<App />, { wrapper });
        expect(screen.getByText('Trader Qualification Analysis')).toBeInTheDocument();
    });

    it('renders all tier sections', () => {
        render(<App />, { wrapper });
        expect(screen.getByText('Risk Management Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Advanced Analytics')).toBeInTheDocument();
        expect(screen.getByText('Limited Data Analysis')).toBeInTheDocument();
    });

    it('handles initial empty state', () => {
        render(<App />, { wrapper });
        expect(screen.getByText('No trader data available')).toBeInTheDocument();
    });
});
