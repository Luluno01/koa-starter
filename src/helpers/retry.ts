export function retry<T>(func: (...args: any[]) => Promise<T>, num: number = 5): typeof func {
  return async function (...args: any[]) {
    let lastErr: Error | string | number | null = null
    for (let i = 0; i < num; i++) {
      try {
        return await func(...args)
      } catch (err) {
        lastErr = err
      }
    }
    throw lastErr
  }
}

export default retry
