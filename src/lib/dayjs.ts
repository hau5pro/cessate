import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const getUtcDayKey = (d: dayjs.ConfigType = new Date()) =>
  dayjs(d).utc().format('YYYY-MM-DD');

export const getLocalDayKey = (d: dayjs.ConfigType = new Date()) =>
  dayjs(d).format('YYYY-MM-DD');

export const getUtcStartOfDay = (d: dayjs.ConfigType = new Date()) =>
  dayjs(d).utc().startOf('day');

export const getLocalStartOfDay = (d: dayjs.ConfigType = new Date()) =>
  dayjs(d).startOf('day');

export { dayjs };
