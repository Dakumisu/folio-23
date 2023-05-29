import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import hotShadersRollupPlugin from './plugins/hotShaders/hotshadersRollupPlugin';
import ifdefRollupPlugin from './plugins/ifdef/ifdefRollupPlugin';
// import { paths, pathsAliases } from './utils/paths';
import { getPaths } from './utils/paths';

const { paths, pathsAliases } = getPaths();

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
			hotShadersRollupPlugin(isDevelopment),
		],

		define: MANDATORY_DEFINES,
		assetsInclude: /\.(bin|gtlf|glb|ktx|m4a|mp3|aac|obj|draco)$/,
		resolve: {
			alias: pathsAliases,
			extensions: ['.cjs', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.vue'],
		},
	});
};
