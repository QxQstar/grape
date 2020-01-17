import processTpl from './processTpl.js';
import { bootstrapApp } from './applications.js'
import { getRepeatParams } from './helper/params.js'
import { apps as appHelper} from './helper/apps.js'
import { LOAD_ERROR } from './helper/constants.js'
function getDomain(url) {
    try {
        // URL 构造函数不支持使用 // 前缀的 url
        const href = new URL(url.startsWith('//') ? `${location.protocol}${url}` : url);
        return href.origin;
    } catch (e) {
        return '';
    }
}

export function analyzeHTML(app,fetch) {
    let repeatNum = 0,
        repeatParams = getRepeatParams();

    appHelper.handleApp(app).then((appConf) => {
        fetchHTML(appConf,fetch);
    },(msg) => {

    });

    function fetchHTML(app,fetch) {
        fetch(app.projectIndex,{
            cache:'no-cache'
        })
            .then(response => response.text())
            .then(html => {
                // 从html文件中匹配出这个项目的css，js路径
                const { entry,scripts,innerStyles,outerStyles ,innerScripts } = processTpl(html,getDomain(app.projectIndex));

                // 入口js路径
                app.main = entry;
                app.innerStyles = innerStyles;
                app.outerStyles = outerStyles;
                app.innerScripts = innerScripts;
                app.outerScripts = scripts.filter(item => item !== entry);
                // 注册项目
                bootstrapApp(app);
            },() => {
                if(repeatNum < repeatParams.repeatNum) {
                    repeatNum ++;
                    setTimeout(() => {
                        fetchHTML(app,fetch)
                    },repeatParams.repeatInterval)
                } else {
                    appHelper.changeAppStatus(app,'LOAD_ERROR');
                    window.dispatchEvent(new CustomEvent("grape: app-fetch-fail", app));
                }
            })
    }


}
