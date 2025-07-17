import { useState, useEffect, useCallback } from 'react';
import modelService, { ModelProcessResult } from '../services/modelService';

export interface UseProcessStatusResult {
  status: ModelProcessResult | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProcessStatus = (modelId: string | null, pollInterval: number = 2000): UseProcessStatusResult => {
  const [status, setStatus] = useState<ModelProcessResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!modelId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await modelService.getProcessStatus(modelId);
      setStatus(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取状态失败');
    } finally {
      setLoading(false);
    }
  }, [modelId]);

  const refetch = useCallback(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (!modelId) return;

    // 立即获取一次状态
    fetchStatus();

    // 如果状态不是最终状态，开始轮询
    const interval = setInterval(() => {
      fetchStatus();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [modelId, pollInterval, fetchStatus]);

  useEffect(() => {
    // 如果状态是最终状态，停止轮询
    if (status && (status.status === 'completed' || status.status === 'failed')) {
      // 这里可以添加停止轮询的逻辑
    }
  }, [status]);

  return {
    status,
    loading,
    error,
    refetch,
  };
};