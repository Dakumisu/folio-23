import { Vec4 } from '@lm/le-webgl';

export function shaderProps(webgl) {
	webgl.uniforms = {
		time: { type: 'f', value: 0 },
		resolution: { type: 'v4', value: new Vec4() },
	};

	webgl.defines = {};
}
