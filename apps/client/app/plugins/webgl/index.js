import { createWebgl } from '~webgl/core';
import WebglComponent from './webgl.vue';

export function webglPlugin() {
	const canvas = document.createElement('canvas');
	const api = createWebgl(canvas);

	return function install(app) {
		app.component('WebGL', WebglComponent);
		app.provide('webgl', api);

		const plugins = app.config.globalProperties;
		plugins.$webgl = api;

		api.$app = plugins; // Surcharge the webgl instance with the app's plugins

		// Start the webgl instance
		api.install();
	};
}
