/**
 * ログレベルの定義。SILENTはログを出力しない専用のシンボル。
 * backendのログレベル出力と合わせるため、大文字で定義する。
 */
export type LogLevelNames = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL' | 'SILENT';
