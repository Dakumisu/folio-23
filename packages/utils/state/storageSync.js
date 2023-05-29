export default function storageSync(signal, key, opts = {}) {
	if (!signal._isStoreSignal || !key) return;

	const storage = opts.session ? sessionStorage : localStorage;
	const type = opts.type;
	const sigtype = typeof signal.value;
	const isBoolean = opts.boolean || type === Boolean || sigtype === 'boolean';
	const isNumber = opts.number || type === Number || sigtype === 'number';
	const isObject = !isBoolean && !isNumber && sigtype === 'object';

	let data = storage.getItem(key);
	if (data == null) data = signal.value;
	else if (isBoolean) data = !!+data;
	else if (isNumber) data = isNaN(+data) ? 0 : +data;
	else if (isObject) {
		try {
			data = JSON.parse(data);
		} catch (err) {
			data = signal.value;
		}
	}

	signal.value = data;
	signal.watch((v) => {
		let data = v;
		if (isBoolean) data = data ? 1 : 0;
		else if (isNumber) data = isNaN(+data) ? 0 : +data;
		else if (isObject) {
			try {
				data = JSON.stringify(data);
			} catch (err) {
				return;
			}
		}
		storage.setItem(key, data);
	});

	return signal;
}
