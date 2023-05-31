import { Mesh, Plane, Texture } from '@lm/le-webgl';
import BaseComponent from '~webgl/core/BaseComponent';
import { PixelNoiseMaterial } from '~webgl/shaders/materials/PixelNoiseMaterial';

import noiseTexture from '~assets/canvas/perlin-noise.png?url';

export default class PixelNoisePlane extends BaseComponent {
	init() {
		const { ctx } = this.webgl; //TODO: make gl global in OGL

		const geometry = new Plane(ctx);

		const texture = new Texture(ctx, {
			wrapS: ctx.REPEAT,
			wrapT: ctx.REPEAT,
			generateMipmaps: false,
		});

		const program = new PixelNoiseMaterial(ctx, {
			uniforms: {
				noiseTexture: { value: texture },
			},
		});

		const mesh = new Mesh(ctx, { geometry, program });
		// mesh.setParent(this.parent.instance);

		this.base = mesh;

		// update image value with source once loaded
		const img = new Image();
		img.src = noiseTexture;
		img.onload = () => texture.image = img;
	}

	update() {
		// this.base.rotation.y += 0.01;
	}
}
