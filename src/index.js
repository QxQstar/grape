import {analyzeHTML} from './analyzeIndex.js';
import {verifyOpts,getOpts} from './helper/params.js'
import loader from './loader/index.js'
import {apps as appHelper} from "./helper/apps.js";
let originalData = [];
let isStart = false;
class Grape {
    constructor(apps = []){
        originalData = apps;
    }
     setImportMap(importMap){
        loader.setImportMap(importMap);
         return this;
    }
    start(opts = {}) {
        isStart = true;
        verifyOpts(opts).then(() => {
            originalData.forEach(app => Grape.loadApp(app));
        },(err) => {
            console.error(err)
        });

        return this;

    }
    static loadApp(app){
        if(isStart) analyzeHTML(app,getOpts().fetch);
        else console.error('grape 还没有被启动，调用 grape.start() 去启动 grape')

    }
    get apps() {
        return appHelper.data
    }
}

export default Grape;

