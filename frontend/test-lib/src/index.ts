import type { LogLevelNames } from './logLevelNames';
import type { Logger } from './logger';
import { LoggerImpl } from './loggerImpl';

/**
 * ロガー機能を有効にする。
 * @param dbName ログを保存するIndexedDBのデータベース名。省略した場合は'nfwLogsDB'。
 * @param level 出力するログレベル。'SILENT'を指定するとログ出力を行わない。
 * @param debounceWaitMilliseconds ログをデータベースに保存する間隔（ミリ秒）。省略した場合は1000。
 */
const createLogger = (
  dbName = 'nfwLogsDB',
  level: LogLevelNames = 'INFO',
  debounceWaitMilliseconds = 1000
): Promise<Logger> => {
  return LoggerImpl.create(dbName, level, debounceWaitMilliseconds);
};

export { createLogger, type Logger };
