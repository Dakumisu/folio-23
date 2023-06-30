import { Texture } from '@lm/le-webgl';
import { webgl } from '~webgl/core';

export function loaderPlugin() {
	const TYPES = {
		IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
		VIDEO: ['mp4', 'webm', 'ogg'],
		AUDIO: ['mp3', 'wav', 'ogg'],
		JSON: ['json'],
		// MODEL: ['obj', 'fbx', 'gltf', 'glb']
	};

	const LOADERS = {
		IMAGE: loadImage,
		VIDEO: loadVideo,
		AUDIO: loadAudio,
		JSON: loadJson,
		// MODEL: loadModel
	};

	const api = {
		images: {},
		videos: {},
		textures: {},
		audios: {},
		json: {},
		models: {},

		load
	};

	function getType(url) {
		const ext = url.split('.').pop();
		let t = null;

		Object.keys(TYPES).forEach(type => {
			if (TYPES[ type ].includes(ext)) t = type;
		});

		return t;
	}

	async function load(url) {
		const type = getType(url);
		const loader = LOADERS[ type ];

		if (!loader) throw new Error(`No loader found for ${ url }`);

		const result = await loader(url);

		return result;
	}

	async function loadImage(url) {
		const gl = webgl.ctx;

		const texture = new Texture(gl, {
			wrapS: gl.REPEAT,
			wrapT: gl.REPEAT,
			generateMipmaps: false,
		});

		// update image value with source once loaded
		const img = new Image();
		img.src = url;
		img.onload = () => texture.image = img;

		api.images[ url ] = img;
		api.textures[ url ] = texture;

		return texture;
	}

	async function loadVideo(url) {
		const gl = webgl.ctx;

		const texture = new Texture(gl, {
			wrapS: gl.REPEAT,
			wrapT: gl.REPEAT,
			generateMipmaps: false,
		});

		const video = document.createElement('video');
		video.src = url;
		video.addEventListener('loadeddata', () => texture.image = video, { once: true });

		// update image value with source once loaded
		video.load();

		api.videos[ url ] = video;
		api.textures[ url ] = texture;

		return video;
	}

	async function loadAudio(url) {
		const audio = new Audio();
		audio.src = url;
		audio.load();

		api.audios[ url ] = audio;

		return audio;
	}

	async function loadJson(url) {
		const response = await fetch(url);
		const json = await response.json();

		api.json[ url ] = json;

		return json;
	}


	return function install(webgl) {
		webgl.$loader = api;
	};
}
