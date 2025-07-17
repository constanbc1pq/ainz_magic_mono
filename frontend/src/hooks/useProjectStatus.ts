import { useState, useEffect, useCallback } from 'react';
import modelService, { ModelProcessResult } from '../services/modelService';

export interface UseProjectStatusResult {
  status: ModelProcessResult | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  waitingSeconds: number;
  onPollingEvent?: () => void;
}

export const useProjectStatus = (
  projectId: string | null, 
  pollInterval: number = 2000,
  onPollingEvent?: () => void
): UseProjectStatusResult => {
  const [status, setStatus] = useState<ModelProcessResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [waitingSeconds, setWaitingSeconds] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await modelService.getProjectStatus(projectId);
      setStatus(result);
      
      // 触发轮询事件回调（用于动画）
      if (onPollingEvent) {
        onPollingEvent();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取状态失败');
    } finally {
      setLoading(false);
    }
  }, [projectId, onPollingEvent]);

  const refetch = useCallback(() => {
    fetchStatus();
  }, [fetchStatus]);

  // 停止轮询的函数
  const stopPolling = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  useEffect(() => {
    if (!projectId) return;

    // 重置计时器
    setStartTime(Date.now());
    setWaitingSeconds(0);

    // 立即获取一次状态
    fetchStatus();

    // 如果状态不是最终状态，开始轮询
    const interval = setInterval(() => {
      fetchStatus();
    }, pollInterval);

    setIntervalId(interval);

    return () => {
      clearInterval(interval);
      setIntervalId(null);
    };
  }, [projectId, pollInterval]); // 移除fetchStatus依赖，避免无限循环

  // 计时器effect - 每秒更新等待时间
  useEffect(() => {
    if (!startTime || !status || status.status === 'completed' || status.status === 'failed') {
      return;
    }

    const timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setWaitingSeconds(elapsed);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [startTime, status]);

  useEffect(() => {
    // 如果状态是最终状态，停止轮询
    if (status && (status.status === 'completed' || status.status === 'failed')) {
      console.log(`项目状态已变为 ${status.status}，停止轮询`);
      stopPolling();
    }
  }, [status, stopPolling]);

  return {
    status,
    loading,
    error,
    refetch,
    waitingSeconds,
  };
};