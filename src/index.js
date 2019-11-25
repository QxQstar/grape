import {analyzeHTML} from './analyzeIndex.js';
import {bootstrapApp} from './applications.js'
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
        const myOpts = {
            ...OPTS_CONFIG,
            ...opts
        };
        verifyOpts(myOpts).then(() => {
            analyzeHTML(this.apps,myOpts.fetch)
                .then((projects) => {
                    bootstrapApp(projects);
                },() => {
                    console.error('all fail')
                })
        },(err) => {
            console.error(err)
        })

    }
}

export default Grape;

