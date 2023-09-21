import { s } from '@lm/utils/state';
import { ucfirst } from '@lm/utils/string';
import { plugins as rawPlugins } from '~webgl/plugins';
import { shaderProps } from '~webgl/shaders/shaderProps';
import { createWebgl as decorator } from '~webgl/webgl';

const NOOP = () => {};

const HOOKS = ['init', 'start', 'preload', 'update', 'render', 'frame', 'resize'].reduce((acc, key) => {
	// Create 'before' and 'after' hooks for each methods above
	acc[ `before${ ucfirst(key) }` ] = s();
	acc[ `after${ ucfirst(key) }` ] = s();
	return acc;
}, {});

let instance;

function createWebgl(canvas) {
	canvas = canvas || document.createElement('canvas');

	const api = instance = {
		canvas,
		ctx: null,

		components: {},

		scene: null,
		camera: null,
		renderer: null,

		hooks: HOOKS,

		install,
		installPlugins,

		init: NOOP,
		start: NOOP,
		preload: NOOP,
		resize: NOOP,
		update: NOOP,
		render: NOOP,
		frame,

		destroy
	};

	shaderProps(api);
	decorator(api);

	assignMethodHook('init', true, true);
	assignMethodHook('preload', true, true);
	assignMethodHook('start', false, true);
	assignMethodHook('update');
	assignMethodHook('render');
	assignMethodHook('frame');
	assignMethodHook('resize');

	return api;

	async function installPlugins() {
		for (let i = 0; i < rawPlugins.length; i++) {
			const plugin = rawPlugins[ i ].call();
			await plugin(api);
		}
	}

	async function install() {
		await installPlugins();

		api.init();
		await api.preload();
		api.start();
	}

	function assignMethodHook(method, isAsync = false, once = false) {
		const before = HOOKS[ `before${ ucfirst(method) }` ];
		const after = HOOKS[ `after${ ucfirst(method) }` ];
		const originCall = api[ method ];

		if (isAsync) {
			api[ method ] = async function (a, b, c, d) {
				before.emit();
				await originCall(a, b, c, d);
				after.emit();

				if (once) {
					before.unwatchAll();
					after.unwatchAll();
				}
			};
		} else {
			api[ method ] = function (a, b, c, d) {
				before.emit();
				originCall(a, b, c, d);
				after.emit();

				if (once) {
					before.unwatchAll();
					after.unwatchAll();
				}
			};
		}
	}

	function frame() {
		api.update();
		api.render();
	}

	function destroy() {
		if (api.decorator.destroy) api.decorator.destroy();
		for (let i = 0; i < Object.values(api.components); i++) {
			const component = Object.values(api.components)[ i ];
			if (component && component.isComponent) component.triggerDestroy();
		}
	}
}

function getWebgl() {
	return instance;
}

export { createWebgl, getWebgl, instance as webgl, instance as gl };
