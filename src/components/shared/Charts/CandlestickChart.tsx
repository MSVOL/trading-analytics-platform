import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ResponsiveLine } from '@nivo/line';

interface Candle {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

interface CandlestickChartProps {
    data: Candle[];
    height?: number;
    showVolume?: boolean;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
    data,
    height = 400,
    showVolume = true
}) => {
    const theme = useTheme();

    const processedData = React.useMemo(() => {
        if (!data.length) return [];

        // Main price series
        const priceData = data.map(candle => ({
            x: candle.timestamp,
            y: [candle.open, candle.high, candle.low, candle.close]
        }));

        // Volume series if needed
        const volumeData = showVolume ? data.map(candle => ({
            x: candle.timestamp,
            y: candle.volume || 0
        })) : [];

        return [
            {
                id: 'Price',
                data: priceData
            },
            ...(showVolume ? [{
                id: 'Volume',
                data: volumeData
            }] : [])
        ];
    }, [data, showVolume]);

    if (!data.length) {
        return (
            <Box height={height} display="flex" alignItems="center" justifyContent="center">
                <Typography color="textSecondary">
                    No price data - like a trading terminal during a power outage
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height }}>
            <ResponsiveLine
                data={processedData}
                margin={{ top: 50, right: 110, bottom: showVolume ? 100 : 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ 
                    type: 'linear',
                    stacked: false,
                    min: 'auto',
                    max: 'auto'
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    format: (value) => new Date(value).toLocaleDateString()
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0
                }}
                enablePoints={false}
                enableCrosshair={true}
                theme={{
                    axis: {
                        ticks: {
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
                    }
                }}
                colors={[theme.palette.primary.main, theme.palette.secondary.main]}
            />
        </Box>
    );
};