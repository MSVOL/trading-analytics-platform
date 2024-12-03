import { Trade } from '../../types/trading';

export const calculateReturns = (trades: Trade[]): number[] => {
  return trades.map(trade => {
    const multiplier = trade.direction === 'LONG' ? 1 : -1;
    return ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * multiplier;
  });
};

export const calculateSharpeRatio = (returns: number[], riskFreeRate = 0.02): number => {
  const excess = returns.map(r => r - riskFreeRate);
  const mean = excess.reduce((a, b) => a + b, 0) / excess.length;
  const stdDev = Math.sqrt(
    excess.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (excess.length - 1)
  );
  return (mean / stdDev) * Math.sqrt(252); // Annualized
};

export const calculateDrawdown = (trades: Trade[]): number => {
  let peak = 0;
  let maxDrawdown = 0;
  let runningPnL = 0;

  trades.forEach(trade => {
    runningPnL += (trade.exitPrice - trade.entryPrice) * trade.size;
    if (runningPnL > peak) peak = runningPnL;
    const drawdown = peak - runningPnL;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  });

  return maxDrawdown;
};