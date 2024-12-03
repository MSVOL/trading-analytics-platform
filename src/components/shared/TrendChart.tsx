import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@mui/material/styles';
import { Theme } from '@mui/material';

interface DataPoint {
    x: string | number;
    y: number;
}

interface TrendChartProps {
    data: {
        id: string;
        data: DataPoint[];
    }[];
    yAxisLabel?: string;
    xAxisLabel?: string;
    height?: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({
    data,
    yAxisLabel = '',
    xAxisLabel = '',
    height = 400
}) => {
    const theme = useTheme();

    const chartTheme = {
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
        crosshair: {
            line: {
                stroke: theme.palette.primary.main,
                strokeWidth: 1,
                strokeOpacity: 0.35,
            },
        },
    };

    return (
        <div style={{ height }}>
            <ResponsiveLine
                data={data}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ 
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: false,
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: xAxisLabel,
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: yAxisLabel,
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                theme={chartTheme}
            />
        </div>
    );
};
