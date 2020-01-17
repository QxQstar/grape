import {registerApplication, start} from 'single-spa'
import {loadSourceBootstrap,insertSourceBootstrap} from "./loadSource.js";
import Loader from './loader/index.js'
import {activeFns,isStarted,setStarted,apps} from './helper/apps.js'
import {LOAD_ERROR,LOADED} from './helper/constants.js'
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
                apps.changeAppStatus(app,LOADED);
                register(app);
            },() => {
                apps.changeAppStatus(app,LOAD_ERROR)
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
        // 入口函数 app 的入口文件，并且得到入口文件中暴露的钩子函数
        Loader.import(app.main).then(resData => {
            if(resData.bootstrap && resData.mount && resData.unmount) {
                resolve(resData);
            } else {
                reject(`${app.name} 的 bootstrap ，mount 或者 unmount 不存在`)
            }
        })
    })
}
function register(app) {
    loadAppIndex(app).then(appIndexData => {
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
    },(msg) => {
        apps.changeAppStatus(app,LOAD_ERROR);
        console.error(msg);
    });
}
