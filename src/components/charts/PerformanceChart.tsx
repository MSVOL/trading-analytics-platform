import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Trade } from '../../types/trading';
import { Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface PerformanceChartProps {
    trades: Trade[];
    timeFrame?: TimeFrame;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ trades, timeFrame }) => {
    const theme = useTheme();

    const data = useMemo(() => {
        let cumPnL = 0;
        return [{
            id: 'performance',
            data: trades.map(trade => {
                cumPnL += trade.pnl || 0;
                return {
                    x: new Date(trade.exitTimestamp).toISOString(),
                    y: cumPnL
                };
            })
        }];
    }, [trades]);

    return (
        <div style={{ height: 400 }}>
            <ResponsiveLine
                data={data}
                margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
                xScale={{
                    type: 'time',
                    format: '%Y-%m-%dT%H:%M:%S.%LZ',
                    useUTC: false,
                }}
                yScale={{
                    type: 'linear',
                    stacked: false,
                }}
                axisLeft={{
                    legend: 'P&L ($)',
                    legendOffset: -60,
                }}
                axisBottom={{
                    format: '%b %d',
                    tickRotation: -45,
                    legend: 'Date',
                    legendOffset: 50,
                }}
                pointSize={4}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                enableSlices="x"
                enableGridX={false}
                theme={{
                    axis: {
                        ticks: {
                            text: {
                                fill: theme.palette.text.primary,
                            },
                        },
                        legend: {
                            text: {
                                fill: theme.palette.text.primary,
                            },
                        },
                    },
                    grid: {
                        line: {
                            stroke: theme.palette.divider,
                        },
                    },
                }}
            />
        </div>
    );
};