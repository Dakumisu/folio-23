import { ucfirst } from './ucfirst.js';

const kebabToCamel = (str) =>
	str
		.toLowerCase()
		.replace(/([-][a-z])/g, (group) => group.toUpperCase().replace('-', ''))
		.replace(/-/g, '');

const camelToKebab = (str) =>
	str
		.replace(/([A-Z]+)/g, (word) => ucfirst(word.toLowerCase()))
		.replace(/([A-Z])/g, (letter) => '-' + letter.toLowerCase())
		.toLowerCase()
		.replace(/^-/g, '');

const kebabToPascal = (str) => ucfirst(kebabToCamel(str));
const pascalToKebab = (str) => camelToKebab(str);
const camelToPascal = (str) => ucfirst(str);
const pascalToCamel = (str) => str[0].toLowerCase() + str.substring(1);

export { kebabToCamel, camelToKebab, kebabToPascal, pascalToKebab, camelToPascal, pascalToCamel };
