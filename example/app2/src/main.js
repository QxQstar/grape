import Vue from 'vue';
// import { isInGrape,GrapeLifecycle } from '../../../src/index.js';
import { isInGrape ,GrapeLifecycle } from '@hydesign/grape';
import App from './App.vue';
import router from './router';
Vue.config.productionTip = false;
console.log('app222222',isInGrape())
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
