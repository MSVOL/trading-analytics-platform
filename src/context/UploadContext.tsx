import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { UploadStatus, UploadResult, UploadError } from '../types/upload';

interface UploadState {
    status: UploadStatus;
    results: Map<string, UploadResult>;
    activeUploads: number;
    errors: UploadError[];
    pendingValidation: string[];
}

type UploadAction = 
    | { type: 'START_UPLOAD'; payload: string }
    | { type: 'UPLOAD_PROGRESS'; payload: { fileId: string; progress: number } }
    | { type: 'UPLOAD_COMPLETE'; payload: UploadResult }
    | { type: 'UPLOAD_ERROR'; payload: UploadError }
    | { type: 'RESET_UPLOAD' };

const initialState: UploadState = {
    status: 'idle',
    results: new Map(),
    activeUploads: 0,
    errors: [],
    pendingValidation: []
};

const UploadContext = createContext<{
    state: UploadState;
    dispatch: React.Dispatch<UploadAction>;
} | undefined>(undefined);

function uploadReducer(state: UploadState, action: UploadAction): UploadState {
    switch (action.type) {
        case 'START_UPLOAD':
            return {
                ...state,
                status: 'uploading',
                activeUploads: state.activeUploads + 1,
                pendingValidation: [...state.pendingValidation, action.payload]
            };
        case 'UPLOAD_COMPLETE': {
            const newResults = new Map(state.results);
            newResults.set(action.payload.fileName, action.payload);
            return {
                ...state,
                results: newResults,
                activeUploads: state.activeUploads - 1,
                status: state.activeUploads === 1 ? 'complete' : 'uploading'
            };
        }
        case 'UPLOAD_ERROR':
            return {
                ...state,
                status: 'error',
                errors: [...state.errors, action.payload]
            };
        case 'RESET_UPLOAD':
            return initialState;
        default:
            return state;
    }
}

export function UploadProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(uploadReducer, initialState);
    return (
        <UploadContext.Provider value={{ state, dispatch }}>
            {children}
        </UploadContext.Provider>
    );
}

export function useUpload() {
    const context = useContext(UploadContext);
    if (!context) {
        throw new Error('useUpload must be used within UploadProvider');
    }
    return context;
}