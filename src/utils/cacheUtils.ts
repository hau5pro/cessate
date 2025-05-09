import { Constants } from './constants';

export class CacheUtils {
  static isStale(timestamp: number): boolean {
    return Date.now() - timestamp > Constants.ONE_DAY_IN_MS;
  }
}
