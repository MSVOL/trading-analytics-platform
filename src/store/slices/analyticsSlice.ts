import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trade, TraderProfile, FirmProfile } from '../../types/trading';

interface AnalyticsState {
    traders: Map<string, TraderProfile>;
    firms: Map<string, FirmProfile>;
    selectedTimeframe: string;
    loading: boolean;
    error: string | null;
}

const initialState: AnalyticsState = {
    traders: new Map(),
    firms: new Map(),
    selectedTimeframe: '1D',
    loading: false,
    error: null
};

export const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setTraderData: (state, action: PayloadAction<TraderProfile>) => {
            state.traders.set(action.payload.id, action.payload);
        },
        setFirmData: (state, action: PayloadAction<FirmProfile>) => {
            state.firms.set(action.payload.id, action.payload);
        },
        setTimeframe: (state, action: PayloadAction<string>) => {
            state.selectedTimeframe = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const { setTraderData, setFirmData, setTimeframe, setLoading, setError } = analyticsSlice.actions;
