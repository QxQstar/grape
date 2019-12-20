import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
import element from 'element-ui';
import App from './App.vue';
// import {cloneDeep} from 'loadsh'
import './mian.css'
import router from './router';
 Vue.use(element);
Vue.config.productionTip = false;
// cloneDeep([444])
const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    render: (h) => h(App),
    router,
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
