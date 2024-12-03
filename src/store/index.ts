import { configureStore } from '@reduxjs/toolkit';
import { analyticsSlice } from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    analytics: analyticsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;