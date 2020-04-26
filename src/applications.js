import { registerApplication } from 'single-spa'
import { activeFns } from './helper/apps.js'

export function registerApp(app,lifecycles) {
    function startRegister(app) {
        // 确保应用挂载点在页面中存在
        if(!app.domID || document.getElementById(app.domID)) {
            // 将入口js依赖的js资源加载完了再注册应用
            register(app,lifecycles);
        } else {
            setTimeout(function () {
                startRegister(app);
            },50)
        }
    }
    startRegister(app);
}
function register(app,lifecycles) {
    registerApplication(
      app.name,
      () => {
          return Promise.resolve().then(() => {
              return lifecycles
          })
      },
      activeFns(app),
      app.customProps
    )
}
