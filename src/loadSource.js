import {getInlineCode} from './helper/tpl.js';


function loadScript(path) {
    const scriptDom = document.createElement('script');
    scriptDom.src=path;
    scriptDom.type='text/javascript';
    document.body.appendChild(scriptDom);

    return scriptDom;
}
function loadLink(path) {
    const linkDom = document.createElement('link');
    linkDom.href=path;
    linkDom.rel='stylesheet';
    document.head.appendChild(linkDom);

    return linkDom;
}

function load(path,type) {
    const dom = type === 'script' ? loadScript(path) : loadLink(path);
    return new Promise(function (resolve) {
        if (dom.readyState) {
            dom.onreadystatechange = () => {
                if (dom.readyState === "complete" || dom.readyState === 'loaded') {
                    dom.onreadystatechange = null;
                    resolve()
                }
            }
        } else {
            dom.onload = function () {
                resolve()
            }
        }
    })
}
// 将外部js脚本/css样式插入文档中
export function loadSourceBootstrap(sourcePath,type='script') {
    return function () {
        return new Promise(function (resolve) {
            (async function traverse () {
                // 确保上一个资源加载完成之后再加载下一个资源
                for(const path of sourcePath) {
                    await load(path,type)
                }
                resolve();
            })()
        })
    }
}


function insertScript(sourceText) {
    const scriptDom = document.createElement('script');
    scriptDom.type='text/javascript';
    scriptDom.innerHTML=sourceText;
    document.body.appendChild(scriptDom);
}
function insertStyle(sourceText) {
    const styleDom = document.createElement('style');
    styleDom.type='text/css';
    const styleTextNode = document.createTextNode(sourceText);
    styleDom.appendChild(styleTextNode);
    document.head.appendChild(styleDom);
}
function insert(source,type) {
    // 得到标签之间的内容
    const sourceText = getInlineCode(source);
    type === 'script' ? insertScript(sourceText) : insertStyle(sourceText);
    return Promise.resolve();

}
// 将内嵌js/css样式插入文档中
export function insertSourceBootstrap(sources,type='script') {
    return function () {
        return new Promise(function (resolve) {
            const allPromise = [];
            sources.forEach(source => {
                allPromise.push(insert(source,type))
            });

            Promise.all(allPromise).then(() => {
                resolve();
            })
        })
    }
}

