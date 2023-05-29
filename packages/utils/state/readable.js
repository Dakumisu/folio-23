import { Signal } from './signal';

class Readable extends Signal {
	constructor(initialValue) {
		super();
		this.value = initialValue;
	}

	get() {
		return this.value;
	}

	watchImmediate(fn, ctx) {
		const signal = this.watch(fn, ctx);
		fn.call(ctx, this.value, this.previous);
		return signal;
	}
}

export { Readable };
export default function readable(v) {
	return new Readable(v);
}
