import processTpl from './processTpl.js';
import { bootstrapApp } from './applications.js'
import { getRepeatParams } from './helper/params.js'
function getDomain(url) {
    try {
        // URL 构造函数不支持使用 // 前缀的 url
        const href = new URL(url.startsWith('//') ? `${location.protocol}${url}` : url);
        return href.origin;
    } catch (e) {
        return '';
    }
}
export function analyzeAppsHTML(apps,fetch) {
    apps.forEach(app => {
        analyzeHTML(app,fetch);
    })
}

function analyzeHTML(app,fetch) {
    let repeatNum = 0,
        repeatParams = getRepeatParams();

    function startFetch(app,fetch) {
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
                        startFetch(app,fetch)
                    },repeatParams.repeatInterval)
                } else {
                    window.dispatchEvent(new CustomEvent("grape: app-fetch-fail", app));
                    console.error(app.name + ' load error')
                }
            })
    }

    startFetch(app,fetch);
}
