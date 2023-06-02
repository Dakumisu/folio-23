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

void main() {
	vec2 uv = vUv;

	vec2 pixelUv = pixelise(uv, .01); // effet de transition cool
	vec2 uvZoom = zoom(uv, 2.);
	vec2 uvZoom2 = zoom(uv, 2.);

	vec2 animatedUvNoise = uvZoom + vec2(time * .03);
	vec4 noise = texture2D(noiseTexture, animatedUvNoise);

	vec2 uvNoise = uvZoom2 + noise.gr * .1 + vec2(time * -.06);
	vec4 animatedNoise = texture2D(noiseTexture, uvNoise);
	vec4 animatedNoise2 = texture2D(noiseTexture, animatedNoise.rg * .3 + vec2(time * .05, time * .01));

	float outerNoise = pow(animatedNoise.b, 1.1) * (pow(animatedNoise2.b, 1.1) * .6) * 3.;
	float pixelNoise = animatedNoise.g;
	pixelNoise = smoothstep(.2, .75, pixelNoise);

	float circleMask = 1. - smoothstep(.25, .5, length(uv - .5));

	gl_FragColor = vec4(outerNoise);
	gl_FragColor = vec4(pixelNoise, pixelNoise, pixelNoise, circleMask);
	// gl_FragColor = vec4(pixelNoise);
}
