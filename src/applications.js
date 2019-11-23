import {registerApplication, start} from 'single-spa'
import {loadSourceBootstrap} from "./loadSource.js";
import Loader from './loader.js';
import {activeFns} from './helper/apps.js'
export function bootstrapApp(apps) {
    registerApp(apps);
    start();
}
function registerApp(projects) {
    projects.forEach(function (project) {
        function startRegister(app) {
            // 确保应用挂载点在页面中存在
            if(!app.domID || document.getElementById(app.domID)) {
                registerApplication(
                    app.name,
                    () => {
                        return Loader.import(app.main).then(resData => {
                            return {
                                bootstrap:[ resData.bootstrap,
                                    loadSourceBootstrap(app.scripts,'script'),
                                    loadSourceBootstrap(app.outerStyles,'link') ],
                                mount:resData.mount,
                                unmount:resData.unmount
                            }
                        })
                    },
                    activeFns(app),
                    app.customProps
                )
            } else {
                setTimeout(function () {
                    startRegister(app);
                },50)
            }
        }

        startRegister(project);
    })
}
