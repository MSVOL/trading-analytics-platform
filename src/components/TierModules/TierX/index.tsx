import React, { useCallback } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import BasicPerformance from './BasicPerformance';
import RiskBoundaries from './RiskBoundaries';
import PatternRecognition from './PatternRecognition';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { TraderProfile } from '../../../types/trading';

const TierX: React.FC = () => {
  const { dispatch } = useAnalytics();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as TraderProfile;
          dispatch({ type: 'SET_TRADER_DATA', payload: data });
        } catch (error) {
          console.error('Failed to parse trader data:', error);
        }
      };
      reader.readAsText(file);
    });
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    }
  });

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Quick Analysis Zone</Typography>
      
      <Box {...getRootProps()} sx={{
        p: 3,
        mb: 3,
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'grey.500',
        borderRadius: 2,
        textAlign: 'center',
        cursor: 'pointer'
      }}>
        <input {...getInputProps()} />
        <Typography>
          {isDragActive ? 
            "Drop that JSON like it's hot! 🔥" : 
            "Drag 'n drop trader data or click to select"}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <BasicPerformance />
        </Grid>
        <Grid item xs={12} md={4}>
          <RiskBoundaries />
        </Grid>
        <Grid item xs={12} md={4}>
          <PatternRecognition />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TierX;