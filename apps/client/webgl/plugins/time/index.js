import { w } from '@lm/utils/state';
import { webgl } from '~webgl/core';

export function timePlugin() {
	let last = performance.now();
	const fps = w(0);

	const api = {
		dt: 0,
		et: 0,
		fps,

		start,
		stop,
		update,
	};

	function start() {
		last = performance.now();
		requestAnimationFrame(update);
	}

	function stop() {
		last = 0;
		cancelAnimationFrame(update);
	}

	function update() {
		const now = performance.now();
		api.dt = (now - last) * 0.001;
		api.et += api.dt;
		last = now;

		fps.set(1000 * api.dt);

		webgl.frame && webgl.frame();

		requestAnimationFrame(update);
	}

	return function install(webgl) {
		webgl.$time = api;
		webgl.hooks.afterInit.watchOnce(start);
	};
}
