import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

export function routerPlugin() {
	const api = createRouter({
		history: createWebHistory(),
		routes,
	});

	const originMethod = api.install;

	return function install(app) {
		originMethod.call(api, app);

		const plugins = app.config.globalProperties;
		plugins.$router = api;

		delete api.install;
	};
}

