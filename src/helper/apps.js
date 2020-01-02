import {DEFAULT_APP_CONFIG} from "./constants";
let started = false;

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
function isFunction(obj) {
    return typeof obj === 'function';
}
export function verifyOpts(opts){
    return new Promise(function (resolve, reject) {
        if(!isFunction(opts.fetch)) reject('fetch is not function');
         else resolve();
    })
}

export function formatApps(apps) {
    return apps.map(app => {
        const appConfig = {
            ...DEFAULT_APP_CONFIG,
            ...app,
        };
        return {
            ...appConfig,
            path:Array.isArray(appConfig.path) ? appConfig.path : [appConfig.path]
        }
    });
}

export function isStarted() {
    return started;
}

export function setStarted(value) {
    started = value;
}
