precision highp float;

uniform vec4 resolution;

uniform sampler2D tPixelPass;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
	vec2 ratio = vec2(resolution.w, 1.);

	vec2 uv = vUv;
	vec2 normUv = uv * ratio;
	normUv -= (ratio - 1.) / 2.;

	vec2 rUv = uv + vec2(.000, .001);
	vec2 gUv = uv + vec2(.001, .001);
	vec2 bUv = uv + vec2(.001, -.000);

	float r = texture2D(tPixelPass, rUv).r;
	float g = texture2D(tPixelPass, gUv).g;
	float b = texture2D(tPixelPass, bUv).b;

	vec4 pixel = vec4(r, g, b, 1.);
	pixel = mix(texture2D(tPixelPass, uv), pixel, smoothstep(.5, 1., pow(length(normUv - .5), .1)));
	pixel.rgb *= (1. - smoothstep(.0, .75, pow(length(normUv - .5), .75))) * 2.;

	gl_FragColor = pixel;
}
