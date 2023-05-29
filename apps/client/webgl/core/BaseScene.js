import { Transform } from '@lm/le-webgl';
import BaseComponent from './BaseComponent';

// TODO: get scene cam
// TODO: add scenes manager

export default class BaseScene extends BaseComponent {
	beforeInit() {
		this.instance = new Transform();
	}
}
