const stack = new Set();

const api = {
	stack,
	held: false,
	holdEmits,
	releaseEmits,
	batchUpdates,
};

function holdEmits() {
	api.held = true;
}

function releaseEmits() {
	api.held = false;
	stack.forEach(emit);
	stack.clear();
}

function emit(signal) {
	signal._emit();
}

function batchUpdates(cb) {
	return function (a, b, c) {
		holdEmits();
		cb(a, b, c);
		releaseEmits();
	};
}

export default api;
