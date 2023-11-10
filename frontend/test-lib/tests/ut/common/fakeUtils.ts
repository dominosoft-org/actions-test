import constants from '@/ut/common/constants';
type Awaitable<T> = T | PromiseLike<T>;
type AsyncFunction = () => Awaitable<void>;

/**
 * Fakeした日時を使用する。
 * @param process 実行処理
 */
export async function useFakeTimers(process: AsyncFunction) {
  vi.useFakeTimers();
  const date = new Date(Date.parse(constants.FAKE_SYSTEM_TIME));
  vi.setSystemTime(date);
  await process();
  vi.useRealTimers();
}
