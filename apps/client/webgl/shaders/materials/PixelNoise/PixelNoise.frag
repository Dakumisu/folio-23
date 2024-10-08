precision highp float;

uniform float time;
uniform float seed;
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

float normSin(float x, float range) {
	return sin(x) * range + range;
}

vec2 offset(vec2 uv, vec2 offset) {
	return uv + offset;
}

void main() {
	float _time = time * .4 + seed;
	vec2 ratio = vec2(resolution.w, 1.);

	vec2 uv = vUv;
	vec2 normUv = uv * ratio;
	normUv -= (ratio - 1.) / 2.;

	vec2 pixelUv = pixelise(uv, normSin(_time, .005)); // effet de transition cool
	vec2 uvZoom = zoom(uv, 5.);
	vec2 uvZoom2 = zoom(uv, 3.);

	vec2 animatedUvNoise = uvZoom + vec2(_time * .035);
	vec4 noise = texture2D(noiseTexture, animatedUvNoise);

	vec2 uvNoise = uvZoom2 + noise.bg * .65 + vec2(_time * -.06);
	vec4 animatedNoise = texture2D(noiseTexture, uvNoise);
	vec4 animatedNoise2 = texture2D(noiseTexture, animatedNoise.bg * .3 + vec2(_time * .05, _time * .01));

	float outerNoise = pow(animatedNoise.b, 1.1) * (pow(animatedNoise2.b, 1.1) * .6) * 3.;
	float pixelNoise = animatedNoise.g;
	pixelNoise = smoothstep(.4, .65, pixelNoise);
	pixelNoise *= .7;

	// Steping the pixel noise
	// pixelNoise = floor(pixelNoise * 25.) / 25.;

	float circleMask = 1. - smoothstep(.25, .5, length(normUv - .5));
	circleMask = circleMask + (outerNoise * .45 * (1. - circleMask));

	gl_FragColor = vec4(vec3(pixelNoise), circleMask);
}
