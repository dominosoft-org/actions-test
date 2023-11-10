/** 定数クラス */
const CONSTANTS = {
  /** IndexedDB DB名デフォルト値 */
  DB_NAME_DEFAULT: 'nfwLogsDB',
  /** IndexedDB ログレベルデフォルト値 */
  LOG_LEVEL_DEFAULT: 'INFO',
  /** IndexedDB DB保存間隔デフォルト値 */
  DEBOUNCE_WAIT_MILLISECONDS_DEFAULT: 1000,
  /** Fake日時 */
  FAKE_SYSTEM_TIME: '2023-01-01T00:00:00.000Z',
} as const;

export default CONSTANTS;
