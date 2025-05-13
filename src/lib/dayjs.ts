import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(duration);

export const getUtcDayKey = (d: dayjs.ConfigType = new Date()) =>
  dayjs(d).utc().format('YYYY-MM-DD');

export const getLocalDayKey = (d: dayjs.ConfigType = new Date()) =>
  dayjs(d).format('YYYY-MM-DD');

export const getUtcStartOfDay = (d: dayjs.ConfigType = new Date()) =>
  dayjs(d).utc().startOf('day');

export const getLocalStartOfDay = (d: dayjs.ConfigType = new Date()) =>
  dayjs(d).startOf('day');

export { dayjs };
