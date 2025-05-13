export class DB {
  static USER_SETTINGS = 'user_settings';
  static USER_SESSIONS = 'user_sessions';
  static SESSIONS = 'sessions';
  static USER_STATS = 'user_stats';
  static DAILY_SESSIONS = 'daily_sessions';
  static SESSION_GAPS = 'session_gaps';
}

export class AppRoutes {
  static LOGIN = '/login';
  static HOME = '/';
  static SETTINGS = '/settings';
  static HISTORY = '/history';
  static STATS = '/stats';
  static NOT_FOUND = '*';
  static AUTHENTICATED_ROUTES = [
    AppRoutes.HOME,
    AppRoutes.HISTORY,
    AppRoutes.STATS,
    AppRoutes.SETTINGS,
  ];
}

export class Constants {
  static ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  static DEFAULT_TARGET_DURATION = 2 * 60 * 60; // 2 hours in seconds
  static DEFAULT_STATS_RANGE = 7; // 7 days
  static FETCH_DAYS = 30; // 30 days
  static MAX_BATCH_SIZE = 500; // firestore max batch size
  static PAGE_SIZE = 10; // pagination page size
}
