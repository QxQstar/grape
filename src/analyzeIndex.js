import { registerApp } from './applications.js'
import { importEntry } from 'import-html-entry';
import { genSandbox } from './sandbox'
import {isFunction,Deferred} from "./helper/utils";
import { apps as appHelper} from './helper/apps.js'
import { LOAD_ERROR,LOADING } from './helper/constants.js'

let prevAppUnmountedDeferred = null;

export function analyzeHTML(app,appOpts) {
    let repeatNum = 0
    appHelper.handleApp(app).then((appConf) => {
        appHelper.changeAppStatus(app,LOADING);
        fetchHTML(appConf,appOpts);
    },(msg) => {

    });
    async function fetchHTML(app,appOpts) {
      try {
        const { execScripts } = await importEntry(app.projectIndex,{ fetch } = appOpts)
        if(prevAppUnmountedDeferred) await prevAppUnmountedDeferred.promise
        let proxy = window;
        let mountSandbox = () => Promise.resolve();
        let unmountSandbox = () => Promise.resolve();
        if(appOpts.useSandbox) {
          const sandbox = genSandbox(app.name)
          proxy = sandbox.sandbox
          mountSandbox = sandbox.mount
          unmountSandbox = sandbox.unmount
        }
        const exportLifecycles = await execScripts(proxy)
        const globalVariableExports = window[app.name] || {};
        const {
          bootstrap = globalVariableExports.bootstrap,
          mount = globalVariableExports.mount,
          unmount = globalVariableExports.unmount
        } = exportLifecycles
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
            mountSandbox,
            mount,
            async () => {
              prevAppUnmountedDeferred = new Deferred();
            }
          ],
          unmount:[
            unmount,
            unmountSandbox,
            async () => {
              if (prevAppUnmountedDeferred) {
                prevAppUnmountedDeferred.resolve();
              }
            },
          ]
        });
      } catch (e) {
        if(repeatNum < appOpts.repeatNum) {
          repeatNum ++;
          setTimeout(() => {
            fetchHTML(app,appOpts)
          },appOpts.repeatInterval)
        } else {
          appHelper.changeAppStatus(app,'LOAD_ERROR');
          console.error(`${e}`);
          window.dispatchEvent(new CustomEvent("grape: app-html-fetch-fail", app));
        }
      }
    }
}
