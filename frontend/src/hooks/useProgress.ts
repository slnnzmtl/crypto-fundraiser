import { useCallback } from 'react';
import { progressStore } from '../stores/ProgressStore';

export const useProgress = () => {
  const setProgress = useCallback((value: number) => {
    progressStore.setProgress(value);
  }, []);

  const start = useCallback(() => {
    progressStore.start();
  }, []);

  const finish = useCallback(() => {
    progressStore.finish();
  }, []);

  const reset = useCallback(() => {
    progressStore.reset();
  }, []);

  /**
   * Automatically manages progress for async operations
   * @param promise The promise to track progress for
   * @returns The result of the promise
   */
  const trackProgress = useCallback(async <T>(promise: Promise<T>): Promise<T> => {
    try {
      progressStore.start();
      
      // Simulate progress while the promise is pending
      let progress = 0;
      const interval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 10, 90);
        progressStore.setProgress(progress);
      }, 200);

      const result = await promise;
      
      clearInterval(interval);
      progressStore.finish();
      
      return result;
    } catch (error) {
      progressStore.reset();
      throw error;
    }
  }, []);

  return {
    setProgress,
    start,
    finish,
    reset,
    trackProgress
  };
}; 