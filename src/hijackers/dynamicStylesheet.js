export default function hijack() {
  const rawHtmlAppendChild = HTMLHeadElement.prototype.appendChild;

  let dynamicStyleSheets = [];
  HTMLHeadElement.prototype.appendChild = function appendChild( newChild) {
    // hijack dynamic style injection
    if (newChild.tagName && (newChild.tagName === 'LINK' || newChild.tagName === 'STYLE')) {
      dynamicStyleSheets.push(newChild);
    }

    return rawHtmlAppendChild.call(this, newChild);
  };

  return function free() {
    HTMLHeadElement.prototype.appendChild = rawHtmlAppendChild;
    dynamicStyleSheets.forEach(stylesheet => document.head.removeChild(stylesheet));

    return function rebuild() {
      dynamicStyleSheets.forEach(stylesheet => document.head.appendChild(stylesheet));
      // for gc
      dynamicStyleSheets = [];
    };
  };
}
