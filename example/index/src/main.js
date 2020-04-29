import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { default as  Grape, initGlobalState} from '../../../dist/index.js';
const state = {
  num : 1
}

const action = initGlobalState(state)
action.onGlobalStateChange((state,prevState) => {
  console.log(state,prevState,'主应用中监听')
})

new Grape([
  {
    name:'APP1',
    projectIndex:'http://localhost:9020',
    path:'#/app1'
  },
  {
    name:'APP2',
    projectIndex:'http://localhost:8050',
    path:'#/app2'
  }
]).start({
  useSandbox: true
})
Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
