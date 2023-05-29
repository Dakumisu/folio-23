import { Orbit } from '@lm/le-webgl';
import Scene from './components/Scene';
import BaseCamera from './core/BaseCamera';
import Renderer from './core/Renderer';

export function createWebgl(core) {
	let controls;

	const camera = core.camera = new BaseCamera(); // TODO: move camera in scene
	const scene = core.scene = new Scene();
	const renderer = core.renderer = new Renderer();

	Object.assign(core, { init, resize, update, render });

	function init() {
		camera.triggerInit();
		renderer.triggerInit();

		// controls = new Orbit(camera.instance, {
		// 	rotateSpeed: 0.01,
		// 	panSpeed: 0.01,
		// });

		core.ctx = renderer.instance.gl; // TODO: make gl ctx variable global in OGL

		scene.triggerInit();
	}

	function resize() {}

	function update() {
		controls && controls.update();
	}

	function render() {}
}
