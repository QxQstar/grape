import { analyzeHTML } from './analyzeIndex.js';
import { verifyOpts,getOpts } from './helper/params.js'
import { start } from 'single-spa'
import { apps as appHelper, setInGrape } from "./helper/apps.js";
import GrapeLifecycle from './lifecycles'
import { isInGrape } from './helper/apps.js'

let originalData = [];
let isStart = false;
export default class Grape {
    constructor(apps = []){
        originalData = apps;
    }
    setImportMap(){
        console.error('此方法已被弃用')
         return this;
    }
    start(opts = {}) {
        isStart = true;
        setInGrape();
        start();
        return new Promise(function (resolve, reject) {
            verifyOpts(opts).then(() => {
                originalData.forEach(app => Grape.loadApp(app));
                resolve();
            },(err) => {
                reject(err)
            });
        })
    }
    static loadApp(app){
        if(isStart) analyzeHTML(app,getOpts());
        else console.error('grape 还没有被启动，调用 grape.start() 去启动 grape')
    }
    get apps() {
        return appHelper.data
    }
}
export { GrapeLifecycle, isInGrape }
export * from './globalState'
