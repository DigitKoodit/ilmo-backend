import nodeCache from "node-cache";

// app-wide cache
const cache = new nodeCache();

/**
 * Returns a cached result of a function.
 */
export const cached = async <T>(
  key: string,
  ttl: number,
  func: () => Promise<T>
): Promise<T> => {
  if (cache.has(key)) return cache.get<T>(key);

  // update value if not in cache
  const value = await func();

  cache.set(key, value, ttl);

  return value;
};
