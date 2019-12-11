import processTpl from './processTpl.js';
function getDomain(url) {
    try {
        // URL 构造函数不支持使用 // 前缀的 url
        const href = new URL(url.startsWith('//') ? `${location.protocol}${url}` : url);
        return href.origin;
    } catch (e) {
        return '';
    }
}
export function analyzeHTML(projects,fetch) {
    return new Promise(function (resolve, reject) {
        const successProjects = [];
        const failProjects = [];
        projects.forEach(project => {
            fetch(project.projectIndex,{
                headers: {
                    'Cache-Control': 'max-age=0'
                },
            })
                .then(response => response.text())
                .then(html => {
                    // 从html文件中匹配出这个项目的css，js路径
                    const { entry,scripts,innerStyles,outerStyles ,innerScripts } = processTpl(html,getDomain(project.projectIndex));
                    // 入口js路径
                    project.main = entry;
                    project.innerStyles = innerStyles;
                    project.outerStyles = outerStyles;
                    project.innerScripts = innerScripts;
                    project.outerScripts = scripts.filter(item => item !== entry);
                    successProjects.push(project);
                },() => {
                    failProjects.push(project);
                    console.error(project.name + ' load error')
                })
                .then(() => {
                    // 所以的promise的状态都改变之后返回结果
                    if(successProjects.length + failProjects.length >= projects.length) {
                        if(successProjects.length >0 ) resolve(successProjects);
                        else reject(failProjects);
                    }
                });
        })
    })
}
