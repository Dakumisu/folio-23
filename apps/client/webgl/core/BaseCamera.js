import { Camera as OGLCamera } from '@lm/le-webgl';
import BaseComponent from './BaseComponent';

export default class BaseCamera extends BaseComponent {
	init() {
		const camera = this.instance = new OGLCamera();

		camera.position.z = 2;
		camera.lookAt([ 0, 0, 0 ]);

		this.webgl.hooks.beforeResize.watchImmediate(this.resize, this);
	}

	resize() {
		const { aspectRatio } = this.webgl.$viewport;
		this.instance.perspective({
			aspect: aspectRatio.value,
		});
	}

	destroy() {
		this.webgl.hooks.beforeResize.unwatch(this.resize, this);
	}
}
