import { bezier, easings } from '@lm/utils/anim';
import { clamp, mod, prng } from '@lm/utils/maths';
import ShuffleTextComponent from './TextShuffle.vue';
import { inject } from 'vue';

const outQuart = bezier(easings.outQuart);
const inOutQuad = bezier(easings.inOutQuad);

const directions = {
	RIGHT: 0,
	LEFT: 1,
	RANDOM: 2,
};

const animations = {
	SHOW: 0,
	HIDE: 1,
	STAY: 2,
};

const NOOP = () => {};

let instance = null;

export function textShufflePlugin() {
	const api = instance = {
		animations,
		directions,
		shuffle,
		shuffleScroll,
	};

	/**
	 * Starts a text shuffle animation in two tiers.
	 * First shuffling through random characters and then resolving into the target text.
	 *
	 * text 							- target text string
	 * duration 					- duration of shuffle/resolve animation in seconds
	 * delay 							- delay to start shuffling
	 * delayResolve 			- delay to start resolving
	 * fps 								- framerate
	 * glyphs 						- glyphs to use in the shuffle animation
	 * animation 					- possible values: `show`, `hide`, `stay`
	 * direction 					- possible values: `left`, `right`, `random`
	 * onUpdate 					- callback function, returns the output string
	 * onComplete					- callback function, returns the output string
	 */
	function shuffle({
		text 					= '',
		duration 			= 1000,
		delay 				= 0,
		delayResolve 	= 0.2,
		fps 					= 60,
		glyphs 				= ' !#$&%()*+0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuüvwxyz{|}~',
		animation 		= animations.SHOW,
		direction 		= directions.RIGHT,
		onUpdate 		= NOOP,
		onComplete 		= NOOP,
	} = {}) {
		const _glyphs = glyphs.split('');
		const _text 	= text.split('');
		const _delta = 1000 / fps;

		let _now 			= performance.now();
		let _start 		= performance.now();

		// text indices
		let _tindices = _text.map((t, i) => i);

		// flip direction when hiding
		if (animation == animations.HIDE) {
			if (direction == directions.LEFT) direction = directions.RIGHT;
			else if (direction == directions.RIGHT) direction = directions.LEFT;
		}

		// reverse text indices
		if (direction == directions.LEFT) _tindices.reverse();
		// randomise text indices
		if (direction == directions.RANDOM) _tindices = prng.shuffle(_tindices);

		let uLen, vLen;
		let glyph, output, complete;
		let tidx;
		let t, u, v;

		const _onUpdate = () => {
			if (performance.now() - _now < _delta) {
				requestAnimationFrame(_onUpdate);
				return;
			}

			_now = performance.now();
			output = '';

			// t = linear time
			t = (_now - _start) / duration;
			if (animation == animations.HIDE) t = 1000 - t;

			// u = shuffle curve
			// u starts at delay
			u = clamp(t - delay);
			u = outQuart(u);

			// v = resolve curve
			// v starts at u + it's own delay
			v = clamp(t - delay - delayResolve);
			// v duration is deducted from it's delay (increase speed)
			v = v * (1 / (1 - delayResolve));
			v = inOutQuad(v);

			uLen = Math.round(u * text.length);
			vLen = Math.round(v * text.length);

			for (let i = 0; i < text.length; i++) {
				tidx = _tindices[ i ];
				glyph = _text[ i ];

				if (tidx >= uLen && animation != animations.STAY) glyph = ' ';
				if (glyph != ' ' && tidx >= vLen) glyph = prng.pick(_glyphs);

				output = `${ output }${ glyph }`;
			}

			// loop until u reaches 0
			if (animation == animations.HIDE) complete = u <= 0;
			// loop until u reaches 1
			else complete = u >= 1;

			if (!complete) requestAnimationFrame(_onUpdate);
			else output = animation == animations.HIDE ? '' : text;

			// console.log(output);
			// // debugger if output includes 'undefined'
			// if (output.includes('undefined')) debugger;


			onUpdate(output);
			if (complete) onComplete(output);
		};

		_onUpdate();
	}

	/**
	 * Starts a text shuffle animation inspired by https://lcd.ertdfgcvb.xyz/
	 * It goes through every character in `glyphs` until it finds a match in the target text.
	 *
	 * text 							- target text string
	 * delay 							- delay to start shuffling
	 * fps 								- framerate
	 * glyphs 						- glyphs to use in the shuffle animation
	 * animation 					- possible values: `show`, `hide`, `stay`
	 * stayFrames 				- max number of frames in the `stay` animation
	 * onUpdate 					- callback function, returns the output string
	 * onComplete					- callback function, returns the output string
	 */

	function shuffleScroll({
		text 					= '',
		delay 				= 0,
		fps 					= 60,
		glyphs 				= ' \'"“”‘’¹²³!#$&%()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuüvwxyz{|}~½¼¡«»×░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌',
		animation 		= animations.SHOW,
		stayFrames 		= 25,
		onUpdate 		= NOOP,
		onComplete 		= NOOP,
	} = {}) {
		const _glyphs = glyphs.split('');
		const _text 	= text.split('');
		const _delta = 1000 / fps;

		// shuffle indices
		let _sindices = _text.map(t => 0);
		// resolve indices (glyph index for each char in text)
		let _rindices = _text.map(t => _glyphs.findIndex(g => g == t));

		// when hiding, start shuffling from resolve indices
		if (animation == animations.HIDE)
			_sindices = _rindices.concat();
		// on stay, increase shuffle indices by a random value
		if (animation == animations.STAY)
			_sindices = _rindices.map(r => mod(r - prng.randomInt(5, stayFrames), _glyphs.length));

		let _now 			= performance.now();
		let _start 		= performance.now();
		let _frame 		= 0;

		let glyph, output, complete, resolved;
		let sidx, ridx;

		const _onUpdate = () => {
			if (performance.now() - _now < _delta) {
				requestAnimationFrame(_onUpdate);
				return;
			}

			_now = performance.now();
			if (_now - _start > delay * 1000) _frame++;

			output = '';
			resolved = 0;

			for (let i = 0; i < text.length; i++) {
				sidx = _sindices[ i ];
				ridx = _rindices[ i ];

				// increase shuffle index left to right
				if (animation == animations.SHOW) {
					if (sidx != ridx) {
						if (i < _frame) sidx++;
					} else resolved++;
				}
				// decrease shuffle index left to right
				if (animation == animations.HIDE) {
					if (sidx > 0) {
						if (i < _frame) sidx--;
					} else resolved++;
				}
				// increase all shuffle indices
				if (animation == animations.STAY) {
					if (sidx != ridx) sidx++;
					else resolved++;
				}

				// get corresponding glyph
				glyph = _glyphs[ sidx % _glyphs.length ];
				// update shuffle indices array
				_sindices[ i ] = sidx % _glyphs.length;

				output = `${ output }${ glyph }`;
			}

			// keep looping until all glyphs are resolved
			complete = resolved >= text.length;

			if (!complete) requestAnimationFrame(_onUpdate);
			else output = animation == animations.HIDE ? '' : text;

			onUpdate(output);
			if (complete) onComplete(output);
		};

		_onUpdate();
	}


	return function install(app) {
		app.component('TextShuffle', ShuffleTextComponent);
		app.provide('textShuffle', api);

		const plugins = app.config.globalProperties;
		plugins.$textShuffle = api;
	};
}

export function useTextShuffle() {
	return instance ?? inject('textShuffle');
}
