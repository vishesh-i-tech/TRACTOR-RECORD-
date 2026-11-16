export function memoize(fn, { serializer = JSON.stringify, maxSize = Infinity } = {}) {
  const cache = new Map();
  return (...args) => {
    const key = serializer(args);
    if (cache.has(key)) return cache.get(key);
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}