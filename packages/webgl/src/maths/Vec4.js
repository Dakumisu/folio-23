import * as Vec4Func from './functions/Vec4Func.js';

export class Vec4 extends Array {
	constructor(x = 0, y = 0, z = 0, w = 0) {
		super(x, y, z, w);
		return this;
	}

	get x() {
		return this[0];
	}

	get y() {
		return this[1];
	}

	get z() {
		return this[2];
	}

	get w() {
		return this[3];
	}

	set x(v) {
		this[0] = v;
	}

	set y(v) {
		this[1] = v;
	}

	set z(v) {
		this[2] = v;
	}

	set w(v) {
		this[3] = v;
	}

	set(x, y, z, w) {
		if (x.length) return this.copy(x);
		Vec4Func.set(this, x, y, z, w);
		return this;
	}

	copy(v) {
		Vec4Func.copy(this, v);
		return this;
	}

	normalize() {
		Vec4Func.normalize(this, this);
		return this;
	}

	multiply(v) {
		Vec4Func.scale(this, this, v);
		return this;
	}

	dot(v) {
		return Vec4Func.dot(this, v);
	}

	fromArray(a, offset = 0) {
		this[0] = a[offset];
		this[1] = a[offset + 1];
		this[2] = a[offset + 2];
		this[3] = a[offset + 3];
		return this;
	}

	toArray(a = [], offset = 0) {
		a[offset] = this[0];
		a[offset + 1] = this[1];
		a[offset + 2] = this[2];
		a[offset + 3] = this[3];
		return a;
	}
}
