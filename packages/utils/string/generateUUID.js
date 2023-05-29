export function generateUUID(uid) {
	let dt = new Date().getTime();
	const uuid = 'xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		let r = (uid + dt + Math.random() * 16) % 16 | 0;
		dt = Math.floor(dt / 16);
		return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
	});
	return uuid;
}
