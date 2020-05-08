import Vue from 'vue';
import { isInGrape ,GrapeLifecycle } from '@hydesign/grape';
import element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import './mian.css'
import router from './router';
import {globalStatusCenter} from './libs'

 Vue.use(element);
Vue.config.productionTip = false;
let vueLifecycles = {}
console.log('app-aaapp-aaaa111111')
// 在 grape 中运行
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
export const mount = (props) => {
  props.onGlobalStateChange((statue,prevState) => {
    console.log(statue,prevState,'app1 中监听')
  })
  new globalStatusCenter(props.onGlobalStateChange,props.setGlobalState)
  return vueLifecycles.mount(props)
}
export const unmount = vueLifecycles.unmount;
