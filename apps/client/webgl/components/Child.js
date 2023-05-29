import { Box, Mesh, NormalProgram } from '@lm/le-webgl';
import BaseComponent from '~webgl/core/BaseComponent';

export default class Child extends BaseComponent {
	init() {
		const { ctx } = this.webgl; //TODO: make gl global in OGL

		const geometry = new Box(ctx);
		const program = NormalProgram(ctx);

		const mesh = new Mesh(ctx, { geometry, program });
		// mesh.setParent(this.parent.instance);

		this.base = mesh;
	}

	update() {
		this.base.rotation.y += 0.01;
	}
}
