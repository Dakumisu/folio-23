import { createApp } from 'vue';
import AppComponent from './App.vue';
import { plugins as pluginsList } from './plugins';
import './style/main.scss';

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
	// console.log(plugins);
	// await plugins.$webgl.preload && plugins.$webgl.preload();

	// Mount Vue app
	app.mount('#app');
};

document.addEventListener('DOMContentLoaded', onDomReady, { once: true });

export { plugins as app };
