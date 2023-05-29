export function hash(text) {
	let hash = 5381,
		index = text.length;
	while (index) hash = (hash * 33) ^ text.charCodeAt(--index);
	return (hash >>> 0).toString(16);
}
