import { useState, useCallback } from 'react';
import modelService, { UploadModelData, ModelProcessResult } from '../services/modelService';

export interface UseModelUploadResult {
  uploading: boolean;
  error: string | null;
  result: ModelProcessResult | null;
  uploadModel: (data: UploadModelData) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useModelUpload = (): UseModelUploadResult => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ModelProcessResult | null>(null);

  const uploadModel = useCallback(async (data: UploadModelData) => {
    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const result = await modelService.uploadModel(data);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    } finally {
      setUploading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setUploading(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    uploading,
    error,
    result,
    uploadModel,
    clearError,
    reset,
  };
};