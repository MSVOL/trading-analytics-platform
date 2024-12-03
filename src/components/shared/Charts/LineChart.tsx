import React from 'react';
import { ResponsiveLine, Serie } from '@nivo/line';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

interface LineChartProps {
    data: Serie[];
    xAxis?: string;
    yAxis?: string;
    height?: number;
    enablePoints?: boolean;
    enableArea?: boolean;
    curve?: 'linear' | 'monotoneX';
    showLegend?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
    data,
    xAxis,
    yAxis,
    height = 400,
    enablePoints = false,
    enableArea = false,
    curve = 'monotoneX',
    showLegend = true
}) => {
    const theme = useTheme();

    // Empty state check because empty charts are sadder than a crypto trader in a bear market
    if (!data.length || !data[0].data.length) {
        return (
            <Box 
                height={height} 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
            >
                <Typography color="textSecondary">
                    No data available - like my bank account after discovering leverage
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height }}>
            <ResponsiveLine
                data={data}
                margin={{ top: 50, right: showLegend ? 110 : 50, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ 
                    type: 'linear',
                    stacked: false,
                    min: 'auto',
                    max: 'auto'
                }}
                curve={curve}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: xAxis,
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: yAxis,
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                enablePoints={enablePoints}
                enableArea={enableArea}
                areaOpacity={0.1}
                useMesh={true}
                crosshairType="cross"
                theme={{
                    axis: {
                        ticks: {
                            text: {
                                fill: theme.palette.text.primary
                            }
                        },
                        legend: {
                            text: {
                                fill: theme.palette.text.primary
                            }
                        }
                    },
                    crosshair: {
                        line: {
                            stroke: theme.palette.primary.main,
                            strokeWidth: 1,
                            strokeOpacity: 0.35
                        }
                    },
                    grid: {
                        line: {
                            stroke: theme.palette.divider
                        }
                    }
                }}
                legends={showLegend ? [
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
                        symbolShape: 'circle'
                    }
                ] : undefined}
            />
        </Box>
    );
};