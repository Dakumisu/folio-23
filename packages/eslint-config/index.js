module.exports = {
	root: true,

	env: {
		browser: true,
		node: true,
		es2021: true,
	},

	extends: [
		'plugin:vue/vue3-recommended',
		// 'plugin:prettier-vue/recommended',
		'eslint:recommended',
	],

	plugins: [],

	// settings: {
	// 	'@lm/prettier-vue': {
	// 		// Settings for how to process Vue SFC Blocks
	// 		SFCBlocks: {
	// 			template: false,
	// 			script: false,
	// 			style: true,

	// 			// Settings for how to process custom blocks
	// 			customBlocks: {
	// 				docs: { lang: 'markdown' },
	// 				config: { lang: 'json' },
	// 				module: { lang: 'js' },
	// 				comments: false,
	// 			},
	// 		},

	// 		// Use prettierrc for prettier options or not (default: `true`)
	// 		usePrettierrc: false,
	// 	},
	// },

	// Common build folder
	ignorePatterns: ['dist', 'build', '.cache/build', '.cache/dist'],

	parserOptions: {
		ecmaVersion: 2021,
	},

	// Often used rules in vitevue
	globals: {
		DEBUG: 'readonly',
		DEVELOPMENT: 'readonly',
		ENVIRONMENT: 'readonly',
	},

	overrides: [
		{
			files: ['*.vue'],
			rules: {
				indent: 'off',
			},
		},
		{
			files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
			rules: {
				// 'vue/script-indent': 'off',
				'array-bracket-spacing': 'off',
			},
		},
	],

	settings: {},

	rules: {
		// ---------------------  A  ------------------------
		'array-bracket-spacing': [
			'error',
			'always',
			{
				singleValue: true,
				arraysInArrays: false,
			},
		],

		// ---------------------  B  ------------------------
		'block-spacing': ['error', 'always'],
		'brace-style': [
			'error',
			'1tbs',
			{
				allowSingleLine: true,
			},
		],

		// ---------------------  C  ------------------------
		camelcase: 0,
		'comma-spacing': [
			'error',
			{
				before: false,
				after: true,
			},
		],
		'comma-style': [2, 'last'],
		'computed-property-spacing': ['error', 'always'],
		curly: 0,

		// ---------------------  D  ------------------------

		// ---------------------  E  ------------------------
		'eol-last': ['error', 'always'],

		// ---------------------  F  ------------------------
		'func-call-spacing': ['error', 'never'],

		// ---------------------  G  ------------------------

		// ---------------------  H  ------------------------

		// ---------------------  I  ------------------------
		indent: [
			'error',
			'tab',
			{
				SwitchCase: 1,
			},
		],

		// ---------------------  J  ------------------------

		// ---------------------  K  ------------------------
		'key-spacing': [
			'error',
			{
				beforeColon: false,
			},
		],
		'keyword-spacing': [
			'error',
			{
				before: true,
				after: true,
			},
		],

		// ---------------------  L  ------------------------

		// ---------------------  M  ------------------------
		'max-len': [
			'error',
			{
				code: 300,
				ignoreStrings: true,
				ignoreRegExpLiterals: true,
				ignoreTemplateLiterals: true,
				ignoreUrls: true,
			},
		],

		// ---------------------  N  ------------------------
		'new-parens': ['error'],
		'no-case-declarations': 0,
		'no-cond-assign': 0,
		'no-console': [
			'warn',
			{
				allow: ['warn', 'error'],
			},
		],
		'no-debugger': ['warn'],
		'no-extra-semi': 1,
		'no-mixed-spaces-and-tabs': 'error',
		'no-multi-spaces': 2,
		'no-return-assign': 0,
		'no-tabs': 0,
		'no-trailing-spaces': [
			'error',
			{
				skipBlankLines: false,
			},
		],
		'no-undef': 0,
		'no-unused-vars': 1,
		'no-var': 1,
		'no-whitespace-before-property': ['error'],

		// ---------------------  O  ------------------------
		'object-curly-spacing': ['error', 'always'],

		// ---------------------  P  ------------------------
		// '@lm/prettier-vue/prettier': [
		// 	'error',
		// 	{
		// 		// printWidth: 100,
		// 		// tabWidth: 4,
		// 		// useTabs: true,
		// 		// semi: true,
		// 		singleQuote: true,
		// 		// trailingComma: 'all',
		// 		// bracketSpacing: true,
		// 		// arrowParens: 'always',
		// 		// jsxBracketSameLine: false,
		// 		vueIndentScriptAndStyle: true,
		// 	},
		// ],
		'padded-blocks': [
			'error',
			{
				blocks: 'never',
				switches: 'never',
				classes: 'never',
			},
		],
		// Rule disabled as it tends to be frustrating when tweaking values
		// 'prefer-const': [ 'error', {
		// 	'destructuring': 'any',
		// 	'ignoreReadBeforeAssign': false
		// } ],

		// ---------------------  Q  ------------------------
		quotes: [
			'error',
			'single',
			{
				allowTemplateLiterals: true,
				avoidEscape: true,
			},
		],

		// ---------------------  R  ------------------------
		'require-await': 0,

		// ---------------------  S  ------------------------
		semi: [
			'error',
			'always',
			{
				omitLastInOneLineBlock: true,
			},
		],
		'semi-spacing': [
			'error',
			{
				before: false,
				after: true,
			},
		],
		'space-before-blocks': [
			'error',
			{
				functions: 'always',
				keywords: 'always',
				classes: 'always',
			},
		],
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'ignore',
			},
		],
		'space-in-parens': ['error', 'never'],
		'space-infix-ops': ['error'],
		'space-unary-ops': [
			'error',
			{
				words: true,
				nonwords: false,
			},
		],

		// ---------------------  T  ------------------------
		'template-curly-spacing': ['error', 'always'],

		// ---------------------  U  ------------------------

		// ---------------------  V  ------------------------
		'vue/html-indent': ['error', 'tab'],
		'vue/html-self-closing': [
			'error',
			{
				// Disable self closing for HTML tags
				// Because it tends to break syntax highliter a bit
				html: {
					void: 'never',
					normal: 'never',
					component: 'always',
				},
				svg: 'always',
				math: 'always',
			},
		],
		'vue/script-indent': [
			'warn',
			'tab',
			{
				baseIndent: 1,
			},
		],
		'vue/one-component-per-file': 0,
		'vue/max-len': [
			'error',
			{
				code: 100,
				template: 80,
				tabWidth: 2,
				comments: 80,
				ignoreComments: true,
				ignoreTrailingComments: true,
				ignoreUrls: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				ignoreRegExpLiterals: true,
				ignoreHTMLAttributeValues: true,
				ignoreHTMLTextContents: true,
			},
		],
		'vue/multi-word-component-names': 0,
		'vue/no-v-html': 0,
		'vue/require-prop-types': 0,

		// ---------------------  W  ------------------------
		// ---------------------  X  ------------------------
		// ---------------------  Y  ------------------------
		// ---------------------  Z  ------------------------
	},
};
