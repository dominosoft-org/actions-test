import type { LogLevelNames } from './logLevelNames';

const logLevels = new Map<LogLevelNames, number>([
  ['TRACE', 0],
  ['DEBUG', 1],
  ['INFO', 2],
  ['WARN', 3],
  ['ERROR', 4],
  ['FATAL', 5],
  ['SILENT', 6],
]);
/** ログレベル文字列を、ログレベル数値に変換する。 */
export const toLogLevelNumber = (logLevel: LogLevelNames) => logLevels.get(logLevel) ?? 0;
