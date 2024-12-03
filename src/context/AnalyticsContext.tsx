import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { TraderProfile, FirmProfile, AnalysisRequest } from '../types/trading';

interface AnalyticsState {
    traders: Map<string, TraderProfile>;
    firms: Map<string, FirmProfile>;
    activeAnalysis: AnalysisRequest | null;
    loading: boolean;
    error: string | null;
}

type AnalyticsAction = 
    | { type: 'SET_TRADER_DATA'; payload: TraderProfile }
    | { type: 'SET_FIRM_DATA'; payload: FirmProfile }
    | { type: 'SET_ANALYSIS'; payload: AnalysisRequest }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

const initialState: AnalyticsState = {
    traders: new Map(),
    firms: new Map(),
    activeAnalysis: null,
    loading: false,
    error: null
};

const AnalyticsContext = createContext<{
    state: AnalyticsState;
    dispatch: React.Dispatch<AnalyticsAction>;
} | undefined>(undefined);

function analyticsReducer(state: AnalyticsState, action: AnalyticsAction): AnalyticsState {
    switch (action.type) {
        case 'SET_TRADER_DATA':
            const newTraders = new Map(state.traders);
            newTraders.set(action.payload.id, action.payload);
            return { ...state, traders: newTraders };
        case 'SET_FIRM_DATA':
            const newFirms = new Map(state.firms);
            newFirms.set(action.payload.id, action.payload);
            return { ...state, firms: newFirms };
        case 'SET_ANALYSIS':
            return { ...state, activeAnalysis: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(analyticsReducer, initialState);
    return (
        <AnalyticsContext.Provider value={{ state, dispatch }}>
            {children}
        </AnalyticsContext.Provider>
    );
}

export function useAnalytics() {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
}