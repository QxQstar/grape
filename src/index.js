import {analyzeHTML} from './analyzeIndex.js';
import {verifyOpts,getOpts} from './helper/params.js'
import loader from './loader/index.js'
import {apps as appHelper} from "./helper/apps.js";
let originalData = [];
class Grape {
    constructor(apps){
        originalData = apps;
    }
     setImportMap(importMap){
        loader.setImportMap(importMap);
         return this;
    }
    start(opts = {}) {
        verifyOpts(opts).then(() => {
            originalData.forEach(app => Grape.loadApp(app));
        },(err) => {
            console.error(err)
        });

        return this;

    }
    static loadApp(app){
        analyzeHTML(app,getOpts().fetch)
    }
    get apps() {
        return appHelper.data
    }
}

export default Grape;

