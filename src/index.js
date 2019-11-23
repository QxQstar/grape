import analyzeHTML from './analyzeIndex.js';
import {bootstrapApp} from './applications.js'
class Grape {
    constructor(apps){
        this.apps = apps;
    }
    start() {
        analyzeHTML(this.apps)
            .then((projects) => {
                bootstrapApp(projects);
            },() => {
                console.error('all fail')
            })
    }
}

export default Grape;

