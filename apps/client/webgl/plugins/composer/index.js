import { Post } from '@lm/le-webgl';
import { webgl } from '~webgl/core';
import { loadTexture } from '~webgl/utils/loadTexture';

import CompositeFragment from './CompositePass.frag';
import PixelFragment from './PixelPass.frag';

import blueNoiseUrl from '~assets/canvas/blue-noise.png?url';

export function composerPlugin() {
	const posts = {};
	const passes = {};

	const api = {
		posts,
		passes,

		createPost,
		createPass,

		init,
		resize,
		render
	};

	function init() {
		const gl = webgl.ctx;

		// Create composite post at full resolution, and bloom at reduced resolution
		const postComposite = createPost(gl, 'composite');

		// `targetOnly: true` prevents post from rendering to canvas
		const postPixel = createPost(gl, 'pixel', { targetOnly: true });

		createPass('pixel', postPixel, {
			fragment: PixelFragment,
			uniforms: {
				blueNoiseTexture: { value: webgl.$loader.textures[ blueNoiseUrl ] },
			},
		});

		// Add final composite pass
		createPass('composite', postComposite, {
			fragment: CompositeFragment,
			uniforms: {
				tPixelPass: postPixel.uniform,
			},
		});
	}

	function createPost(gl, name, opts = {}) {
		const { width, height, dpr } = webgl.$viewport;

		const post = new Post(gl, {
			width: width.value,
			height: height.value,
			dpr: dpr.value,
			targetOnly: !!opts.targetOnly,
			...opts
		});
		posts[ name ] = post;

		return post;
	}

	function createPass(name, post, opts = {}) {
		const pass = post.addPass({
			fragment: opts.fragment,
			uniforms: {
				...webgl.uniforms,
				...opts.uniforms
			}
		});
		passes[ name ] = pass;

		return pass;
	}

	function resize() {
		const { width, height, dpr } = webgl.$viewport;

		// Update post classes
		posts.composite.resize({ width: width.value, height: height.value, dpr: dpr.value });
		posts.pixel.resize({ width: width.value, height: height.value, dpr: dpr.value });
	}

	function render({ scene }) {
		// Disable compositePass pass, so this post will just render the scene for now
		passes.composite.enabled = false;
		// `targetOnly` prevents post from rendering to the canvas
		posts.composite.targetOnly = true;
		// This renders the scene to postComposite.uniform.value
		posts.composite.render({ scene });

		// Passing in a `texture` argument avoids the post initially rendering the scene
		posts.pixel.render({ texture: posts.composite.uniform.value });

		// Re-enable composite pass
		passes.composite.enabled = true;
		// Allow post to render to canvas upon its last pass
		posts.composite.targetOnly = false;

		// This renders to canvas, compositing the bloom pass on top
		// pass back in its previous render of the scene to avoid re-rendering
		posts.composite.render({ texture: posts.composite.uniform.value });
	}

	return function install(webgl) {
		webgl.$composer = api;
	};
}
