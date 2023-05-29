export function throttle(cb, delay, { leading = false, trailing = false } = {}) {
	let args, result, timeout;
	let previous = 0;

	return function () {
		const now = new Date();
		if (!previous && !leading) previous = now;
		const remaining = delay - (now - previous);
		const ctx = this;

		const later = function () {
			previous = new Date();
			timeout = null;
			result = cb.apply(ctx, args);
		};

		if (remaining <= 0) {
			clearTimeout(timeout);
			timeout = null;
			previous = now;
			result = cb.apply(ctx, args);
		} else if (!timeout && trailing) {
			timeout = setTimeout(later, remaining);
		}

		return result;
	};
}
