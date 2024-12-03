import { UploadResult, UploadError, UploadStatus } from '../../types/upload';
import { Trade } from '../../types/trading';

export class UploadService {
    private static readonly ALLOWED_EXTENSIONS = ['.json', '.csv'];
    private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    static async processUpload(
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<UploadResult> {
        try {
            if (!this.validateFile(file)) {
                throw new Error('Invalid file format');
            }

            const content = await this.readFile(file, onProgress);
            const trades = await this.parseContent(content);
            const validatedTrades = this.validateTrades(trades);

            return {
                success: true,
                fileName: file.name,
                timestamp: new Date().toISOString(),
                records: validatedTrades.length
            };
        } catch (error) {
            throw this.handleUploadError(error);
        }
    }

    private static validateFile(file: File): boolean {
        const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
        return this.ALLOWED_EXTENSIONS.includes(extension) && 
               file.size <= this.MAX_FILE_SIZE;
    }

    private static async readFile(
        file: File, 
        onProgress?: (progress: number) => void
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onprogress = (event) => {
                if (event.lengthComputable && onProgress) {
                    onProgress((event.loaded / event.total) * 100);
                }
            };

            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            
            reader.readAsText(file);
        });
    }

    private static async parseContent(content: string): Promise<Trade[]> {
        try {
            return JSON.parse(content);
        } catch {
            // If JSON parse fails, attempt CSV parse
            return this.parseCSV(content);
        }
    }

    private static parseCSV(content: string): Trade[] {
        // CSV parsing logic here
        return [];
    }

    private static validateTrades(trades: Trade[]): Trade[] {
        return trades.filter(trade => {
            return trade.entryPrice > 0 &&
                   trade.exitPrice > 0 &&
                   trade.size > 0 &&
                   new Date(trade.entryTimestamp).getTime() < 
                   new Date(trade.exitTimestamp).getTime();
        });
    }

    private static handleUploadError(error: unknown): never {
        throw {
            line: 0,
            field: 'file',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        } as UploadError;
    }
}