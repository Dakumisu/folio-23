function SignalListener(owner, fn, ctx, once) {
	this.fn = fn;
	this.ctx = ctx || null;
	this.owner = owner;
	this.once = !!once;
}

function removeNode(node) {
	if (!node || !node.owner) return;

	if (node.prev) node.prev.next = node.next;
	if (node.next) node.next.prev = node.prev;
	const owner = node.owner;
	node.ctx = node.fn = node.owner = null;
	if (node === owner._first) owner._first = node.next;
	if (node === owner._last) owner._last = node.prev;
}

class Signal {
	constructor() {
		this._first = this._last = null;
		this._isStoreSignal = true;
	}

	emit(a0, a1, a2) {
		let node = this._first;
		while (node) {
			node.fn.call(node.ctx, a0, a1, a2);
			node.once && this.unwatch(node);
			node = node.next;
		}
	}

	watch(fn, ctx, { once = false, immediate = false } = {}) {
		const node = new SignalListener(this, fn, ctx, once);
		if (!this._first) {
			this._first = node;
			this._last = node;
		} else {
			this._last.next = node;
			node.prev = this._last;
			this._last = node;
		}

		if (immediate) fn.call(ctx, this.value);

		return node;
	}

	watchOnce(fn, ctx) {
		return this.watch(fn, ctx, { once: true });
	}

	watchImmediate(fn, ctx) {
		return this.watch(fn, ctx, { immediate: true });
	}

	unwatch(fn, ctx) {
		if (fn instanceof SignalListener) return removeNode(fn);
		if (!ctx) ctx = null;
		let node = this._first;
		while (node) {
			if (node.fn === fn && node.ctx === ctx) removeNode(node);
			node = node.next;
		}
	}

	unwatchAll() {
		let node = this._first;
		this._first = this._last = null;
		while (node) {
			removeNode(node);
			node = node.next;
		}
	}
}

function signal() {
	return new Signal();
}

const unwatch = removeNode;
export { Signal, signal, unwatch };
