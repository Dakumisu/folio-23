precision highp float;

uniform float time;
uniform vec4 resolution;
uniform sampler2D noiseTexture;

varying vec2 vUv;

const vec3 BLACK = vec3(0.);
const vec3 WHITE = vec3(1.);

vec2 zoom(vec2 uv, float zoom) {
	return (uv - .5) / zoom + .5;
}

vec2 pixelise(vec2 uv, float pixelSize) {
	return floor(uv / pixelSize) * pixelSize;
}

float clampedMap(float value, float min, float max) {
	return clamp((value - min) / (max - min), 0., 1.);
}

void main() {
	vec2 ratio = vec2(resolution.w, 1.);
	float minRes = min(resolution.x, resolution.y);
	// vec2 multRes = vec2(min(resolution.x, resolution.y), max(resolution.x, resolution.y));

	vec2 uv = vUv;
	vec2 normUv = uv * ratio;
	normUv -= (ratio - 1.) / 2.;
	// normUv =mix(zoom(normUv, minRes), normUv, clampedMap(resolution.x, resolution.y, resolution.x));

	vec2 pixelUv = pixelise(uv, .005); // effet de transition cool
	vec2 uvZoom = zoom(uv, 5.);
	vec2 uvZoom2 = zoom(uv, 3.);

	vec2 animatedUvNoise = uvZoom + vec2(time * .035);
	vec4 noise = texture2D(noiseTexture, animatedUvNoise);

	vec2 uvNoise = uvZoom2 + noise.bg * .65 + vec2(time * -.06);
	vec4 animatedNoise = texture2D(noiseTexture, uvNoise);
	vec4 animatedNoise2 = texture2D(noiseTexture, animatedNoise.bg * .3 + vec2(time * .05, time * .01));

	float outerNoise = pow(animatedNoise.b, 1.1) * (pow(animatedNoise2.b, 1.1) * .6) * 3.;
	float pixelNoise = animatedNoise.g;
	pixelNoise = smoothstep(.2, .75, pixelNoise);

	float circleMask = 1. - smoothstep(.25, .5, length(normUv - .5));

	gl_FragColor = vec4(outerNoise);
	gl_FragColor = vec4(pixelNoise, pixelNoise, pixelNoise, circleMask);
	// gl_FragColor = vec4(circleMask, circleMask, circleMask, 1.);
}
