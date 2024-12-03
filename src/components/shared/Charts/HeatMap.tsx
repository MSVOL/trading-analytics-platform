import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

interface HeatMapProps {
    data: Array<{
        id: string;
        data: Array<{
            x: string;
            y: number;
        }>;
    }>;
    height?: number;
    minValue?: number;
    maxValue?: number;
    label?: string;
}

export const HeatMap: React.FC<HeatMapProps> = ({
    data,
    height = 400,
    minValue = -1,
    maxValue = 1,
    label
}) => {
    const theme = useTheme();

    if (!data.length) {
        return (
            <Box 
                height={height} 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
            >
                <Typography color="textSecondary">
                    No correlation data - like searching for alpha in a meme stock
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height }}>
            <ResponsiveHeatMap
                data={data}
                margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
                valueFormat=">-.2f"
                axisTop={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: label,
                    legendOffset: 46
                }}
                axisRight={null}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legendPosition: 'middle',
                    legendOffset: -72
                }}
                colors={{
                    type: 'diverging',
                    scheme: 'red_yellow_blue',
                    divergeAt: 0.5,
                    minValue,
                    maxValue
                }}
                emptyColor="#555555"
                legends={[
                    {
                        anchor: 'bottom',
                        translateX: 0,
                        translateY: 30,
                        length: 400,
                        thickness: 8,
                        direction: 'row',
                        tickPosition: 'after',
                        tickSize: 3,
                        tickSpacing: 4,
                        tickOverlap: false,
                        title: 'Correlation →',
                        titleAlign: 'start',
                        titleOffset: 4
                    }
                ]}
                theme={{
                    axis: {
                        ticks: {
                            text: {
                                fill: theme.palette.text.primary
                            }
                        }
                    },
                    legends: {
                        text: {
                            fill: theme.palette.text.primary
                        }
                    }
                }}
            />
        </Box>
    );
};