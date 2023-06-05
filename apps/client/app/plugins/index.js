import { routerPlugin } from './router';
import { textShufflePlugin } from './txtShuffle';
import { viewportPlugin } from './viewport';
import { webglPlugin } from './webgl';

export const plugins = [
	routerPlugin,
	viewportPlugin,
	webglPlugin,
	textShufflePlugin
];
