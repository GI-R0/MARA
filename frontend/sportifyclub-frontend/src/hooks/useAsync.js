import { useState, useEffect, useCallback, useRef } from "react";

export const useAsync = (asyncFunction, dependencies = [], options = {}) => {
  const {
    immediate = true,
    cacheKey = null,
    cacheDuration = 5 * 60 * 1000,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const cacheRef = useRef(new Map());

  const execute = useCallback(
    async (...args) => {
      if (cacheKey) {
        const cached = cacheRef.current.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < cacheDuration) {
          setData(cached.data);
          setLoading(false);
          return cached.data;
        }
      }

      setLoading(true);
      setError(null);

      try {
        const result = await asyncFunction(...args);

        if (mountedRef.current) {
          setData(result);
          setLoading(false);

          if (cacheKey) {
            cacheRef.current.set(cacheKey, {
              data: result,
              timestamp: Date.now(),
            });
          }
        }

        return result;
      } catch (err) {
        if (mountedRef.current) {
          setError(
            err.response?.data?.message || err.message || "Error desconocido",
          );
          setLoading(false);
        }
        throw err;
      }
    },
    [asyncFunction, cacheKey, cacheDuration],
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refetch = useCallback(() => {
    if (cacheKey) {
      cacheRef.current.delete(cacheKey);
    }
    return execute();
  }, [execute, cacheKey]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    refetch,
    clearCache,
  };
};

export default useAsync;
