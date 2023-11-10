import { createLogger } from 'src/index';
import constants from '@/ut/common/constants';
import type { Logger } from 'src/logger';

describe('createLogger()', () => {
  it('引数なしの場合、デフォルト値が格納されたLoggerImplインスタンスを生成する。', async () => {
    const logger = await createLogger();
    expectTypeOf(logger).toMatchTypeOf<Logger>();
    expect(logger.dbName).toBe(constants.DB_NAME_DEFAULT);
    expect(logger.level).toBe(constants.LOG_LEVEL_DEFAULT);
    expect(logger.debounceWaitMilliseconds).toBe(constants.DEBOUNCE_WAIT_MILLISECONDS_DEFAULT);
  });

  it('引数ありの場合、指定値が格納されたLoggerImplインスタンスを生成する。', async () => {
    const logger = await createLogger('testDB', 'ERROR', 0);
    expectTypeOf(logger).toMatchTypeOf<Logger>();
    expect(logger.dbName).toBe('testDB');
    expect(logger.level).toBe('ERROR');
    expect(logger.debounceWaitMilliseconds).toBe(0);
  });
});
