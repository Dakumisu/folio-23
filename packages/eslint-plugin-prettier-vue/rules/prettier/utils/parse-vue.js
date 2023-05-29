import { parse } from '@vue/compiler-sfc';
import * as path from 'path';

/**
 * Process SFC Block
 */
const processSFCBlock = ({
	content,
	lang,
	loc,
	type,
}) => {
	if (['template', 'script', 'style'].includes(type)) {
		// `<template>`, `<script>`, `<style>` blocks should be treated as `.vue` file
		// to make the `vueIndentScriptAndStyle` option of prettier works, so we need
		// to wrap them with their original tags
		const startingTag = `<${ type }${ lang ? ` lang="${ lang }"` : '' }>`;
		const endingTag = `</${ type }>\n`;

		const source = `${ startingTag }${ content }${ endingTag }`;

		const offset = loc.start.offset - startingTag.length;

		return { source, offset, lang: 'vue', type };
	}

	// To treat other block as an individual file

	// Remove the starting `\n`
	const source = content.replace(/^\n/, '');

	// As we have removed the starting `\n`, the offset of the block should `+ 1`
	const offset = loc.start.offset + 1;

	return { source, offset, lang: lang || 'vue', type };
};

/**
 * Parse the vue SFC file
 *
 * @param {Object} vueFile
 * @param {string} vueFile.source source code string of the `.vue` file
 * @param {string} vueFile.filepath file path of the `.vue` file
 * @param {Object} vueFile.options options for custom blocks, which is set in `settings['prettier-vue'].SFCBlocks` of `.eslintrc.js`
 *
 * @returns {Array<Object>} returns an array of Object to be used by prettier
 */
export const parseVue = ({
	source,
	filepath,
	options,
}) => {
	const blocksOption = {
		template: options.template ?? false,
		script: options.script ?? false,
		style: options.style ?? false,
	};

	const customBlocksOptions = options.customBlocks || {};

	// Get SFC descriptor by parsing source code
	const { descriptor } = parse(source, {
		filename: path.basename(filepath),
		// do not add pad
		pad: false,
	});

	// Filter SFC blocks
	const SFCBlocks = [template, script, scriptSetup, ...styles]
		.filter((block) => block !== null)
		.filter(({ type }) => blocksOptions[ type ]);

	// Filter SFC custom blocks
	const SFCCustomBlocks = customBlocks
		.filter(
			({ type }) =>
				Object.keys(customBlocksOptions).includes(type) &&
        customBlocksOptions[ type ] !== false,
		)
		.map((block) => {
			if (typeof block.attrs.lang === 'string') {
				block.lang = block.attrs.lang;
				return block;
			}
			// Resolve language of the SFC custom block
			const customBlockOptions = customBlocksOptions[ block.type ];
			if (customBlockOptions) {
				block.lang = customBlockOptions.lang;
			}
			return block;
		});

	// Process all SFC blocks & custom blocks
	return [...SFCBlocks, ...SFCCustomBlocks].map((block) =>
		processSFCBlock(block),
	);
};
