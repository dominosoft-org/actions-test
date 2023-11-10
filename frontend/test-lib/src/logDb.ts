import type { DBSchema } from 'idb';
import type { LogLevelNames } from './logLevelNames';

/** ログ保存用データベースレコード */
export interface LogDBRecord {
  /** Primary Key */
  id?: number;
  /** 時刻文字列（toISOStringの出力そのまま） */
  time: string;
  /** ログレベル */
  level: LogLevelNames;
  /** 整形したメッセージ */
  message: string;
}

/** ログ保存用データベーススキーマ */
export interface LogDB extends DBSchema {
  /** ログ保存ストアキー */
  logs: {
    /** ログレコード */
    value: LogDBRecord;
    /** キー（ログレコードのidをオートインクリメント） */
    key: number;
  };
}
