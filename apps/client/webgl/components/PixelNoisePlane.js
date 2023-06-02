import { Mesh, Plane } from '@lm/le-webgl';
import BaseComponent from '~webgl/core/BaseComponent';
import { PixelNoiseMaterial } from '~webgl/shaders/materials/PixelNoise/PixelNoiseMaterial';

export default class PixelNoisePlane extends BaseComponent {
	init() {
		const { ctx } = this.webgl; //TODO: make gl global in OGL

		const geometry = new Plane(ctx);
		const program = new PixelNoiseMaterial(ctx);

		const mesh = new Mesh(ctx, { geometry, program });

		this.base = mesh;
	}
}
