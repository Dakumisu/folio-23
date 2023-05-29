import { signal, unwatch } from './signal';
import readable from './readable';
import writable from './writable';
import computed from './computed';
import freezer from './freezer';
import storageSync from './storageSync';

const holdEmits = freezer.holdEmits;
const releaseEmits = freezer.releaseEmits;
const batchUpdates = freezer.batchUpdates;

export {
	unwatch,
	readable as r,
	writable as w,
	computed as c,
	signal as s,
	readable,
	writable,
	computed,
	signal,
	holdEmits,
	releaseEmits,
	batchUpdates,
	storageSync,
};
