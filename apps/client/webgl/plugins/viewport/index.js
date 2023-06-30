import { w } from '@lm/utils/state';
import { watch } from 'vue';

export function viewportPlugin() {
	const api = {
		width: w(0),
		height: w(0),
		size: w([ 0, 0 ]),
		dpr: w(0),
		aspectRatio: w(0),
	};

	function resize(e) {
		const { width, height, dpr } = e;

		api.width.set(width);
		api.height.set(height);
		api.size.set([ api.width, api.height ]);
		api.dpr.set(dpr);
		api.aspectRatio.set(width / height);
	}

	return function install(webgl) {
		webgl.$viewport = api;

		const vp = webgl.$app.$viewport;

		// Start watching viewport changes after webgl is initialized
		webgl.hooks.afterStart.watchOnce(() => {
			// Link the app's viewport plugin to the webgl's viewport plugin
			watch(
				() => [ vp.width, vp.height, vp.dpr ],
				() => {
					resize(vp);
					webgl.resize && webgl.resize();
				},
				{ immediate: true }
			);
		});
	};
}
