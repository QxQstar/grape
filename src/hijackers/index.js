import hijackDynamicStylesheet from './dynamicStylesheet';
import hijackHistoryListener from './historyListener';
import hijackTimer from './timer';
import hijackWindowListener from './windowListener';

export function hijack() {
  return [hijackTimer(), hijackWindowListener(), hijackHistoryListener(), hijackDynamicStylesheet()];
}
