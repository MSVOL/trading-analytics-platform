import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

interface RadarChartProps {
    data: Array<{
        [key: string]: string | number;
    }>;
    keys: string[];
    indexBy: string;
    height?: number;
    maxValue?: number;
    fillOpacity?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
    data,
    keys,
    indexBy,
    height = 400,
    maxValue = 'auto',
    fillOpacity = 0.25
}) => {
    const theme = useTheme();

    if (!data.length || !keys.length) {
        return (
            <Box height={height} display="flex" alignItems="center" justifyContent="center">
                <Typography color="textSecondary">
                    Radar empty - like a trend follower in a choppy market
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height }}>
            <ResponsiveRadar
                data={data}
                keys={keys}
                indexBy={indexBy}
                maxValue={maxValue}
                margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                curve="linearClosed"
                borderWidth={2}
                borderColor={{ from: 'color' }}
                gridLevels={5}
                gridShape="circular"
                gridLabelOffset={36}
                enableDots={true}
                dotSize={8}
                dotColor={{ theme: 'background' }}
                dotBorderWidth={2}
                dotBorderColor={{ from: 'color' }}
                enableDotLabel={true}
                dotLabel="value"
                dotLabelYOffset={-12}
                fillOpacity={fillOpacity}
                blendMode="multiply"
                animate={true}
                motionConfig="wobbly"
                isInteractive={true}
                theme={{
                    axis: {
                        ticks: {
                            text: {
                                fill: theme.palette.text.primary,
                                fontSize: 12
                            }
                        }
                    },
                    dots: {
                        text: {
                            fill: theme.palette.text.primary,
                            fontSize: 12
                        }
                    },
                    grid: {
                        line: {
                            stroke: theme.palette.divider
                        }
                    }
                }}
                legends={[
                    {
                        anchor: 'top-right',
                        direction: 'column',
                        translateX: -50,
                        translateY: -40,
                        itemWidth: 80,
                        itemHeight: 20,
                        itemTextColor: theme.palette.text.primary,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: theme.palette.primary.main
                                }
                            }
                        ]
                    }
                ]}
            />
        </Box>
    );
};