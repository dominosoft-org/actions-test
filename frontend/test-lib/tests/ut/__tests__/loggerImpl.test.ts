import { openDB } from 'idb';
import { type DebouncedFunction } from 'ts-debounce';
import type { LogDB, LogDBRecord } from 'src/logDb';
import type { LogLevelNames } from 'src/logLevelNames';
import { LoggerImpl } from 'src/loggerImpl';
import type { Logger } from 'src/logger';
import constants from '@/ut/common/constants';
import { useFakeTimers } from '@/ut/common/fakeUtils';

let logger: LoggerImpl = undefined;

afterEach(async () => {
  // mock解放
  vi.restoreAllMocks();
  // テスト実行ごとにIndexedDBをクリーンする
  if (!logger || !logger['db']) return;
  logger['db'].clear('logs');
  logger['db'].close();
  logger = undefined;
});

describe('constructor()', () => {
  it('メンバ変数に引数が格納され、debouncedStoreが生成される。', async () => {
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );
    expectTypeOf(logger).toMatchTypeOf<Logger>();
    expectTypeOf(logger['debouncedStore']).toMatchTypeOf<DebouncedFunction<any, any>>();
    expect(logger['debouncedStore']).not.toBeUndefined();
    expect(logger.dbName).toBe(constants.DB_NAME_DEFAULT);
    expect(logger.level).toBe(constants.LOG_LEVEL_DEFAULT);
    expect(logger.debounceWaitMilliseconds).toBe(constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT);
  });
});

describe('open()', () => {
  it('IndexedDBを開く。', async () => {
    // 一旦open()をmockして機能しなくしてからcreate()でインスタンス化
    const spy = vi.spyOn(LoggerImpl.prototype as any, 'open').mockImplementation(() => {
      console.log('open() mocked.');
    });
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );
    spy.mockRestore();

    // mock解除した状態でopen()を呼び出す
    await logger['open']();

    expect(logger['db']).not.toBeUndefined();
    expect(logger['db'].name).toBe(constants.DB_NAME_DEFAULT);
    expect(logger['db'].version).toBe(LoggerImpl['DB_VERSION']);
    expect(logger['db'].objectStoreNames[0]).toBe('logs');
  });
});

describe('create()', () => {
  it('コンストラクタに引数が渡されとopen()が呼び出されたのちLoggerImplインスタンスが返される', async () => {
    const spy = vi.spyOn(LoggerImpl.prototype as any, 'open');
    logger = await LoggerImpl.create(constants.DB_NAME_DEFAULT, constants.LOG_LEVEL_DEFAULT, 0);
    expectTypeOf(logger).toMatchTypeOf<Logger>();
    expect(logger.dbName).toBe(constants.DB_NAME_DEFAULT);
    expect(logger.level).toBe(constants.LOG_LEVEL_DEFAULT);
    expect(logger.debounceWaitMilliseconds).toBe(0);
    expect(spy).toBeCalledTimes(1);
  });
});

describe('debouncedStore()', () => {
  it('debounce間隔内に処理が複数回呼び出されても、1度のみ実行すること', async () => {
    const spy = vi.spyOn(LoggerImpl.prototype as any, '_store');
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );

    await useFakeTimers(async () => {
      logger['debouncedStore']();
      logger['debouncedStore']();
      // LoggerImpl._store()実行のdebounce待ち
      vi.advanceTimersByTime(1000);
    });

    expect(spy).toHaveBeenCalledOnce();
  });
});

describe('ログ出力関数テスト', () => {
  /**
   * ログ出力関数の検証mockの生成
   * @param logger LoggerImplインスタンス
   * @param methodName consoleメソッド名期待値
   * @param expectedLevel ログレベル期待値
   * @param expectedMessage ログメッセージ期待値
   * @param expectedOptionParams 追加メッセージ期待値
   */
  const setAssertMock = async (
    logger: LoggerImpl,
    methodName: string,
    expectedLevel: LogLevelNames,
    expectedMessage: any,
    ...expectedOptionParams: any[]
  ) => {
    // LoggerImpl.output()をmock化し、引数をチェック
    const spy = vi.spyOn(logger as any, 'output');
    spy.mockImplementation(
      (consoleMethod: typeof console.trace, logLevel: LogLevelNames, message?: any, ...optionParams: any[]) => {
        expect(consoleMethod.name).toBe(methodName);
        expect(logLevel).toBe(expectedLevel);
        expect(message).toBe(expectedMessage);
        expect(optionParams).toStrictEqual(expectedOptionParams);
      }
    );
  };

  describe('trace()', () => {
    it('引数1つ。output()をTRACEモードで呼び出す。', async () => {
      logger = await LoggerImpl.create(
        constants.DB_NAME_DEFAULT,
        constants.LOG_LEVEL_DEFAULT,
        constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
      );
      setAssertMock(logger, 'trace', 'TRACE', 'trace test.');
      logger.trace('trace test.');
    });

    it('引数複数。output()をTRACEモードで呼び出す。', async () => {
      logger = await LoggerImpl.create(
        constants.DB_NAME_DEFAULT,
        constants.LOG_LEVEL_DEFAULT,
        constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
      );
      setAssertMock(logger, 'trace', 'TRACE', 'trace test.', 'option param1.', 'option param2.');
      logger.trace('trace test.', 'option param1.', 'option param2.');
    });
  });

  describe('debug()', () => {
    it('output()をDEBUGモードで呼び出す。', async () => {
      logger = await LoggerImpl.create(
        constants.DB_NAME_DEFAULT,
        constants.LOG_LEVEL_DEFAULT,
        constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
      );
      setAssertMock(logger, 'debug', 'DEBUG', 'debug test.');
      logger.debug('debug test.');
    });
  });

  describe('info()', () => {
    it('output()をINFOモードで呼び出す。', async () => {
      logger = await LoggerImpl.create(
        constants.DB_NAME_DEFAULT,
        constants.LOG_LEVEL_DEFAULT,
        constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
      );
      setAssertMock(logger, 'info', 'INFO', 'info test.');
      logger.info('info test.');
    });
  });

  describe('warn()', () => {
    it('output()をWARNモードで呼び出す。', async () => {
      logger = await LoggerImpl.create(
        constants.DB_NAME_DEFAULT,
        constants.LOG_LEVEL_DEFAULT,
        constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
      );
      setAssertMock(logger, 'warn', 'WARN', 'warn test.');
      logger.warn('warn test.');
    });
  });

  describe('error()', () => {
    it('output()をERRORモードで呼び出す。', async () => {
      logger = await LoggerImpl.create(
        constants.DB_NAME_DEFAULT,
        constants.LOG_LEVEL_DEFAULT,
        constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
      );
      setAssertMock(logger, 'error', 'ERROR', 'error test.');
      logger.error('error test.');
    });
  });

  describe('fatal()', () => {
    it('output()をFATALモードで呼び出す。', async () => {
      logger = await LoggerImpl.create(
        constants.DB_NAME_DEFAULT,
        constants.LOG_LEVEL_DEFAULT,
        constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
      );
      setAssertMock(logger, 'error', 'FATAL', 'fatal test.');
      logger.fatal('fatal test.');
    });
  });
});

describe('output()', () => {
  describe('LoggerImplインスタンスに設定されているログレベル未満のログレベルで呼び出された場合、処理を行わずreturnされる。', async () => {
    const assertLogLevel = async (instanceLogLevel: LogLevelNames, logLevel: LogLevelNames) => {
      logger = await LoggerImpl.create(constants.DB_NAME_DEFAULT, instanceLogLevel, 1000);
      logger['output'](console.info, logLevel, 'output test.', 'option param1.', 'option param2.');
      const dbVal = await logger['db'].getAll('logs', undefined, 1000);

      expect(logger['logsQueue']).toStrictEqual([]);
      expect(dbVal).toStrictEqual([]);
    };

    it('SILENT', async () => {
      await assertLogLevel('SILENT', 'FATAL');
    });
    it('FATAL', async () => {
      await assertLogLevel('FATAL', 'ERROR');
    });
    it('ERROR', async () => {
      await assertLogLevel('ERROR', 'WARN');
    });
    it('WARN', async () => {
      await assertLogLevel('WARN', 'INFO');
    });
    it('INFO', async () => {
      await assertLogLevel('INFO', 'DEBUG');
    });
    it('DEBUG', async () => {
      await assertLogLevel('DEBUG', 'TRACE');
    });
  });

  /**
   * outputの検証
   * @param expectedQueue logsQueue期待値
   * @param message1 出力するログ情報
   * @param message2 出力するログ情報
   */
  const assertOutput = async (expectedQueue: LogDBRecord[], message1?: any[]) => {
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );
    const spy = vi.spyOn(logger as any, 'debouncedStore');

    await useFakeTimers(async () => {
      logger['output'](console.info, constants.LOG_LEVEL_DEFAULT, ...message1);
      // queueが削除されるのでDB登録前にlogsQueueを検証。debounceまでキューは保管され続ける
      expect(logger['logsQueue']).toStrictEqual(expectedQueue);
      // LoggerImpl._store()実行のdebounce待ち
      vi.advanceTimersByTime(1000);
    });

    expect(spy).toHaveBeenCalledOnce();
  };

  it('message引数1つ。キューにオブジェクトを登録し、DB登録処理を呼び出す。', async () => {
    const expectedQueue: LogDBRecord[] = [
      {
        time: constants.FAKE_SYSTEM_TIME,
        level: constants.LOG_LEVEL_DEFAULT,
        message: 'output test. 1',
      },
    ];
    await assertOutput(expectedQueue, ['output test. 1']);
  });

  it('message引数複数。キューにオブジェクトを登録し、DB登録処理を呼び出する。', async () => {
    const expectedQueue: LogDBRecord[] = [
      {
        time: constants.FAKE_SYSTEM_TIME,
        level: constants.LOG_LEVEL_DEFAULT,
        message: 'output test. 1 {"str":"option param1."} option param2.',
      },
    ];
    await assertOutput(expectedQueue, ['output test. 1', { str: 'option param1.' }, 'option param2.']);
  });

  it('message引数なし。キューにオブジェクト(messageが空)を登録し、DB登録処理を起動する。', async () => {
    const expectedQueue: LogDBRecord[] = [
      {
        time: constants.FAKE_SYSTEM_TIME,
        level: constants.LOG_LEVEL_DEFAULT,
        message: '',
      },
    ];

    await assertOutput(expectedQueue, []);
  });
});

describe('_store()', () => {
  /**
   * _store()の検証
   * @param logger LoggerImplインスタンス
   * @param expectedQueue ログキュー期待値
   * @param testDbVal DB期待値
   */
  const assertStore = async (logger: LoggerImpl, expectedQueue: LogDBRecord[], testDbVal: LogDBRecord[]) => {
    await logger['_store']();
    const db = await openDB<LogDB>(constants.DB_NAME_DEFAULT, LoggerImpl['DB_VERSION']);
    const dbVal = await db.getAll('logs', undefined, 1000);

    expect(logger['logsQueue']).toStrictEqual(expectedQueue);
    expect(dbVal).toStrictEqual(testDbVal);
    db.close();
  };

  it('IndexedDBインスタンスが存在しない場合、処理を行わずreturnされる。', async () => {
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );
    logger['db'] = undefined;

    const expectedQueue: LogDBRecord = {
      time: new Date().toISOString(),
      level: constants.LOG_LEVEL_DEFAULT,
      message: '_store() test.',
    };
    logger['logsQueue'].push(expectedQueue);

    await assertStore(logger, [expectedQueue], []);
  });

  it('ログキューが0件の場合、処理を行わずreturnされる。', async () => {
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );
    await assertStore(logger, [], []);
  });

  it('ログキューが1件以上の場合、DBにレコードが登録される。', async () => {
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );

    const expectedQueue: LogDBRecord = {
      id: 1,
      time: new Date().toISOString(),
      level: constants.LOG_LEVEL_DEFAULT,
      message: '_store() test.',
    };
    logger['logsQueue'].push(expectedQueue);

    await assertStore(logger, [], [expectedQueue]);
  });

  it('ログキューにundefinedが登録されていた場合、DBに追加せず無視する。', async () => {
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );
    logger['logsQueue'].push(undefined);
    await assertStore(logger, [], []);
  });

  it('DBレコード登録中に例外が発生した場合、ログキューが削除される。', async () => {
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );

    const expectedQueue: LogDBRecord = {
      id: 1,
      time: new Date().toISOString(),
      level: constants.LOG_LEVEL_DEFAULT,
      message: '_store() test.',
    };
    // ID重複による例外発生
    logger['logsQueue'].push(expectedQueue);
    logger['logsQueue'].push(expectedQueue);

    await assertStore(logger, [], [expectedQueue]);
  });
});

describe('getAll()', () => {
  it('引数なしの場合、登録されているDBレコードが1000件まで取得される。', async () => {
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );

    const expectedQueue: LogDBRecord[] = [];
    for (let i = 1; i <= 1000; i++) {
      expectedQueue.push({
        id: i,
        time: new Date().toISOString(),
        level: constants.LOG_LEVEL_DEFAULT,
        message: '_store() test.',
      });
    }

    expectedQueue.forEach(async (queue) => await logger['db'].add('logs', queue));
    await logger['db'].add('logs', {
      id: 1001,
      time: new Date().toISOString(),
      level: constants.LOG_LEVEL_DEFAULT,
      message: '_store() test.',
    });

    const dbVal = await logger.getAll();
    expect(dbVal).toStrictEqual(expectedQueue);
  });

  it('引数ありの場合、登録されているDBレコードが指定値の件数分まで取得される。', async () => {
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );

    const expectedQueue: LogDBRecord[] = [];
    for (let i = 1; i <= 3; i++) {
      expectedQueue.push({
        id: i,
        time: new Date().toISOString(),
        level: constants.LOG_LEVEL_DEFAULT,
        message: '_store() test.',
      });
    }

    expectedQueue.forEach(async (queue) => await logger['db'].add('logs', queue));
    await logger['db'].add('logs', {
      id: 4,
      time: new Date().toISOString(),
      level: constants.LOG_LEVEL_DEFAULT,
      message: '_store() test.',
    });

    const dbVal = await logger.getAll(3);
    expect(dbVal).toStrictEqual(expectedQueue);
  });

  it('DBレコードが登録されていない場合、空配列が取得される。', async () => {
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );
    const dbVal = await logger.getAll();
    expect(dbVal).toStrictEqual([]);
  });

  it('IndexedDBインスタンスが存在しない場合、空配列が取得される。', async () => {
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );
    logger['db'] = undefined;

    const dbVal = await logger.getAll();
    expect(dbVal).toStrictEqual([]);
  });
});

describe('clear()', () => {
  it('IndexedDBインスタンスが存在する場合、DBとlogsQueue内容が削除される。', async () => {
    const expectedQueue: LogDBRecord = {
      id: 1,
      time: new Date().toISOString(),
      level: constants.LOG_LEVEL_DEFAULT,
      message: '_store() test.',
    };
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );
    await logger['db'].add('logs', expectedQueue);
    logger['logsQueue'].push(expectedQueue);

    await logger.clear();

    const db = await openDB<LogDB>(constants.DB_NAME_DEFAULT, LoggerImpl['DB_VERSION']);
    const dbVal = await db.getAll('logs', undefined, 1000);
    expect(logger['logsQueue']).toStrictEqual([]);
    expect(dbVal).toStrictEqual([]);
  });

  it('IndexedDBインスタンスが存在しない場合、logsQueueは削除され、DBレコードは削除されない。', async () => {
    logger = await LoggerImpl.create(
      constants.DB_NAME_DEFAULT,
      constants.LOG_LEVEL_DEFAULT,
      constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT
    );
    const expectedQueue: LogDBRecord = {
      id: 1,
      time: new Date().toISOString(),
      level: constants.LOG_LEVEL_DEFAULT,
      message: '_store() test.',
    };
    await logger['db'].add('logs', expectedQueue);
    logger['logsQueue'].push(expectedQueue);

    logger['db'] = undefined;
    await logger.clear();

    const db = await openDB<LogDB>(constants.DB_NAME_DEFAULT, LoggerImpl['DB_VERSION']);
    const dbVal = await db.getAll('logs', undefined, 1000);
    expect(logger['logsQueue']).toStrictEqual([]);
    expect(dbVal).toStrictEqual([expectedQueue]);
  });
});
