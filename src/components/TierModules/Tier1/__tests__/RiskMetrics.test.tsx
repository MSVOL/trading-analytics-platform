import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../../theme';
import RiskMetrics from '../RiskMetrics';
import { AnalyticsProvider } from '../../../../context/AnalyticsContext';

const mockTrader = {
    id: '1',
    trades: [
        {
            id: '1',
            entryPrice: 100,
            exitPrice: 110,
            size: 1,
            direction: 'LONG',
            entryTimestamp: '2024-01-01T10:00:00Z',
            exitTimestamp: '2024-01-01T11:00:00Z',
            symbol: 'TEST'
        }
    ],
    metrics: {
        winRate: 0.6,
        sharpeRatio: 1.5,
        maxDrawdown: 0.1,
        profitFactor: 1.8
    }
};

describe('RiskMetrics', () => {
    const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
        <ThemeProvider theme={theme}>
            <AnalyticsProvider initialState={{traders: new Map([['1', mockTrader]])}}>
                {children}
            </AnalyticsProvider>
        </ThemeProvider>
    );

    it('renders without crashing', () => {
        render(<RiskMetrics />, { wrapper });
        expect(screen.getByText('Risk Profile')).toBeInTheDocument();
    });

    it('displays correct metrics', () => {
        render(<RiskMetrics />, { wrapper });
        expect(screen.getByText('60%')).toBeInTheDocument(); // Win Rate
        expect(screen.getByText('1.50')).toBeInTheDocument(); // Sharpe
    });

    it('handles no data state', () => {
        render(
            <ThemeProvider theme={theme}>
                <AnalyticsProvider initialState={{traders: new Map()}}>
                    <RiskMetrics />
                </AnalyticsProvider>
            </ThemeProvider>
        );
        expect(screen.getByText('No data available')).toBeInTheDocument();
    });
})