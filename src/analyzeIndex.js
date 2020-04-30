import { registerApp } from './applications.js'
import { importEntry } from 'import-html-entry';
import { genSandbox } from './sandbox'
import {isFunction,Deferred} from "./helper/utils";
import {getStyleSheets} from './helper/tpl';
import { apps as appHelper} from './helper/apps.js'
import { LOAD_ERROR,LOADING } from './helper/constants.js'
import { getMicroAppStateActions } from './globalState'

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
        const { execScripts,template } = await importEntry(app.projectIndex,{ fetch } = appOpts)
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
        const styleTexts = await getStyleSheets(template)
        const globalVariableExports = window[app.name] || {};
        const {
          bootstrap = globalVariableExports.bootstrap,
          mount = globalVariableExports.mount,
          unmount = globalVariableExports.unmount
        } = exportLifecycles
        if (!isFunction(bootstrap) || !isFunction(mount) || !isFunction(unmount)) {
          throw new Error(`You need to export the functional lifecycles in ${app.name} entry`);
        }
        const appNameId = `${app.name}-${+new Date()}`;
        const {
          onGlobalStateChange,
          setGlobalState,
          offGlobalStateChange
        } = getMicroAppStateActions(appNameId)
        registerApp(app,{
          bootstrap:[bootstrap],
          mount:[
            async () => {
              if(prevAppUnmountedDeferred){
                return prevAppUnmountedDeferred.promise
              }
              return undefined
            },
            async () => {
              styleTexts.forEach(styleText => {
                const styleDom = document.createElement('style');
                styleDom.type='text/css';
                styleDom.className = app.name+'_STYLE'
                const styleTextNode = document.createTextNode(styleText);
                styleDom.appendChild(styleTextNode);
                document.head.appendChild(styleDom);
              })
            },
            // 确保应用挂载点在页面中存在
            async () => {
              return new Promise(resolve => {
                function checkDomID() {
                  if(!app.domID || document.getElementById(app.domID)){
                    resolve()
                  } else {
                    setTimeout(function () {
                      checkDomID();
                    },50)
                  }
                }
                checkDomID()
              })
            },
            mountSandbox,
            async (props) => mount({...props,setGlobalState, onGlobalStateChange}),
            async () => {
              prevAppUnmountedDeferred = new Deferred();
            }
          ],
          unmount:[
            unmount,
            unmountSandbox,
            async () => {
              offGlobalStateChange()
            },
            async () => {
              const className = app.name+'_STYLE'
              const styleDoms = document.head.getElementsByClassName(className)
              for(let i = styleDoms.length - 1; i >= 0; i--){
                const styleDom = styleDoms[i];
                styleDom.parentNode.removeChild(styleDom)
              }
            },
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
