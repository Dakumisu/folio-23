export function clamp(value, min = 0, max = 1) {
	return Math.min(Math.max(value, min), max);
}

export function sqdist(x1, y1, x2, y2) {
	return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
}

export function dist(x1, y1, x2, y2) {
	return Math.sqrt(sqdist(x1, y1, x2, y2));
}

export function isBetween(value, min, max, inclusive = false) {
	return inclusive ? value >= min && value <= max : value > min && value < max;
}

export function map(value, start1, stop1, start2, stop2) {
	return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

export function mean(values) {
	let val = 0;
	const len = values.length;
	for (let i = 0; i < len; i++) val += values[i];
	return val / len;
}

export function median(values = []) {
	const numbers = values.slice(0).sort((a, b) => a - b);
	const middle = Math.floor(numbers.length / 2);
	const isEven = numbers.length % 2 === 0;
	const value = isEven ? (numbers[middle] + numbers[middle - 1]) / 2 : numbers[middle];
	return value;
}

export function mod(dividend, divisor) {
	return ((dividend % divisor) + divisor) % divisor;
}

export function norm(value, min = 0, max = 1) {
	return (value - min) / (max - min);
}

export function smoothstep(min, max, value) {
	const x = clamp((value - min) / (max - min), 0, 1);
	return x * x * (3 - 2 * x);
}
