import path from 'path';
import fs from 'fs';

function getPaths() {
	const root = process.cwd();

	const app = path.join(root, 'app');
	const temp = path.join(root, '.cache');

	const paths = {
		root,
		app,
		temp,

		config: path.join(root, 'config'), // Config Entry
		public: path.join(root, 'public'), // Public Folder (for static files)
		cache: path.join(temp, 'vite'), // vite cache
		dist: path.join(temp, 'dist'), // Build folder
		input: path.join(app, 'main.js'), // Main entry point
		webgl: path.join(root, 'webgl.js'), // Main entry point
		html: path.join(root, 'index.html'), // Main html file

		assetsFolder: 'assets',
		staticFolder: 'static',
	};

	// get the path aliases from the jsconfig file
	const pathsAliases = fs
		.readFileSync(path.join(root, 'jsconfig.json'), 'utf8')
		.match(/"paths":\s*{([^}]+)}/)[ 1 ]
		.split(',')
		.slice(0, -1)
		.map((path) => path.trim())
		.map((path) => path.split(':'))
		.map(([_alias, _path]) => {
			if (_path.includes('index')) return null;

			const a = _alias.replace(/"/g, '').replace('/*', '');

			// transform [ "./webgl/*" ] to webgl
			const p = _path
				.replace(/"/g, '')
				.replace(/\.\/|\*|\/|\[|\]/g, '')
				.trim();

			return { find: a, replacement: path.join(root, p) };
		});

	// Clean the array from null values
	pathsAliases.pop();
	pathsAliases.pop();

	return { paths, pathsAliases };
}

export { getPaths };
