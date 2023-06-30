import { Texture } from '@lm/le-webgl';

export function loadTexture(url, gl) {
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
}
