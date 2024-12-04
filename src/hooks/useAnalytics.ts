import { useContext } from 'react';
import { AnalyticsContext } from '../context/AnalyticsContext';

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider! Like trying to trade without a broker - technically possible but WHY?");
  }
  return context;
};