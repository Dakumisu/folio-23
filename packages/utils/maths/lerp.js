export function lerp(start, end, t = 0.5) {
	return start * (1 - t) + end * t;
}

export function lerpPrecise(start, end, t = 0.5, limit = 0.001) {
	const v = start * (1 - t) + end * t;
	return Math.abs(end - v) < limit ? end : v;
}

export function damp(a, b, smoothing = 0.5, dt) {
	return lerp(a, b, 1 - Math.exp(-smoothing * 0.05 * dt));
}

export function dampPrecise(a, b, smoothing = 0.5, dt, limit) {
	return lerpPrecise(a, b, 1 - Math.exp(-smoothing * 0.05 * dt), limit);
}

export function vLerp(start, end, t = 0.5) {
	if (!isNaN(start.x) && !isNaN(end.x)) start.x = lerp(start.x, end.x, t);
	if (!isNaN(start.y) && !isNaN(end.y)) start.y = lerp(start.y, end.y, t);
	if (!isNaN(start.z) && !isNaN(end.z)) start.z = lerp(start.z, end.z, t);
	if (!isNaN(start.w) && !isNaN(end.w)) start.w = lerp(start.w, end.w, t);
	return start;
}

export function vLerpPrecise(start, end, t = 0.5, limit = 0.001) {
	if (!isNaN(start.x) && !isNaN(end.x)) start.x = lerpPrecise(start.x, end.x, t, limit);
	if (!isNaN(start.y) && !isNaN(end.y)) start.y = lerpPrecise(start.y, end.y, t, limit);
	if (!isNaN(start.z) && !isNaN(end.z)) start.z = lerpPrecise(start.z, end.z, t, limit);
	if (!isNaN(start.w) && !isNaN(end.w)) start.w = lerpPrecise(start.w, end.w, t, limit);
	return start;
}

export function vDamp(start, end, t = 0.5, dt) {
	if (!isNaN(start.x) && !isNaN(end.x)) start.x = damp(start.x, end.x, t, dt);
	if (!isNaN(start.y) && !isNaN(end.y)) start.y = damp(start.y, end.y, t, dt);
	if (!isNaN(start.z) && !isNaN(end.z)) start.z = damp(start.z, end.z, t, dt);
	if (!isNaN(start.w) && !isNaN(end.w)) start.w = damp(start.w, end.w, t, dt);
	return start;
}

export function vDampPrecise(start, end, t = 0.5, dt, limit = 0.001) {
	if (!isNaN(start.x) && !isNaN(end.x)) start.x = dampPrecise(start.x, end.x, t, dt, limit);
	if (!isNaN(start.y) && !isNaN(end.y)) start.y = dampPrecise(start.y, end.y, t, dt, limit);
	if (!isNaN(start.z) && !isNaN(end.z)) start.z = dampPrecise(start.z, end.z, t, dt, limit);
	if (!isNaN(start.w) && !isNaN(end.w)) start.w = dampPrecise(start.w, end.w, t, dt, limit);
	return start;
}

const PI = Math.PI;
const PI2 = PI * 2;

export function rLerp(start, end, t = 0.5) {
	const s = Math.sign(end);
	const delta = ((end - start + PI2 + PI) % PI2) - PI;
	return (start + delta * t + s * PI2) % PI2;
}

export function rLerpPrecise(start, end, t = 0.5, limit) {
	const s = Math.sign(end);
	const delta = ((end - start + PI2 + PI) % PI2) - PI;
	const r = (start + delta * t + s * PI2) % PI2;
	return Math.abs(end - r) < limit ? end : r;
}

export function rDamp(start, end, smoothing = 0.5, dt) {
	return rLerp(start, end, 1 - Math.exp(-smoothing * 0.05 * dt));
}

export function rDampPrecise(start, end, smoothing = 0.5, dt, limit) {
	return rLerpPrecise(start, end, 1 - Math.exp(-smoothing * 0.05 * dt), limit);
}
