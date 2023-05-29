const isNull = (val) => val === null || val === undefined;

function fastRandom(seed) {
	function _seed(s) {
		if ((seed = (s | 0) % 2147483647) <= 0) {
			seed += 2147483646;
		}
	}

	function _nextInt() {
		return (seed = (seed * 48271) % 2147483647);
	}

	function _nextFloat() {
		return (_nextInt() - 1) / 2147483646;
	}

	_seed(seed);

	return {
		seed: _seed,
		nextInt: _nextInt,
		nextFloat: _nextFloat,
	};
}

function prng(seed = 0) {
	let randomizer = fastRandom(seed);
	randomizer.nextFloat();
	randomizer.nextFloat();

	return {
		setSeed,
		random,
		randomInt,
		randomFloat,
		randomFloatSpread,
		randomColor,
		randomDirection,
		hash2d,
		hash2dInt,
	};

	function setSeed(newSeed) {
		seed = newSeed;
		randomizer = fastRandom(seed);
	}

	function random() {
		return randomizer.nextFloat();
	}

	function randomInt(min, max) {
		return Math.floor(randomizer.nextFloat() * (max - min + 1)) + min;
	}

	function randomFloat(min = 0, max = 1) {
		return randomizer.nextFloat() * (max - min) + min;
	}

	function randomFloatSpread(range) {
		const random = randomizer.nextFloat();
		return range * (0.5 - random);
	}

	function randomColor() {
		const random = randomizer.nextFloat();
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(random * 16)];
		}
		return color;
	}

	function randomDirection(vec) {
		const random1 = randomizer.nextFloat();
		const random2 = randomizer.nextFloat();

		const theta = 2 * Math.PI * random1;
		const phi = Math.acos(2 * random2 - 1);

		if (!isNull(vec.x)) vec.x = Math.sin(phi) * Math.cos(theta);
		if (!isNull(vec.y)) vec.y = Math.sin(phi) * Math.sin(theta);
		if (!isNull(vec.z)) vec.z = Math.cos(phi);

		return vec;
	}

	function fract(x) {
		return x - Math.floor(x);
	}

	function dot(x1, y1, x2, y2) {
		return x1 * y2 - x2 * y1;
	}

	function hash2d(x, y) {
		return fract(Math.sin(dot(x, y, 12.9898, 78.233)) * 43758.5453);
	}

	function hash2dInt(x, y, min, max) {
		return Math.floor(hash2d(x, y) * (max - min + 1)) + min;
	}
}

const singleton = prng(Date.now());
singleton.create = prng;

export { singleton as prng };
