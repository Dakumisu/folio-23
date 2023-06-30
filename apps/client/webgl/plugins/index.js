import { composerPlugin } from './composer';
import { loaderPlugin } from './loader';
import { timePlugin } from './time';
import { viewportPlugin } from './viewport';

export const plugins = [
	viewportPlugin,
	timePlugin,
	loaderPlugin,
	composerPlugin
];
