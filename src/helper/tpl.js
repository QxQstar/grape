export function getInlineCode(match) {
    const start = match.indexOf('>') + 1;
    const end = match.lastIndexOf('<');
    return match.substring(start, end);
}
