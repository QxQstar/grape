/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from '../helper/utils';

export default function hijack() {
  const listenerMap = new Map();
  const rawAddEventListener = window.addEventListener;
  const rawRemoveEventListener = window.removeEventListener;

  window.addEventListener = (
    type,
    listener,
    options,
  ) => {
    const listeners = listenerMap.get(type) || [];
    listenerMap.set(type, [...listeners, listener]);
    return rawAddEventListener.call(window, type, listener, options);
  };

  window.removeEventListener = (
    type,
    listener,
    options,
  ) => {
    const storedTypeListeners = listenerMap.get(type);
    if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
      storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
    }
    return rawRemoveEventListener.call(window, type, listener, options);
  };

  return function free() {
    listenerMap.forEach((listeners, type) =>
      [...listeners].forEach(listener => window.removeEventListener(type, listener)),
    );
    window.addEventListener = rawAddEventListener;
    window.removeEventListener = rawRemoveEventListener;

    return noop;
  };
}
