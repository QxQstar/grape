import {DEFAULT_APP_CONFIG, OPTS_CONFIG} from "./constants";
import {isFunction} from './utils.js'

let resultOpts = null;

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

function setOpts(opts) {
    resultOpts = {
        ...OPTS_CONFIG,
        ...opts
    };
}

export function getRepeatParams() {

    return {
        repeatNum:resultOpts.repeatNum,
        repeatInterval:resultOpts.repeatInterval
    }
}
export function verifyOpts(opts){
    setOpts(opts);

    return new Promise(function (resolve, reject) {
        if(!isFunction(resultOpts.fetch)) reject('fetch is not function');
        else resolve();
    })
}
