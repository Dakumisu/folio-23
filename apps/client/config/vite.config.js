import vue from '@vitejs/plugin-vue';
// import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';
// import hotShadersRollupPlugin from './plugins/hotShaders/hotshadersRollupPlugin';
import ifdefRollupPlugin from './plugins/ifdef/ifdefRollupPlugin';
import { getPaths } from './utils/paths';
import glsl from './plugins/glsl';

export default ({ mode = 'development' }) => {
	const isDevelopment = mode === 'development';
	const isProduction = mode === 'production';
	const isStaging = mode === 'staging';

	const MANDATORY_DEFINES = {
		ENVIRONMENT: JSON.stringify(mode),
		DEVELOPMENT: JSON.stringify(isDevelopment),
		PRODUCTION: JSON.stringify(isProduction),
		STAGING: JSON.stringify(isStaging),
		DEBUG: isDevelopment,
	};

	const { paths, pathsAliases } = getPaths();

	return defineConfig({
		root: paths.root,

		base: '/',
		publicDir: paths.public,
		cacheDir: paths.cache,

		server: {
			port: 8085,
			https: false,
			open: false,
			host: true,
			hmr: { port: 8085 },
			watch: { usePolling: true },
		},

		plugins: [
			vue(),
			ifdefRollupPlugin(MANDATORY_DEFINES),
			glsl({
				include: [ // Glob pattern, or array of glob patterns to import
					'**/*.glsl', '**/*.wgsl',
					'**/*.vert', '**/*.frag',
					'**/*.vs', '**/*.fs'
				],
				warnDuplicatedImports: isDevelopment, // Warn if the same chunk was imported multiple times
				compress: !isDevelopment, // Compress output shader code
				watch: true, // Recompile shader on change
			})
			// hotShadersRollupPlugin(isDevelopment),
		],

		define: MANDATORY_DEFINES,
		assetsInclude: /\.(bin|gtlf|glb|ktx|m4a|mp3|aac|obj|draco)$/,
		resolve: {
			alias: pathsAliases,
			extensions: ['.cjs', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.vue'],
		},
	});
};
