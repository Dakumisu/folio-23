// import { Orbit } from '@lm/le-webgl';
import Scene from './components/Scene';
import BaseCamera from './core/BaseCamera';
import Renderer from './core/Renderer';

export function createWebgl(webgl) {
	let controls;

	const camera = webgl.camera = new BaseCamera(); // TODO: move camera in scene
	const scene = webgl.scene = new Scene();
	const renderer = webgl.renderer = new Renderer();

	Object.assign(webgl, { init, resize, update, render, preload });

	function init() {
		camera.triggerInit();
		renderer.triggerInit();

		// controls = new Orbit(camera.instance, {
		// 	rotateSpeed: 0.01,
		// 	panSpeed: 0.01,
		// });

		webgl.ctx = renderer.instance.gl; // TODO: make gl ctx variable global in OGL

		scene.triggerInit();
	}

	async function preload() {}

	function resize() {
		const { width, height, dpr } = webgl.$viewport;
		webgl.uniforms.resolution.value.set(
			width.value,
			height.value,
			dpr.value,
			1 / dpr.value,
		);
	}

	function update() {
		webgl.uniforms.time.value += 0.01;
		controls && controls.update();
	}

	function render() {}
}
