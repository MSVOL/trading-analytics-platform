import React from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    CircularProgress,
    Alert
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useUpload } from '../../../context/UploadContext';

interface UploadFormProps {
    allowedTypes?: string[];
    maxSize?: number;
    onUploadSuccess?: (data: any) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({
    allowedTypes = ['.json', '.csv'],
    maxSize = 10 * 1024 * 1024,
    onUploadSuccess
}) => {
    const { state, dispatch } = useUpload();

    const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        dispatch({ type: 'START_UPLOAD', payload: file.name });

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const result = JSON.parse(e.target?.result as string);
                    dispatch({ 
                        type: 'UPLOAD_COMPLETE', 
                        payload: {
                            fileName: file.name,
                            timestamp: new Date().toISOString(),
                            records: Array.isArray(result) ? result.length : 1,
                            success: true
                        }
                    });
                    onUploadSuccess?.(result);
                } catch (error) {
                    dispatch({ 
                        type: 'UPLOAD_ERROR', 
                        payload: {
                            line: 0,
                            field: 'file',
                            message: 'Invalid JSON format'
                        }
                    });
                }
            };
            reader.readAsText(file);
        } catch (error) {
            dispatch({ 
                type: 'UPLOAD_ERROR',
                payload: {
                    line: 0,
                    field: 'file',
                    message: 'File read error'
                }
            });
        }
    }, [dispatch, onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/json': ['.json'],
            'text/csv': ['.csv']
        },
        maxSize,
        multiple: false
    });

    return (
        <Box>
            <Box
                {...getRootProps()}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.300',
                    borderRadius: 1,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover'
                    }
                }}
            >
                <input {...getInputProps()} />
                {state.status === 'uploading' ? (
                    <CircularProgress size={24} />
                ) : (
                    <Typography>
                        {isDragActive
                            ? "Drop it like it's hot!"
                            : "Drag 'n' drop or click to select files"}
                    </Typography>
                )}
            </Box>

            {state.errors.length > 0 && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {state.errors[0].message}
                </Alert>
            )}

            {state.status === 'complete' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    Upload successful!
                </Alert>
            )}
        </Box>
    );
};