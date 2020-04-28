import {STYLE_IGNORE_REGEX, STYLE_TAG_REGEX} from "./constants";

export function getInlineCode(match) {
    const start = match.indexOf('>') + 1;
    const end = match.lastIndexOf('<');
    return match.substring(start, end);
}

export async function getStyleSheets(template) {
    const result =  []
    template.replace(STYLE_TAG_REGEX,match => {
        if (!STYLE_IGNORE_REGEX.test(match)) {
            const styleContent = getInlineCode(match).trim()
            if(styleContent) {
                result.push(styleContent)
            }
        }
    })
    return result;
}
