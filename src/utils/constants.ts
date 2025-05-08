export class DB {
  static USER_SETTINGS = 'user_settings';
  static USER_SESSIONS = 'user_sessions';
  static SESSIONS = 'sessions';
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
  static DEFAULT_TARGET_DURATION = 2 * 60 * 60; // 2 hours in seconds
}
