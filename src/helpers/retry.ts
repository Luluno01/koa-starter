/**
 * Call a function and retry on rejection for a maximum `num` times
 * @param func the function to call and retry on rejection
 * @param num maximum attempts
 * @returns 
 */
export function retry<T>(func: (...args: any[]) => Promise<T>, num: number = 5): typeof func {
  return async function (...args: any[]) {
    let lastErr: Error | string | number | null = null
    for (let i = 0; i < num; i++) {
      try {
        return await func(...args)
      } catch (err) {
        lastErr = err as Error | string | number | null
      }
    }
    throw lastErr
  }
}

export default retry
