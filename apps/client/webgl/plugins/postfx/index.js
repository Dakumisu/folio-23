
export function postfxPlugin() {
	const api = {

	};

	return function install(webgl) {
		webgl.$postfx = api;
	};
}
