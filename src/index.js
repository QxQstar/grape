import {analyzeAppsHTML} from './analyzeIndex.js';
import {OPTS_CONFIG} from './helper/constants.js'
import {verifyOpts,formatApps} from './helper/apps.js'
import loader from './loader/index.js'
class Grape {
    constructor(apps){
        this.apps = formatApps(apps);
    }
     setImportMap(importMap){
        loader.setImportMap(importMap);
         return this;
    }
    start(opts = {}) {
        const appsOpts = {
            ...OPTS_CONFIG,
            ...opts
        };
        verifyOpts(appsOpts).then(() => {
            analyzeAppsHTML(this.apps,appsOpts.fetch)
        },(err) => {
            console.error(err)
        })

    }
}

export default Grape;

