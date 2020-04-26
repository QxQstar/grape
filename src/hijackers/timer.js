/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { sleep,noop } from '../helper/utils';

export default function hijack() {
  const rawWindowInterval = window.setInterval;
  const rawWindowTimeout = window.setTimeout;
  const timerIds = [];
  const intervalIds = [];

  window.setInterval = (...args) => {
    const intervalId = rawWindowInterval.apply(null,args);
    intervalIds.push(intervalId);
    return intervalId;
  };

  window.setTimeout = (...args) => {
    const timerId = rawWindowTimeout.apply(null,args);
    timerIds.push(timerId);
    return timerId;
  };

  return function free() {
    window.setInterval = rawWindowInterval;
    window.setTimeout = rawWindowTimeout;

    timerIds.forEach(async id => {
      // 延迟 timeout 的清理，因为可能会有动画还没完成
      await sleep(500);
      window.clearTimeout(id);
    });
    intervalIds.forEach(id => {
      window.clearInterval(id);
    });

    return noop;
  };
}
