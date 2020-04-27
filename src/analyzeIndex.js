import { registerApp } from './applications.js'
import { getRepeatParams } from './helper/params.js'
import { importEntry } from 'import-html-entry';
import { genSandbox } from './sandbox'
import {isFunction,Deferred} from "./helper/utils";
import { apps as appHelper} from './helper/apps.js'
import { LOAD_ERROR,LOADING } from './helper/constants.js'

let prevAppUnmountedDeferred = null;

export function analyzeHTML(app,fetch) {
    let repeatNum = 0,
        repeatParams = getRepeatParams();

    appHelper.handleApp(app).then((appConf) => {
        appHelper.changeAppStatus(app,LOADING);
        fetchHTML(appConf,fetch);
    },(msg) => {

    });

    async function fetchHTML(app,fetch) {
        const { execScripts } = await importEntry(app.projectIndex,{ fetch })
        if(prevAppUnmountedDeferred) await prevAppUnmountedDeferred.promise

        const sandbox = genSandbox(app.name)
        execScripts(sandbox.sandbox).then(res => {
            const globalVariableExports = window[app.name] || {};
            const {
                bootstrap = globalVariableExports.bootstrap,
                mount = globalVariableExports.mount,
                unmount = globalVariableExports.unmount
            } = res
            if (!isFunction(bootstrap) || !isFunction(mount) || !isFunction(unmount)) {
                throw new Error(`You need to export the functional lifecycles in ${app.name} entry`);
            }
            registerApp(app,{
                bootstrap:[bootstrap],
                mount:[
                  async () => {
                    if(prevAppUnmountedDeferred){
                        return prevAppUnmountedDeferred.promise
                    }
                    return undefined
                  },
                  sandbox.mount,
                    mount,
                  async () => {
                      prevAppUnmountedDeferred = new Deferred();
                  }
                ],
                unmount:[
                  unmount,
                  sandbox.unmount,
                  async () => {
                    if (prevAppUnmountedDeferred) {
                        prevAppUnmountedDeferred.resolve();
                    }
                  },
                ]
            });
        }).catch((msg) => {
            if(repeatNum < repeatParams.repeatNum) {
                repeatNum ++;
                setTimeout(() => {
                    fetchHTML(app,fetch)
                },repeatParams.repeatInterval)
            } else {
                appHelper.changeAppStatus(app,'LOAD_ERROR');
                console.error(`${msg}`);
                window.dispatchEvent(new CustomEvent("grape: app-html-fetch-fail", app));
            }
        })
    }
}
