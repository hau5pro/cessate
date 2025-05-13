import { Constants } from './constants';

export class CacheUtils {
  static DEBOUNCE_DELAY = 300;

  static isStale(timestamp: number): boolean {
    return Date.now() - timestamp > Constants.ONE_DAY_IN_MS;
  }

  static debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return ((...args: any[]) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    }) as T;
  }
}
