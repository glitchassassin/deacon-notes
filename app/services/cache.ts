const CACHE_PREFIX = "cache:";

export function optimisticCache<T>(key: string, fetcher: () => Promise<T>) {
  const cached = localStorage.getItem(CACHE_PREFIX + key);
  return {
    optimistic: cached ? (JSON.parse(cached) as T) : undefined,
    fetched: fetcher().then((value) => {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
      return value;
    }),
  };
}
