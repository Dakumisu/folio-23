import './style/main.scss';

import { createApp } from 'vue';
import AppComponent from './App.vue';
import { plugins as pluginsList } from './plugins';

let plugins = null;

const onDomReady = async () => {
	// Create Vue app
	const app = createApp(AppComponent);

	// install custom Vue plugins
	for (let i = 0; i < pluginsList.length; i++) {
		const plugin = pluginsList[ i ];
		app.use(plugin());
	}

	// Expose plugins to global scope
	plugins = app.config.globalProperties;

	/// #if DEBUG
	window.$plugins = plugins;
	window.app = app;
	/// #endif

	// Await preloading stuffs
	// if (plugins.$webgl.preload) await plugins.$webgl.preload();

	// Mount Vue app
	app.mount('#app');
};

document.addEventListener('DOMContentLoaded', onDomReady, { once: true });

export { plugins as app };
