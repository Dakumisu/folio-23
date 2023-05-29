export function debounce(fn, delay = 1, opts = {}) {
	const thisArg = opts.bind || null;
	const trail = opts.trail != null ? !!opts.trail : true;

	let pa1, pa2, pa3; // proxy args
	let timeout;
	let needTrail = trail;

	function delayed() {
		timeout = null;
		if (trail) needTrail = true;
		fn.call(thisArg, pa1, pa2, pa3);
	}

	return function (a1, a2, a3) {
		if (timeout) clearTimeout(timeout);

		pa1 = a1;
		pa2 = a2;
		pa3 = a3;

		if (trail && needTrail) {
			needTrail = false;
			fn.call(thisArg, pa1, pa2, pa3);
		}

		timeout = setTimeout(delayed, delay);
	};
}
