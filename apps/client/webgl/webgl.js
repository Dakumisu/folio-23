import { Mesh, Post, Texture, Triangle } from '@lm/le-webgl';
import Renderer from './core/Renderer';
import { PixelNoiseMaterial } from './shaders/materials/PixelNoise/PixelNoiseMaterial';

import blueNoiseUrl from '~assets/canvas/blue-noise.png?url';

const pixelPassFragment = /* glsl */ `
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
    float blueNoiseValue = texture2D(blueNoiseTexture, fract(uv), 0.0).x;
	return step(tex, vec3(blueNoiseValue));
}

#define BlueNoise16(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per16)
#define BlueNoise32(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per32)
#define BlueNoise64(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per64)
#define BlueNoise128(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per128)
#define BlueNoise256(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per256)
#define BlueNoise512(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per512)
#define BlueNoise1024(x) GetBlueNoiseDither(x, gl_FragCoord.xy, per1024)

vec2 pixelise(vec2 uv, float pixelSize) {
	return floor(uv / pixelSize) * pixelSize;
}

float normSin(float x, float range) {
	return sin(x) * range + range;
}

void main() {
	vec2 uv = vUv;
	vec4 tex = texture2D(tMap, uv);
	vec3 ditherTex = BlueNoise256(tex.rgb);
	ditherTex = mix(BlueNoise128(tex.rgb), ditherTex, step(.5, ditherTex * .4));
	gl_FragColor = vec4(1. - ditherTex, 1.);
}
`;

const compositeFragment = /* glsl */ `
precision highp float;

uniform sampler2D tPixelPass;

varying vec2 vUv;

vec2 offset(vec2 uv, vec2 offset) {
	return uv + offset;
}

void main() {
	vec2 uv = vUv;


	vec2 rUv = offset(uv, vec2(.002, 0.003));
	vec2 gUv = offset(uv, vec2(-.003, 0.001));
	vec2 bUv = offset(uv, vec2(0.0, -.003));

	float r = texture2D(tPixelPass, rUv).r;
	float g = texture2D(tPixelPass, gUv).g;
	float b = texture2D(tPixelPass, bUv).b;

	vec4 pixel = vec4(r, g, b, 1.);

	gl_FragColor = pixel;
}
`;

const loadTexture = (url, gl) => {
	const texture = new Texture(gl, {
		wrapS: gl.REPEAT,
		wrapT: gl.REPEAT,
		generateMipmaps: false,
	});

	// update image value with source once loaded
	const img = new Image();
	img.src = url;
	img.onload = () => texture.image = img;

	return texture;
};

export function createWebgl(webgl) {
	let pixelNoise;
	let postComposite, postPixel, compositePass;

	const renderer = webgl.renderer = new Renderer();

	Object.assign(webgl, { init, resize, update, render, preload });

	function init() {
		renderer.triggerInit();

		const gl = webgl.ctx = renderer.instance.gl; // TODO: make gl ctx variable global in OGL

		const geometry = new Triangle(gl);
		const program = new PixelNoiseMaterial(gl);
		pixelNoise = new Mesh(gl, { geometry, program });

		const { width, height, dpr } = webgl.$viewport;

		// Create composite post at full resolution, and bloom at reduced resolution
		postComposite = new Post(gl, {
			width: width.value,
			height: height.value,
			dpr: dpr.value,
		});

		// `targetOnly: true` prevents post from rendering to canvas
		postPixel = new Post(gl, {
			width: width.value,
			height: height.value,
			dpr: dpr.value,
			targetOnly: true
		});

		postPixel.addPass({
			fragment: pixelPassFragment,
			uniforms: {
				...webgl.uniforms,
				blueNoiseTexture: { value: loadTexture(blueNoiseUrl, gl) }
			},
		});

		// Add final composite pass
		compositePass = postComposite.addPass({
			fragment: compositeFragment,
			uniforms: {
				tPixelPass: postPixel.uniform,
			},
		});
	}

	async function preload() {}

	function resize() {
		const { width, height, dpr, aspectRatio } = webgl.$viewport;
		webgl.uniforms.resolution.value.set(
			width.value,
			height.value,
			1 / dpr.value,
			aspectRatio.value,
		);

		// Update post classes
		postComposite.resize({ width: width.value, height: height.value, dpr: dpr.value });
		postPixel.resize({ width: width.value, height: height.value, dpr: dpr.value });
	}

	function update() {
		webgl.uniforms.time.value = webgl.$time.et;
	}

	function render() {
		// Disable compositePass pass, so this post will just render the scene for now
		compositePass.enabled = false;
		// `targetOnly` prevents post from rendering to the canvas
		postComposite.targetOnly = true;
		// This renders the scene to postComposite.uniform.value
		postComposite.render({ scene: pixelNoise });

		// Passing in a `texture` argument avoids the post initially rendering the scene
		postPixel.render({ texture: postComposite.uniform.value });

		// Re-enable composite pass
		compositePass.enabled = true;
		// Allow post to render to canvas upon its last pass
		postComposite.targetOnly = false;

		// This renders to canvas, compositing the bloom pass on top
		// pass back in its previous render of the scene to avoid re-rendering
		postComposite.render({ texture: postComposite.uniform.value });
	}
}
