import BezierEasing from 'bezier-easing';
import { easings } from './easings.js';

const cache = {};
const linearEase = v => v;
export function bezier(a, b, c, d) {
	if (a == null) a = 'linear';

	if (Array.isArray(a)) {
		if (a.length == 4) {
			const preset = a;
			a = preset[ 0 ];
			b = preset[ 1 ];
			c = preset[ 2 ];
			d = preset[ 3 ];
		} else {
			a = 'linear';
		}
	}

	if (typeof a === 'string') {
		if (a === 'linear') return linearEase;
		const preset = easings[ a ];
		if (!preset) return linearEase;
		a = preset[ 0 ];
		b = preset[ 1 ];
		c = preset[ 2 ];
		d = preset[ 3 ];
	}

	const cacheKey = [ a, b, c, d ].join('_');
	if (cache[ cacheKey ]) return cache[ cacheKey ];

	return cache[ cacheKey ] = new BezierEasing(a, b, c, d);
}
