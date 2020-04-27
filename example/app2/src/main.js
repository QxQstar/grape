import Vue from 'vue';
import { isInGrape,GrapeLifecycle } from '../../../src/index.js';

import App from './App.vue';
import router from './router';
Vue.config.productionTip = false;

let vueLifecycles = {};
if(isInGrape()) {
  vueLifecycles = GrapeLifecycle({
    Vue,
    appOptions: {
      render: (h) => h(App),
      router,
    },
  });
} else {
  new Vue({
    render: (h) => h(App),
    router
  }).$mount('#main')
}

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
