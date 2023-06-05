const NOOP = () => {};
const noopObj = { log: NOOP, warn: NOOP, error: NOOP };

let logger;
/// #if !DEBUG
logger = () => noopObj;
/// #else
logger = function logger(prefix, color, background, mute) {
	if (mute) return noopObj;

	const pre = [];
	prefix = prefix.toUpperCase();

	pre.push('%c%s');
	let style = 'font-weight:bold; line-height: 1.2em;';
	if (color) style += `color:${ color };`;
	if (background) style += `background-color:${ background };`;
	style += 'border-radius: 4px;padding: 1px 6px 0;';
	pre.push(style);
	pre.push(prefix);

	return {
		// eslint-disable-next-line no-console
		info: console.debug.bind(console, ...pre),
		// eslint-disable-next-line no-console
		debug: console.debug.bind(console, ...pre),
		// eslint-disable-next-line no-console
		log: console.log.bind(console, ...pre),
		warn: console.warn.bind(console, ...pre),
		error: console.error.bind(console, ...pre),
	};
};
/// #endif

const createLogger = logger;

export default createLogger;
export { createLogger };
