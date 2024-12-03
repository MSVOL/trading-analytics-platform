import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });

global.ResizeObserver = require('resize-observer-polyfill');

jest.mock('../services/analytics/tradeAnalytics', () => ({
  analyzePerformance: jest.fn(),
  calculateReturns: jest.fn(),
}));
