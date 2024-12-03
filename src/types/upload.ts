export interface UploadConfig {
    allowedFileTypes: string[];
    maxFileSize: number;  // in bytes
    validateSchema: boolean;
}

export interface UploadResult {
    success: boolean;
    fileName: string;
    timestamp: string;
    records: number;
    errors?: UploadError[];
}

export interface UploadError {
    line: number;
    field: string;
    message: string;
    value?: unknown;
}

export type UploadStatus = 'idle' | 'uploading' | 'validating' | 'processing' | 'complete' | 'error';