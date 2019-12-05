/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-09-03 15:04
 */
import {ALL_SCRIPT_REGEX,
	SCRIPT_TAG_REGEX,
	SCRIPT_SRC_REGEX,
	SCRIPT_ENTRY_REGEX,
	LINK_TAG_REGEX,
	STYLE_TAG_REGEX,
	STYLE_TYPE_REGEX,
	STYLE_HREF_REGEX,
	STYLE_IGNORE_REGEX,
	HTML_COMMENT_REGEX,
	SCRIPT_IGNORE_REGEX,
	LINK_IGNORE_REGEX} from './helper/constants.js';
import {
	getInlineCode
} from './helper/tpl.js';
function hasProtocol(url) {
	return url.startsWith('//') || url.startsWith('http://') || url.startsWith('https://');
}

function getBaseDomain(url) {
	return url.endsWith('/') ? url.substr(0, url.length - 1) : url;
}
export const genLinkReplaceSymbol = linkHref => `<!-- link ${linkHref} replaced by import-html-entry -->`;
export const genScriptReplaceSymbol = scriptSrc => `<!-- script ${scriptSrc} replaced by import-html-entry -->`;
export const inlineScriptReplaceSymbol = `<!-- inline scripts replaced by import-html-entry -->`;
export const genIgnoreAssetReplaceSymbol = url => `<!-- ignore asset ${url || 'file'} replaced by import-html-entry -->`;
/**
 * parse the script link from the template
 * 1. collect stylesheets
 * 2. use global eval to evaluate the inline scripts
 *    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Difference_between_Function_constructor_and_function_declaration
 *    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Do_not_ever_use_eval!
 * @param tpl
 * @param domain
 * @stripStyles whether to strip the css links
 * @returns {{template: void | string | *, scripts: *[], entry: *}}
 */
export default function processTpl(tpl, domain) {
	// 外部js脚本
	let scripts = [];
	// 外部样式
	const outerStyles = [];
	// 内嵌样式
	const innerStyles = [];
	// 内嵌js脚本
	const innerScripts = [];
	let entry = null;

	const template = tpl

		/*
		remove html comment first
		*/
		.replace(HTML_COMMENT_REGEX, '')

		.replace(LINK_TAG_REGEX, match => {
			/*
			change the css link
			*/
			const styleType = !!match.match(STYLE_TYPE_REGEX);
			if (styleType) {

				const styleHref = match.match(STYLE_HREF_REGEX);
				const styleIgnore = match.match(LINK_IGNORE_REGEX);

				if (styleHref) {

					const href = styleHref && styleHref[2];
					let newHref = href;

					if (href && !hasProtocol(href)) {
						// 处理一下使用相对路径的场景
						newHref = getBaseDomain(domain) + (href.startsWith('/') ? href : `/${href}`);
					}
					if (styleIgnore) {
						return genIgnoreAssetReplaceSymbol(newHref);
					}

					outerStyles.push(newHref);
					return genLinkReplaceSymbol(newHref);
				}
			}

			return match;
		})
		.replace(STYLE_TAG_REGEX, match => {
			if (STYLE_IGNORE_REGEX.test(match)) {
				return genIgnoreAssetReplaceSymbol('style file');
			} else {
				innerStyles.push(match);
			}
			return match;
		})
		.replace(ALL_SCRIPT_REGEX, match => {
			const scriptIgnore = match.match(SCRIPT_IGNORE_REGEX);
			// in order to keep the exec order of all javascripts

			// if it is a external script
			if (SCRIPT_TAG_REGEX.test(match) && match.match(SCRIPT_SRC_REGEX)) {
				/*
				collect scripts and replace the ref
				*/

				const matchedScriptEntry = match.match(SCRIPT_ENTRY_REGEX);
				const matchedScriptSrcMatch = match.match(SCRIPT_SRC_REGEX);
				let matchedScriptSrc = matchedScriptSrcMatch && matchedScriptSrcMatch[2];

				if (entry && matchedScriptEntry) {
					throw new SyntaxError('You should not set multiply entry script!');
				} else {

					// append the domain while the script not have an protocol prefix
					if (matchedScriptSrc && !hasProtocol(matchedScriptSrc)) {
						matchedScriptSrc = getBaseDomain(domain) + (matchedScriptSrc.startsWith('/') ? matchedScriptSrc : `/${matchedScriptSrc}`);
					}

					entry = entry || matchedScriptEntry && matchedScriptSrc;
				}

				if (scriptIgnore) {
					return genIgnoreAssetReplaceSymbol(matchedScriptSrc || 'js file');
				}

				if (matchedScriptSrc) {
					scripts.push(matchedScriptSrc);
					return genScriptReplaceSymbol(matchedScriptSrc);
				}

				return match;
			} else {
				if (scriptIgnore) {
					return genIgnoreAssetReplaceSymbol('js file');
				}
				// if it is an inline script
				const code = getInlineCode(match);

				// remove script blocks when all of these lines are comments.
				const isPureCommentBlock = code.split(/[\r\n]+/).every(line => !line.trim() || line.trim().startsWith('//'));

				if (!isPureCommentBlock) {
					innerScripts.push(match);
				}

				return inlineScriptReplaceSymbol;
			}
		});

	scripts = scripts.filter(function (script) {
		// filter empty script
		return !!script;
	});

	return {
		template,
		scripts,
		innerStyles,
		outerStyles,
		innerScripts,
		// set the last script as entry if have not set
		entry: entry || scripts[scripts.length - 1],
	};
}
