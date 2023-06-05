import { Mesh, Post, Texture, Triangle } from '@lm/le-webgl';
import Renderer from './core/Renderer';
import { PixelNoiseMaterial } from './shaders/materials/PixelNoise/PixelNoiseMaterial';

import blueNoiseUrl from '~assets/canvas/blue-noise.png?url';

const pixelPassFragment = /* glsl */ `
precision highp float;

uniform float time;
uniform vec4 resolution;
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

vec2 pixelise(vec2 uv, float pixelSize) {
	return floor(uv / pixelSize) * pixelSize;
}

vec2 zoom(vec2 uv, float zoom) {
	return (uv - .5) / zoom + .5;
}

vec2 offset(vec2 uv, vec2 offset) {
	return uv + offset;
}

vec3 GetBlueNoiseDither(vec3 tex, vec2 pixelCoord, float perPixel){
    vec2 uv = (vec2(pixelCoord) + vec2(0.5)) * perPixel;
    float blueNoiseValue = texture2D(blueNoiseTexture, fract(uv), 0.0).x;

	// return smoothstep(0.5, 1., tex + vec3(blueNoiseValue));
	return step(tex, vec3(blueNoiseValue));
}

#define BlueNoise16(x, coord) GetBlueNoiseDither(x, coord, per16)
#define BlueNoise32(x, coord) GetBlueNoiseDither(x, coord, per32)
#define BlueNoise64(x, coord) GetBlueNoiseDither(x, coord, per64)
#define BlueNoise128(x, coord) GetBlueNoiseDither(x, coord, per128)
#define BlueNoise256(x, coord) GetBlueNoiseDither(x, coord, per256)
#define BlueNoise512(x, coord) GetBlueNoiseDither(x, coord, per512)
#define BlueNoise1024(x, coord) GetBlueNoiseDither(x, coord, per1024)

void main() {
	vec2 ratio = vec2(1., resolution.w);
	vec2 uv = vUv;
	// vec2 uv = gl_FragCoord.xy / resolution.xy;
	// uv *= resolution.z;
	// uv /= ratio;

	// According to the ratio, we need to scale the uv and center it
	float z = resolution.z + .2;
	// uv = zoom(uv, z);
	// uv = offset(uv, vec2(0., (1. - z) * .5));

	// uv = pixelise(uv, .01);

	vec2 coord = gl_FragCoord.xy;
	// coord = pixelise(coord, 2.);

	vec4 tex = texture2D(tMap, uv);
	vec3 ditherTex = BlueNoise256(tex.rgb, coord);
	ditherTex = mix(BlueNoise128(tex.rgb, coord), ditherTex, step(.5, ditherTex * .4));
	gl_FragColor = vec4(1. - ditherTex, 1.);
}
`;

const compositeFragment = /* glsl */ `
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tPixel;
uniform vec4 resolution;

varying vec2 vUv;

vec2 offset(vec2 uv, vec2 offset) {
	return uv + offset;
}

float offset(float uv, float offset) {
	return uv + offset;
}

void main() {
	vec2 ratio = vec2(1., resolution.w) * resolution.z;
	vec2 uv = vUv;

	vec2 rUv = offset(uv, vec2(.002, 0.003));
	vec2 gUv = offset(uv, vec2(-.003, 0.001));
	vec2 bUv = offset(uv, vec2(0.0, -.003));

	float r = texture2D(tPixel, rUv).r;
	float g = texture2D(tPixel, gUv).g;
	float b = texture2D(tPixel, bUv).b;

	vec4 pixel = vec4(r, g, b, 1.);

	vec4 tex = texture2D(tMap, uv);

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

	// const camera = webgl.camera = new BaseCamera(); // TODO: move camera in scene
	// const scene = webgl.scene = new Scene();
	const renderer = webgl.renderer = new Renderer(); // TODO: trigger renderer via scene class

	Object.assign(webgl, { init, resize, update, render, preload });

	function init() {
		// camera.triggerInit();
		renderer.triggerInit();

		const gl = webgl.ctx = renderer.instance.gl; // TODO: make gl ctx variable global in OGL

		// scene.triggerInit();

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
				...webgl.uniforms,
				tPixel: postPixel.uniform,
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

		// rt.setSize(width.value * dpr.value, height.value * dpr.value);
		// postprocess.resize({ width: width.value, height: height.value, dpr: dpr.value });

		// Update post classes
		postComposite.resize({ width: width.value, height: height.value, dpr: dpr.value });
		postPixel.resize({ width: width.value, height: height.value, dpr: dpr.value });
	}

	function update() {
		webgl.uniforms.time.value += 0.01;

		// camera.triggerUpdate();
		// scene.triggerUpdate();
	}

	function render() {
		// renderer.triggerRender();
		// renderer.instance.render({ scene: pixelNoise });

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
