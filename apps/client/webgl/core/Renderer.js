import { Renderer as OGLRenderer } from '@lm/le-webgl';
import BaseComponent from './BaseComponent';

const DEFAULT_OPTIONS = {
	width: 0,
	height: 0,
	dpr: 0,
	alpha: true,
	antialias: true,
	powerPreference: 'high-performance',
};

/*
	width = 300,
	height = 150,
	dpr = 1,
	alpha = false,
	depth = true,
	stencil = false,
	antialias = false,
	premultipliedAlpha = false,
	preserveDrawingBuffer = false,
	powerPreference = 'default',
	autoClear = true,
	webgl = 2,
*/

export default class Renderer extends BaseComponent {
	constructor(...props) {
		super(...props);

		this.options = Object.assign({}, DEFAULT_OPTIONS, props);
		this.forceWebGL1 = props.forceWebGL1 || false;
		this.clearColor = props.clearColor || [0, 0, 0, 1];
	}

	init() {
		const canvas = this.canvas = this.webgl.canvas;
		const renderer = this.instance = new OGLRenderer({
			...this.options,
			webgl: this.forceWebGL1 ? 1 : 2,
			canvas,
		});

		const gl = renderer.gl;
		gl.clearColor(...this.clearColor);

		this.webgl.hooks.beforeResize.watchImmediate(this.resize, this);
	}

	resize() {
		const { width, height, dpr } = this.webgl.$viewport;
		this.instance.dpr = dpr.value;
		this.instance.setSize(width.value, height.value);
	}

	setClearColor(color) {
		if (!color) return console.error('No color provided');
		this.clearColor = color;
		this.instance.gl.clearColor(...color);
	}

	render() {
		const { scene, camera } = this.webgl;
		// console.log(scene);
		if (!scene?.instance || !camera?.instance)
			return console.error('No scene or camera provided');

		this.instance.render({ scene: scene.instance, camera: camera.instance });
	}

	destroy() {
		this.webgl.hooks.beforeResize.unwatch(this.resize, this);
	}
}
