import {analyzeHTML} from './analyzeIndex.js';
import {bootstrapApp} from './applications.js'
import {DEFAULT_APP_CONFIG,OPTS_CONFIG} from './helper/constants.js'
import {verifyOpts} from './helper/apps.js'
class Grape {
    constructor(apps){
        this.apps = this.formatApps(apps);
    }
    formatApps(apps){
        return apps.map(app => {
            const appConfig = {
                ...DEFAULT_APP_CONFIG,
                ...app,
            };
            return {
                ...appConfig,
                path:Array.isArray(appConfig.path) ? appConfig : [appConfig.path]
            }
        });
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

