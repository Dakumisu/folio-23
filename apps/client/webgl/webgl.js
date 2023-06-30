import { Mesh, Triangle } from '@lm/le-webgl';
import Renderer from './core/Renderer';
import { PixelNoiseMaterial } from './shaders/materials/PixelNoise/PixelNoiseMaterial';

import blueNoiseUrl from '~assets/canvas/blue-noise.png?url';

export function createWebgl(webgl) {
	let pixelNoise;

	const renderer = webgl.renderer = new Renderer();

	Object.assign(webgl, { init, start, resize, update, render, preload });

	function init() {
		renderer.triggerInit();

		const gl = webgl.ctx = renderer.instance.gl; // TODO: make gl ctx variable global in OGL

		const geometry = new Triangle(gl);
		const program = new PixelNoiseMaterial(gl);
		pixelNoise = new Mesh(gl, { geometry, program });
	}

	function start() {
		webgl.$composer.init();
	}

	async function preload() {
		await webgl.$loader.load(blueNoiseUrl);
	}

	function resize() {
		const { width, height, dpr, aspectRatio } = webgl.$viewport;
		webgl.uniforms.resolution.value.set(
			width.value,
			height.value,
			1 / dpr.value,
			aspectRatio.value,
		);

		// Update composer
		webgl.$composer.resize();
	}

	function update() {
		webgl.uniforms.time.value = webgl.$time.et;
	}

	function render() {
		webgl.$composer.render({ scene: pixelNoise });
	}
}
