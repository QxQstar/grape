let started = false;

export function activeFns(project) {
    return isBase(project) ? (function () { return true;}) : (function (location) {
        return isActive(location,project)
    })
}

function isActive(location,project) {
    let curCondition = '';
    if(project.routeMode ==='hash') {
        curCondition = location.hash;
    } else {
        curCondition = location.pathname;
    }

    return project.path.some(path => curCondition.startsWith(path))
}

function isBase(project) {
    return project.base;
}

export function isStarted() {
    return started;
}

export function setStarted(value) {
    started = value;
}
