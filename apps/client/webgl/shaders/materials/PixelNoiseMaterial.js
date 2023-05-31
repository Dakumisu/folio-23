import { Program } from '@lm/le-webgl';
import { webgl } from '~webgl/core';

import fs from './PixelNoise.frag';
import vs from './PixelNoise.vert';

export class PixelNoiseMaterial extends Program {
	constructor(gl, args = {}) {
		super(gl, {
			vertex: vs,
			fragment: fs,
			uniforms: {
				...webgl.uniforms,
				...args.uniforms
			},
		});
	}
}
