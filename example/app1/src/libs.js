let globalStatus = {}
export class globalStatusCenter {
  constructor(onGlobalStateChange,setGlobalState){
    this.onGlobalStateChange = onGlobalStateChange
    this.setGlobalState = setGlobalState;
    globalStatus = this;
  }
}


export { globalStatus }
