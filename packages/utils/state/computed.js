import { Writable } from './writable';

function computed(observables, cb) {
	const value = new Writable();

	const setValue = value.set.bind(value);
	delete value.set;

	observables = Array.isArray(observables) ? observables : [observables];
	const values = new Array(observables.length);
	let unwatchs = [];

	for (let i = 0, l = observables.length; i < l; i++) {
		const signal = observables[i];
		const cb = function (v) {
			values[i] = v;
			derive();
		};
		values[i] = signal.value;
		signal.watch(cb);
		unwatchs.push(signal, cb);
	}

	value.destroy = destroy;
	derive();

	function derive() {
		const result = cb.apply(null, values);
		if (result && result.then) result.then(setValue);
		else setValue(result);
	}

	function destroy() {
		for (let i = 0, l = unwatchs.length; i < l; i += 2) unwatchs[i].unwatch(unwatchs[i + 1]);

		unwatchs = null;
		value.unwatchAll();
	}

	return value;
}

export default computed;
