import {registerApplication, start} from 'single-spa'
import {loadSourceBootstrap,insertSourceBootstrap} from "./loadSource.js";
import Loader from './loader/index.js'
import {activeFns,isStarted,setStarted,apps as appHelper} from './helper/apps.js'
import {LOAD_ERROR,LOADED,REGISTER_ERROR,REGISTERED} from './helper/constants.js'
export function bootstrapApp(app) {

    registerApp(app);

    if(!isStarted()) {
        setStarted(true);
        start();
    }
}
function registerApp(app) {
    function startRegister(app) {
        // 确保应用挂载点在页面中存在
        if(!app.domID || document.getElementById(app.domID)) {
            // 将入口js依赖的js资源加载完了再注册应用
            Promise.all([
                loadSourceBootstrap(app.outerScripts,'script')(),
                insertSourceBootstrap(app.innerScripts,'script')()
            ]).then(() => {
                register(app);
            },() => {
                appHelper.changeAppStatus(app,LOAD_ERROR)
            });
        } else {
            setTimeout(function () {
                startRegister(app);
            },50)
        }
    }

    startRegister(app);
}

function loadAppIndex(app) {
    return new Promise(function (resolve, reject) {
        // 加载 app 的入口 js 文件，并且得到入口文件中暴露的钩子函数
        Loader.import(app.main).then(resData => {
            appHelper.changeAppStatus(app,LOADED);
            if(resData.bootstrap && resData.mount && resData.unmount) {
                resolve(resData);
            } else {
                reject({
                    msg:`${app.name} 的 bootstrap ，mount 或者 unmount 不存在`,
                    status:REGISTER_ERROR
                })
            }
        },(error) => {
            reject({
                msg:`${app.name} 加载入口 js 失败了 -> ${error}`,
                status:LOAD_ERROR
            });
        })
    })
}
function register(app) {
    loadAppIndex(app).then(appIndexData => {
        appHelper.changeAppStatus(app,REGISTERED);
        registerApplication(
            app.name,
            () => {
                return Promise.resolve(appIndexData).then(resData => {
                    return {
                        bootstrap:[ resData.bootstrap,
                            insertSourceBootstrap(app.innerStyles,'style'),
                            loadSourceBootstrap(app.outerStyles,'link') ],
                        mount:resData.mount,
                        unmount:resData.unmount
                    }
                })
            },
            activeFns(app),
            app.customProps
        )
    },(error) => {
        appHelper.changeAppStatus(app,error.status);
        console.error(error.msg);
    });
}
