import { s } from '@lm/utils/state';
import { ucfirst } from '@lm/utils/string';
import { createWebgl as decorator } from '~webgl';
import { plugins as rawPlugins } from '~webgl/plugins';
import { shaderProps } from '~webgl/shaders/shaderProps';

const NOOP = () => {};

const HOOKS = ['init', 'preload', 'update', 'render', 'frame', 'resize'].reduce((acc, key) => {
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
		resize: NOOP,
		update: NOOP,
		render: NOOP,
		frame,

		destroy
	};

	shaderProps(api);
	decorator(api);

	assignMethodHook('init', true);
	assignMethodHook('preload', true);
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

		requestAnimationFrame(frame);
	}

	function assignMethodHook(method, isAsync = false) {
		const before = HOOKS[ `before${ ucfirst(method) }` ];
		const after = HOOKS[ `after${ ucfirst(method) }` ];
		const originCall = api[ method ];

		if (isAsync) {
			api[ method ] = async function (...args) {
				before.emit();
				await originCall(...args);
				after.emit();
			};
		} else {
			api[ method ] = function (...args) {
				before.emit();
				originCall(...args);
				after.emit();
			};
		}
	}

	function frame() {
		api.update();
		api.render();
		requestAnimationFrame(frame);
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
