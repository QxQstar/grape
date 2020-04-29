import { cloneDeep } from 'lodash'
import { isFunction,isObject } from "./helper/utils";

let globalState = {}
const collector = {}

function emitGlobal(state, prevState) {
  Object.keys(collector).forEach(key => {
    const callback = collector[key]
    if(typeof callback === 'function') {
      callback(state,prevState)
    }
  })
}

export function initGlobalState(state) {
  const prevGlobalState = cloneDeep(globalState)
  globalState = cloneDeep(state)
  emitGlobal(globalState, prevGlobalState);

  return getMicroAppStateActions(`global-${+new Date()}`, true)
}

export function getMicroAppStateActions(id, isMaster) {
  return {
    onGlobalStateChange(callback,fireImmediately){
      if(!isFunction(callback)) {
        console.error('callback 必须是函数')
        return ;
      }
      if(collector[id]) {
        console.warn(`${id} 的监听器已经存在，新设置的监听器会覆盖旧的监听器`)
      }
      collector[id] = callback

      const cloneState = cloneDeep(globalState)
      if(fireImmediately) {
        emitGlobal(cloneState,cloneState)
      }
    },
    setGlobalState(state){
      if(!isObject(state)) {
        console.error('state 必须是对象')
        return false;
      }
      const prevGlobalState = cloneDeep(globalState);
      globalState = Object.keys(state).reduce((_globalState, changeKey) => {
        if(isMaster || changeKey in _globalState) {
          return Object.assign(_globalState, { [changeKey]: state[changeKey] });
        }
        console.warn(`在初始化全局 state 时没有定义 ${changeKey}`)
        return _globalState
      }, globalState)

      emitGlobal(cloneDeep(globalState),prevGlobalState)
    },
    offGlobalStateChange(){
      delete collector[id]
      return true;
    }
  }
}
