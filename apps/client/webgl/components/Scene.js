import BaseScene from '~webgl/core/BaseScene';
import PixelNoisePlane from './PixelNoisePlane';

export default class Scene extends BaseScene {
	init() {
		this.pixelNoisePlane = this.add(PixelNoisePlane);
	}
}
