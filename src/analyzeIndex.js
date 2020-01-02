import processTpl from './processTpl.js';
import {bootstrapApp} from './applications.js'
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
            console.error(app.name + ' load error')
        })

}
