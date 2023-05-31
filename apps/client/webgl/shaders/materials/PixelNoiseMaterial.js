import { Program, Texture } from '@lm/le-webgl';
import { webgl } from '~webgl/core';

import fs from './PixelNoise.frag';
import vs from './PixelNoise.vert';

import noiseTexture from '~assets/canvas/perlin-noise.png?url';

export class PixelNoiseMaterial extends Program {
	constructor(gl, args = {}) {
		const texture = new Texture(gl, {
			wrapS: gl.REPEAT,
			wrapT: gl.REPEAT,
			generateMipmaps: false,
		});

		// update image value with source once loaded
		const img = new Image();
		img.src = noiseTexture;
		img.onload = () => texture.image = img;

		super(gl, {
			vertex: vs,
			fragment: fs,
			uniforms: {
				...webgl.uniforms,
				...args.uniforms,
				noiseTexture: { value: texture },
			},
		});
	}
}
