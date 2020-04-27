import Vue from 'vue';
import { isInGrape ,GrapeLifecycle } from '../../../src/index.js';
import element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import './mian.css'
import router from './router';

 Vue.use(element);
Vue.config.productionTip = false;
let vueLifecycles = {}
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
    router,
  }).$mount('#main')
}
export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
