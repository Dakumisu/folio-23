precision highp float;

uniform float time;
uniform sampler2D blueNoiseTexture;
uniform sampler2D tMap;

varying vec2 vUv;

const float per16 = 1. / 16.;
const float per32 = 1. / 32.;
const float per64 = 1. / 64.;
const float per128 = 1. / 128.;
const float per256 = 1. / 256.;
const float per512 = 1. / 512.;
const float per1024 = 1. / 1024.;

vec3 GetBlueNoiseDither(vec3 tex, vec2 pixelCoord, float perPixel){
    vec2 uv = (vec2(pixelCoord) + vec2(0.5)) * perPixel;
    float blueNoiseValue = texture2D(blueNoiseTexture, fract(uv)).x;
	return step(tex, vec3(blueNoiseValue));
}

#define BlueNoise16(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per16)
#define BlueNoise32(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per32)
#define BlueNoise64(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per64)
#define BlueNoise128(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per128)
#define BlueNoise256(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per256)
#define BlueNoise512(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per512)
#define BlueNoise1024(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per1024)

void main() {
	vec2 uv = vUv;
	vec4 tex = texture2D(tMap, uv);
	vec3 ditherTex = BlueNoise128(tex.rgb);

	// ditherTex = mix(ditherTex, tex.rgb, tex.rgb * .2);
	// ditherTex = mix(BlueNoise64(tex.rgb), ditherTex, 1. - smoothstep(.0, .3, tex.rgb * .4));

	gl_FragColor = vec4(1. - ditherTex, 1.);
	// gl_FragColor = vec4(mix(vec3(1.,0.,0.), vec3(0.,1.,0.), 1. - smoothstep(.0, .3, tex.rgb * .4)), 1.);

}
