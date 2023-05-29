import * as prettier from 'prettier';
import { parseVue } from './utils/parse-vue';
import { prettierDifferences } from './utils/prettier-differences';

export const create = (context) => {
	// Get the shared settings
	const sharedSettings = context.settings[ 'prettier-vue' ] || {};

	// Get the options of this plugin that provided by user
	const pluginOptions = {
		prettierOptions: context.options[ 0 ] || {},
		usePrettierrc: sharedSettings.usePrettierrc !== false,
		fileInfoOptions: sharedSettings.fileInfoOptions || {},
		SFCBlocksOptions: sharedSettings.SFCBlocks || {},
	};

	const filepath = context.getFilename();

	const prettierRcOptions = pluginOptions.usePrettierrc
		? prettier.resolveConfig.sync(filepath, {
			editorconfig: true,
		})
		: null;

	const fileInfoOptions = {
		resolveConfig: false,
		withNodeModules: false,
		ignorePath: '.prettierignore',
		plugins: prettierRcOptions?.plugins ?? null,
		...pluginOptions.fileInfoOptions,
	};
	const { ignored, inferredParser } = prettier.getFileInfo.sync(
		filepath,
		fileInfoOptions,
	);

	if (ignored) return {};

	const prettierOptions = {
		...prettierRcOptions,
		...pluginOptions.prettierOptions,
		filepath,
	};

	// Get the source code
	const sourceCode = context.getSourceCode().text;

	return {
		Program() {
			if (filepath.endsWith('.vue')) {
				// Handle Vue SFC
				const SFCBlocks = parseVue({
					source: sourceCode,
					filepath,
					options: pluginOptions.SFCBlocksOptions,
				});

				// Run prettier on each of the SFC blocks respectively
				SFCBlocks.forEach(({ source, offset, lang, type }) => {
					// Disguise SFC block as an individual file
					const fakeFilePath = `${ filepath }.${ type }.${ lang }`;

					// Run prettier on this fake file
					prettierDifferences({
						context,
						source,
						options: { ...prettierOptions, filepath: fakeFilePath },
						offset,
					});
				});
			} else {
				// ESLint supports processors that let you extract and lint JS
				// fragments within a non-JS language. In the cases where prettier
				// supports the same language as a processor, we want to process
				// the provided source code as javascript (as ESLint provides the
				// rules with fragments of JS) instead of guessing the parser
				// based off the filename. Otherwise, for instance, on a .md file we
				// end up trying to run prettier over a fragment of JS using the
				// markdown parser, which throws an error.
				// If we can't infer the parser from from the filename, either
				// because no filename was provided or because there is no parser
				// found for the filename, use javascript.
				// This is added to the options first, so that
				// prettierRcOptions and eslintPrettierOptions can still override
				// the parser.

				// `parserBlockList` should contain the list of prettier parser
				// names for file types where:
				// * Prettier supports parsing the file type
				// * There is an ESLint processor that extracts JavaScript snippets
				//   from the file type.
				const initialOptions = {};
				const parserBlockList = [null, 'graphql', 'markdown', 'html'];
				if (parserBlockList.includes(inferredParser)) {
					initialOptions.parser = 'babel';
				}

				// Run prettier on this file
				prettierDifferences({
					context,
					source: sourceCode,
					options: { ...initialOptions, ...prettierOptions },
				});
			}
		},
	};
};
