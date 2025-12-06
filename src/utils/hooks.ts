import { useState, useEffect, useCallback } from 'react';

// Debounce hook
export const useDebounce = <T,>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Loading state hook
export const useLoading = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      return await fn();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, setIsLoading, withLoading };
};

// Error handling hook
export const useError = () => {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: any) => {
    if (err.response?.data?.detail) {
      setError(err.response.data.detail);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred');
    }
  }, []);

  return { error, setError, clearError, handleError };
};

// Pagination hook
export const usePagination = (initialPage: number = 0, initialLimit: number = 10) => {
  const [skip, setSkip] = useState(initialPage * initialLimit);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const currentPage = Math.floor(skip / limit);
  const totalPages = Math.ceil(total / limit);

  const goToPage = useCallback((page: number) => {
    setSkip(page * limit);
  }, [limit]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setSkip((prev) => prev + limit);
    }
  }, [currentPage, totalPages, limit]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setSkip((prev) => prev - limit);
    }
  }, [currentPage, limit]);

  return {
    skip,
    limit,
    total,
    currentPage,
    totalPages,
    setTotal,
    setLimit,
    goToPage,
    nextPage,
    prevPage,
  };
};

// Local storage hook
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

