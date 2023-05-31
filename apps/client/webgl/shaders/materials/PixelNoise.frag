precision highp float;

uniform float time;
uniform vec4 resolution;
uniform sampler2D noiseTexture;

varying vec2 vUv;

const vec3 BLACK = vec3(0.);
const vec3 WHITE = vec3(1.);

vec2 zoom(vec2 uv, float zoom) {
	return (uv - 0.5) / zoom + 0.5;
}

vec2 pixelise(vec2 uv, float pixelSize) {
	return floor(uv / pixelSize) * pixelSize;
}

vec4 sharpenMask(sampler2D tex, float factor) {
    // Sharpen detection matrix [0,1,0],[1,-4,1],[0,1,0]
    // Colors
	vec4 up = texture2D(tex, (vUv + vec2(0., 1.) * .001));
	vec4 left = texture2D(tex, (vUv + vec2(-1., 0.) * .001));
	vec4 center = texture2D(tex, vUv);
	vec4 right = texture2D(tex, (vUv + vec2(1., 0.) * .001));
	vec4 down = texture2D(tex, (vUv + vec2(0., -1.) * .001));

    // Return edge detection
	return (1.0 + 4.0 * factor) * center - factor * (up + left + right + down);
}

vec4 sharpenMask(sampler2D tex, float factor, vec2 uv) {
    // Sharpen detection matrix [0,1,0],[1,-4,1],[0,1,0]
    // Colors
	vec4 up = texture2D(tex, (uv + vec2(0., 1.) * .001));
	vec4 left = texture2D(tex, (uv + vec2(-1., 0.) * .001));
	vec4 center = texture2D(tex, uv);
	vec4 right = texture2D(tex, (uv + vec2(1., 0.) * .001));
	vec4 down = texture2D(tex, (uv + vec2(0., -1.) * .001));

    // Return edge detection
	return (1.0 + 4.0 * factor) * center - factor * (up + left + right + down);
}


// float getNeighbor(float x, float y) {
// 	vec2 uv = vUv + (vec2(x, y) / resolution.xy);
// 	return texture2D(noiseTexture, uv.xy).r;
// }

void main() {
	vec2 uv = vUv;
	vec2 pixelUv = pixelise(uv, 0.005);
	vec2 uvZoom = zoom(uv, 4.);
	vec2 uvZoom2 = zoom(uv, 5.);

	vec2 animatedUvNoise = uvZoom + vec2(time * .07, time * 0.01);
	// vec4 noise = sharpenMask(noiseTexture, 4., uvZoom + vec2(time * .01, time * 0.01));
	vec4 noise = texture2D(noiseTexture, animatedUvNoise);

	vec2 uvNoise = uvZoom2 + noise.rr * 0.1 + vec2(time * -.03, time * -0.04);
	vec4 animatedNoise = texture2D(noiseTexture, uvNoise);
	vec4 animatedNoise2 = texture2D(noiseTexture, animatedNoise.rg * 0.3 + vec2(time * .05, time * 0.01));

	float innerNoise = pow(animatedNoise.b, 1.1) * (pow(animatedNoise2.b, 1.1) * .6) * 3.;
	float pixelNoise = animatedNoise.g;

	vec3 color = mix(WHITE, BLACK, smoothstep(.25, .75, pixelNoise));

	gl_FragColor = vec4(uv, 0.0, 1.0);
	gl_FragColor = vec4(innerNoise);
	gl_FragColor = vec4(pixelNoise);

	// gl_FragColor = sharpenMask(noiseTexture, 256.);
	// gl_FragColor = vec4(resolution.xy, 0.0, 1.0);

	// float NW = getNeighbor(-1., 1.);
	// float NN = getNeighbor(0., 1.);
	// float NE = getNeighbor(1., 1.);
	// float WW = getNeighbor(-1., 0.);
	// float CC = getNeighbor(0., 0.);
	// float EE = getNeighbor(1., 0.);
	// float SW = getNeighbor(-1., -1.);
	// float SS = getNeighbor(0., -1.);
	// float SE = getNeighbor(1., -1.);

	// float pixel = 1.;
}
