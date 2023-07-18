const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

export function angle(cx, cy, ex, ey) {
	let theta = Math.atan2(ey, ex) - Math.atan2(cy, cx);
	if (theta > Math.PI) theta -= 2 * Math.PI;
	else if (theta <= -Math.PI) theta += 2 * Math.PI;
	return theta;
}

export function degToRad(degrees) {
	return degrees * DEG2RAD;
}

export function radToDeg(radians) {
	return radians * RAD2DEG;
}
