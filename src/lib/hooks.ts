import { useEffect, useState, type DependencyList } from 'react';

export function useFetch<T>(fetcher: () => T | Promise<T>, deps: DependencyList = []): T | null {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    let cancelled = false;
    Promise.resolve(fetcher()).then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return data;
}
