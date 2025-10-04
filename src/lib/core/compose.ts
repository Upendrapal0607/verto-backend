// type ComposableFunction<T = unknown> = (input: T) => T;

// export const compose = <T = unknown>(...funcs: ComposableFunction<T>[]): T & { endpoint: ComposableFunction<T> } => {
//   const result = funcs.reverse().reduce((acc: T, fn: ComposableFunction<T>): T => {
//     const next = fn(acc);
//     if (typeof next === 'object' && next !== null && typeof acc === 'object' && acc !== null) {
//       Object.keys(acc as Record<string, unknown>).forEach(key => {
//         (next as Record<string, unknown>)[key] = (acc as Record<string, unknown>)[key];
//       });
//     }
//     return next;
//   });
//   (result as T & { endpoint: ComposableFunction<T> }).endpoint = funcs[0];
//   return result as T & { endpoint: ComposableFunction<T> };
// }; 





export function compose(...funcs:any) {
  const result = funcs.reverse().reduce((acc:any, fn:any) => {
    const next = fn(acc)
    Object.keys(acc).forEach(key => {
      next[key] = acc[key]
    })
    return next
  })
  result.endpoint = funcs[0]
  return result
} 