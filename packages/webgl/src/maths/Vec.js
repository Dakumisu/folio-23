// import * as Vec3Func from './functions/Vec3Func.js';

// const CLASS_TYPE = {
// 	2: 'Vec2',
// 	3: 'Vec3',
// 	4: 'Vec4',
// };

// const isVec2 = (v) => v.isVector2;
// const isVec3 = (v) => v.isVector3;
// const isVec4 = (v) => v.isVector4;

// export default class Vec {
// 	constructor(...args) {
// 		// this.prototype.type = CLASS_TYPE[args.length];
// 		return this;
// 	}

// 	get x() {
// 		return this[0];
// 	}
// 	get y() {
// 		return this[1];
// 	}
// 	get z() {
// 		return this[2];
// 	}
// 	get w() {
// 		return this[3];
// 	}

// 	set x(v) {
// 		this[0] = v;
// 	}
// 	set y(v) {
// 		this[1] = v;
// 	}
// 	set z(v) {
// 		this[2] = v;
// 	}
// 	set w(v) {
// 		this[3] = v;
// 	}

// 	set(x, y = x, z = x) {
// 		if (x.length) return this.copy(x);
// 		Vec3Func.set(this, x, y, z);
// 		return this;
// 	}

// 	copy(v) {
// 		Vec3Func.copy(this, v);
// 		return this;
// 	}

// 	add(va, vb) {
// 		if (vb) Vec3Func.add(this, va, vb);
// 		else Vec3Func.add(this, this, va);
// 		return this;
// 	}

// 	sub(va, vb) {
// 		if (vb) Vec3Func.subtract(this, va, vb);
// 		else Vec3Func.subtract(this, this, va);
// 		return this;
// 	}

// 	multiply(v) {
// 		if (v.length) Vec3Func.multiply(this, this, v);
// 		else Vec3Func.scale(this, this, v);
// 		return this;
// 	}

// 	divide(v) {
// 		if (v.length) Vec3Func.divide(this, this, v);
// 		else Vec3Func.scale(this, this, 1 / v);
// 		return this;
// 	}

// 	inverse(v = this) {
// 		Vec3Func.inverse(this, v);
// 		return this;
// 	}

// 	// Can't use 'length' as Array.prototype uses it
// 	len() {
// 		return Vec3Func.length(this);
// 	}

// 	distance(v) {
// 		if (v) return Vec3Func.distance(this, v);
// 		else return Vec3Func.length(this);
// 	}

// 	squaredLen() {
// 		return Vec3Func.squaredLength(this);
// 	}

// 	squaredDistance(v) {
// 		if (v) return Vec3Func.squaredDistance(this, v);
// 		else return Vec3Func.squaredLength(this);
// 	}

// 	negate(v = this) {
// 		Vec3Func.negate(this, v);
// 		return this;
// 	}

// 	cross(va, vb) {
// 		if (vb) Vec3Func.cross(this, va, vb);
// 		else Vec3Func.cross(this, this, va);
// 		return this;
// 	}

// 	scale(v) {
// 		Vec3Func.scale(this, this, v);
// 		return this;
// 	}

// 	normalize() {
// 		Vec3Func.normalize(this, this);
// 		return this;
// 	}

// 	dot(v) {
// 		return Vec3Func.dot(this, v);
// 	}

// 	equals(v) {
// 		return Vec3Func.exactEquals(this, v);
// 	}

// 	applyMatrix3(mat3) {
// 		Vec3Func.transformMat3(this, this, mat3);
// 		return this;
// 	}

// 	applyMatrix4(mat4) {
// 		Vec3Func.transformMat4(this, this, mat4);
// 		return this;
// 	}

// 	scaleRotateMatrix4(mat4) {
// 		Vec3Func.scaleRotateMat4(this, this, mat4);
// 		return this;
// 	}

// 	applyQuaternion(q) {
// 		Vec3Func.transformQuat(this, this, q);
// 		return this;
// 	}

// 	angle(v) {
// 		return Vec3Func.angle(this, v);
// 	}

// 	lerp(v, t) {
// 		Vec3Func.lerp(this, this, v, t);
// 		return this;
// 	}

// 	clone() {
// 		return new Vec3(this[0], this[1], this[2]);
// 	}

// 	fromArray(a, offset = 0) {
// 		this[0] = a[offset];
// 		this[1] = a[offset + 1];
// 		this[2] = a[offset + 2];
// 		return this;
// 	}

// 	toArray(a = [], offset = 0) {
// 		a[offset] = this[0];
// 		a[offset + 1] = this[1];
// 		a[offset + 2] = this[2];
// 		return a;
// 	}

// 	transformDirection(mat4) {
// 		const x = this[0];
// 		const y = this[1];
// 		const z = this[2];

// 		this[0] = mat4[0] * x + mat4[4] * y + mat4[8] * z;
// 		this[1] = mat4[1] * x + mat4[5] * y + mat4[9] * z;
// 		this[2] = mat4[2] * x + mat4[6] * y + mat4[10] * z;

// 		return this.normalize();
// 	}
// }
