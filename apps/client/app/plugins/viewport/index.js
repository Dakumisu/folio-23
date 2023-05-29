import { debounce } from '@lm/utils/async';
import { reactive } from 'vue';

export function viewportPlugin() {
	const api = reactive({
		width: 0,
		height: 0,
		dpr: 0,
	});

	const dbResize = debounce(resize, 200);

	window.addEventListener('resize', dbResize);

	function resize() {
		api.width = window.innerWidth;
		api.height = window.innerHeight;
		api.dpr = window.devicePixelRatio;
	}

	return function install(app) {
		app.provide('viewport', api);

		const plugins = app.config.globalProperties;
		plugins.$viewport = api;

		resize();
	};
}
