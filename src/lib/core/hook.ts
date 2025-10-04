export function hook<T extends (...args: unknown[]) => unknown>(fn: T): T {
  return fn;
} 