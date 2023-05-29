const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function angle(cx, cy, ex, ey) {
	let theta = Math.atan2(ey, ex) - Math.atan2(cy, cx);
	if (theta > Math.PI) theta -= 2 * Math.PI;
	else if (theta <= -Math.PI) theta += 2 * Math.PI;
	return theta;
}

function degToRad(degrees) {
	return degrees * DEG2RAD;
}

function radToDeg(radians) {
	return radians * RAD2DEG;
}

export { angle, degToRad, radToDeg };
