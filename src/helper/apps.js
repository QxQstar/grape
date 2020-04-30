let started = false;
import {NOT_LOAD,LOAD_ERROR,DEFAULT_APP_CONFIG,REGISTER_ERROR} from './constants.js'

export function activeFns(project) {
    return isBase(project) ? (function () { return true;}) : (function (location) {
        return isActive(location,project)
    })
}

function isActive(location,project) {
    let curCondition = '';
    if(project.routeMode ==='hash') {
        curCondition = location.hash;
    } else {
        curCondition = location.pathname;
    }

    return project.path.some(path => curCondition.startsWith(path))
}

function isBase(project) {
    return project.base;
}

export function isStarted() {
    return started;
}

export function setStarted(value) {
    started = value;
}


export function isInGrape() {
    return !!window.__POWERED_BY_GRAPE__
}
export function setInGrape() {
    return window.__POWERED_BY_GRAPE__ = true;
}

export const apps = {
    data:[],
    findApp(appName){
        return this.data.find(app => app.name === appName);
    },
    changeAppStatus(app,status){
        app.status = status;
        return app;
    },
    formatApp(app){
        const appConfig = {
            ...DEFAULT_APP_CONFIG,
            ...app,
        };
        return {
            ...appConfig,
            path:Array.isArray(appConfig.path) ? appConfig.path : [appConfig.path]
        }
    },
    addApp(app){
        const appConf = this.formatApp(app);
        this.data.push(
            this.changeAppStatus(appConf,NOT_LOAD)
        );

        return appConf;
    },
    handleApp(app){
        return new Promise( (resolve, reject) => {
            const appInData = this.findApp(app.name);
            if(!appInData) {
                const formatApp = this.addApp(app);
                resolve(formatApp);
            } else if(this.needRepeatLoad(appInData)){
                this.changeAppStatus(appInData,NOT_LOAD);
                resolve(appInData);
            } else {
                reject(app.name + ' is loaded')
            }
        });
    },
    needRepeatLoad(app){
       return app.status ===  LOAD_ERROR || app.status === REGISTER_ERROR
    }
}


