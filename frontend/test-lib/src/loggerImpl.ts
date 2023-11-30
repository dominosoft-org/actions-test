/* eslint-disable @typescript-eslint/no-explicit-any */
import { openDB, type IDBPDatabase } from 'idb';
import { debounce, type DebouncedFunction } from 'ts-debounce';
import type { LogDB, LogDBRecord } from './logDb';
import type { LogLevelNames } from './logLevelNames';
import { toLogLevelNumber } from './logLevels';
import type { Logger } from './logger';

/**
 * ロガーの実装クラス
 */
export class LoggerImpl implements Logger {
  /** データベースのバージョン */
  private static readonly DB_VERSION = 1;
  /** ログ保存用データベース */
  private db?: IDBPDatabase<LogDB>;
  /** @inheritdoc */
  public get levelNumber() {
    return toLogLevelNumber(this.level);
  }
  /**
   * データベースに保存するログを一時的に保管する配列。
   * データベースへの保存は、一定時間ごとにdebounceされて行われるため、一時期な保管が必要。
   */
  private logsQueue: LogDBRecord[] = [];
  /** _storeをdebounceした関数。 */
  private debouncedStore: DebouncedFunction<any, any>;
  /** @inheritdoc */
  public trace = (message: any, ...optionParams: any[]) =>
    this.output(console.trace, 'TRACE', message, ...optionParams);
  /** @inheritdoc */
  public debug = (message: any, ...optionParams: any[]) =>
    this.output(console.debug, 'DEBUG', message, ...optionParams);
  /** @inheritdoc */
  public info = (message: any, ...optionParams: any[]) => this.output(console.info, 'INFO', message, ...optionParams);
  /** @inheritdoc */
  public warn = (message: any, ...optionParams: any[]) => this.output(console.warn, 'WARN', message, ...optionParams);
  /** @inheritdoc */
  public error = (message: any, ...optionParams: any[]) =>
    this.output(console.error, 'ERROR', message, ...optionParams);
  /** @inheritdoc */
  public fatal = (message: any, ...optionParams: any[]) =>
    this.output(console.error, 'FATAL', message, ...optionParams);
  /**
   * コンストラクター。引数を保持する。
   * @param dbName データベース名
   * @param level 出力するログレベル。
   * @param debounceWaitMilliseconds ログをデータベースに保存する間隔（ミリ秒）。
   */
  private constructor(
    public readonly dbName: string,
    public readonly level: LogLevelNames,
    public readonly debounceWaitMilliseconds: number
  ) {
    this.debouncedStore = debounce(this._store, this.debounceWaitMilliseconds);
  }
  /**
   * データベースを開く。
   */
  private async open() {
    this.db = await openDB<LogDB>(this.dbName, LoggerImpl.DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('logs', {
          keyPath: 'id',
          autoIncrement: true,
        });
      },
    });
  }
  /**
   * LoggerImplインスタンスを生成し、データベースを開く。
   * @param dbName データベース名
   * @param level 出力するログレベル。
   * @param debounceWaitMilliseconds ログをデータベースに保存する間隔（ミリ秒）。
   */
  public static async create(dbName: string, level: LogLevelNames, debounceWaitMilliseconds: number) {
    const instance = new LoggerImpl(dbName, level, debounceWaitMilliseconds);
    await instance.open();
    return instance;
  }
  /**
   * ログ出力処理の実態。
   * @param consoleMethod console.xxxメソッド
   * @param logLevel ログレベル
   * @param msg 出力するログ情報
   */
  private output(consoleMethod: typeof console.trace, logLevel: LogLevelNames, message?: any, ...optionParams: any[]) {
    if (toLogLevelNumber(logLevel) < this.levelNumber) return;
    consoleMethod(message, ...optionParams);
    this.logsQueue.push({
      time: new Date().toISOString(),
      level: logLevel,
      message: [message, ...optionParams].map((e) => (typeof e === 'object' ? JSON.stringify(e) : e)).join(' '),
    });
    this.debouncedStore();
  }
  /**
   * 一時保管していたログをすべてデータベースに保存する。
   */
  private async _store() {
    if (this.db == undefined) return;
    if (this.logsQueue.length === 0) return;
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    if (this.logsQueue.length == 1) {
      console.error("err");
    } else {
      console.error("err2");
    }
    try {
      while (this.logsQueue.length > 0) {
        const record = this.logsQueue.shift();
        if (!record) continue;
        await this.db.add('logs', record);
      }
    } catch (ex) {
      console.error(ex);
      this.logsQueue.splice(0);
    }
  }
  /** @inheritdoc */
  public getAll = async (maxCount = 1000) => (await this.db?.getAll('logs', undefined, maxCount)) ?? [];
  /** @inheritdoc */
  public clear = async () => {
    this.logsQueue.splice(0);
    await this.db?.clear('logs');
  };
}
