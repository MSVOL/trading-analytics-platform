import React from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Chip,
    OutlinedInput,
    SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeFrame } from '../../../types/trading';

interface FilterFormProps {
    onFilter: (filters: FilterState) => void;
    availableFirms?: string[];
    availableTraders?: string[];
}

interface FilterState {
    timeFrame: TimeFrame;
    startDate: Date | null;
    endDate: Date | null;
    firms: string[];
    traders: string[];
    minPnL?: number;
    maxDrawdown?: number;
}

export const FilterForm: React.FC<FilterFormProps> = ({
    onFilter,
    availableFirms = [],
    availableTraders = []
}) => {
    const [filters, setFilters] = React.useState<FilterState>({
        timeFrame: '1D',
        startDate: null,
        endDate: null,
        firms: [],
        traders: []
    });

    const handleChange = (field: keyof FilterState, value: any) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMultiSelect = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value, name },
        } = event;
        handleChange(name as keyof FilterState, typeof value === 'string' ? value.split(',') : value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onFilter(filters);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Time Frame</InputLabel>
                        <Select
                            value={filters.timeFrame}
                            onChange={(e) => handleChange('timeFrame', e.target.value)}
                        >
                            <MenuItem value="1D">1 Day</MenuItem>
                            <MenuItem value="1W">1 Week</MenuItem>
                            <MenuItem value="1M">1 Month</MenuItem>
                            <MenuItem value="3M">3 Months</MenuItem>
                            <MenuItem value="6M">6 Months</MenuItem>
                            <MenuItem value="1Y">1 Year</MenuItem>
                            <MenuItem value="YTD">Year to Date</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Firms</InputLabel>
                        <Select
                            multiple
                            name="firms"
                            value={filters.firms}
                            onChange={handleMultiSelect}
                            input={<OutlinedInput label="Firms" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {availableFirms.map((firm) => (
                                <MenuItem key={firm} value={firm}>
                                    {firm}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <DatePicker
                        label="Start Date"
                        value={filters.startDate}
                        onChange={(newValue) => handleChange('startDate', newValue)}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <DatePicker
                        label="End Date"
                        value={filters.endDate}
                        onChange={(newValue) => handleChange('endDate', newValue)}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Min P&L"
                        type="number"
                        value={filters.minPnL || ''}
                        onChange={(e) => handleChange('minPnL', Number(e.target.value))}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Max Drawdown %"
                        type="number"
                        value={filters.maxDrawdown || ''}
                        onChange={(e) => handleChange('maxDrawdown', Number(e.target.value))}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                    >
                        Apply Filters
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};