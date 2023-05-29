import BaseScene from '~webgl/core/BaseScene';
import Child from './Child';

export default class Scene extends BaseScene {
	init() {
		this.child = this.add(Child);
	}
}
