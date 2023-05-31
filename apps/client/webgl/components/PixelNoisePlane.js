import { Mesh, Plane } from '@lm/le-webgl';
import BaseComponent from '~webgl/core/BaseComponent';
import { PixelNoiseMaterial } from '~webgl/shaders/materials/PixelNoiseMaterial';


export default class PixelNoisePlane extends BaseComponent {
	init() {
		const { ctx } = this.webgl; //TODO: make gl global in OGL

		const geometry = new Plane(ctx);
		const program = new PixelNoiseMaterial(ctx);

		const mesh = new Mesh(ctx, { geometry, program });
		// mesh.setParent(this.parent.instance);

		this.base = mesh;
	}

	update() {
		// this.base.rotation.y += 0.01;
	}
}
