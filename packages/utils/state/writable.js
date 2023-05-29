import freezer from './freezer';
import { Readable } from './readable';

class Writable extends Readable {
	set(value, force) {
		if (!force && this.value === value) return;

		this.previous = this.value;
		this.value = value;

		if (freezer.held) return freezer.stack.add(this);

		this._emit();
	}

	_emit() {
		let node = this._first;
		while (node) {
			node.fn.call(node.ctx, this.value, this.previous);

			node.once && this.unwatch(node);
			node = node.next;
		}

		this.previous = null;
	}

	update(cb, force) {
		const value = cb(this.value);
		this.set(value !== undefined ? value : this.value, force);
	}
}

export { Writable };
export default function writable(v) {
	return new Writable(v);
}
