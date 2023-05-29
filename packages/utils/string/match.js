export const match = (str, a) => a.reduce((p, c) => p || !!str.match(c), false);
