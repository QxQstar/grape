import { OPTS_CONFIG} from "./constants";
import {isFunction} from './utils.js'

let resultOpts = OPTS_CONFIG;


function setOpts(opts) {
    resultOpts = {
        ...OPTS_CONFIG,
        ...opts
    };
}

export function getOpts() {
    return resultOpts;
}

export function getRepeatParams() {

    return {
        repeatNum:resultOpts.repeatNum,
        repeatInterval:resultOpts.repeatInterval
    }
}
export function verifyOpts(opts){
    setOpts(opts);
    const resultOpts = getOpts();
    return new Promise(function (resolve, reject) {
        if(!isFunction(resultOpts.fetch)) reject('fetch is not function');
        else resolve(resultOpts);
    })
}
