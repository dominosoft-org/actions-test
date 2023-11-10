/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LogLevelNames } from './logLevelNames';
import type { LogDBRecord } from './logDb';
/**
 * ロガーの公開インターフェイス。
 * ログレベルは、NLogで採用しているログレベルに準拠している。
 * console.logのログ出力メソッドでは、文字列置換のための%oや%dが使えるが、DBへの保存には使用できない。
 * trace, warn, error, fatalでは、コンソール出力にスタックトレースが出る。
 * ただし、スタックトレースはデータベースに保存しない（というかできない）ので、あくまでコンソール出力限定である。
 */
export interface Logger {
  /** IndexedDBのデータベース名。 */
  readonly dbName: string;
  /** ログの出力レベル。ここで指定したログレベル未満のログは、出力されない。 */
  readonly level: LogLevelNames;
  /** ログの出力レベル（数値）。 */
  readonly levelNumber: number;
  /** ログをデータベースに保存する間隔（ミリ秒）。省略した場合は1000。 */
  readonly debounceWaitMilliseconds: number;
  /** traceレベル(0)での出力。スタックトレースが出る。 */
  trace(message: any, ...optionParams: any[]): void;
  /** debugレベル(1)での出力。スタックトレースが出ない。 */
  debug(message: any, ...optionParams: any[]): void;
  /** infoレベル(2)での出力。スタックトレースが出ない。 */
  info(message: any, ...optionParams: any[]): void;
  /** warnレベル(3)での出力。スタックトレースが出る。 */
  warn(message: any, ...optionParams: any[]): void;
  /** errorレベル(4)での出力。スタックトレースが出る。 */
  error(message: any, ...optionParams: any[]): void;
  /** fatalレベル(5)での出力。ただしconsole.fatalは存在しないので、console.errorを使用する。スタックトレースが出る。 */
  fatal(message: any, ...optionParams: any[]): void;
  /**
   * データベースに保存しているすべてのログを取得する。
   * @param maxCount 取得する最大件数。省略した場合は1000件。
   * */
  getAll(maxCount?: number): Promise<LogDBRecord[]>;
  /**
   * データベースに保存しているすべてのログを削除する。
   * */
  clear(): Promise<void>;
}
