import { Trade, TraderProfile, FirmProfile } from '../../types/trading';

export const validateTrade = (trade: Partial<Trade>): string[] => {
  const errors: string[] = [];

  if (!trade.entryPrice || trade.entryPrice <= 0) 
    errors.push('Invalid entry price');
  if (!trade.exitPrice || trade.exitPrice <= 0) 
    errors.push('Invalid exit price');
  if (!trade.size || trade.size <= 0) 
    errors.push('Invalid size');
  if (!trade.direction || !['LONG', 'SHORT'].includes(trade.direction)) 
    errors.push('Invalid direction');
  if (!trade.symbol) 
    errors.push('Symbol required');

  return errors;
};

export const validateTimeRange = (start: string, end: string): boolean => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return startDate < endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime());
};
