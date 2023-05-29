import { deferredPromise } from '@lm/utils/async';
import { getCurrentInstance, isRef, onBeforeUnmount, onMounted, unref } from 'vue';

const NOOP = () => {};
const isArray = (v) => v instanceof Array || v instanceof Set || v instanceof Map;

// Used if document.body is used as root
let singletonObserver = null;

/**
 * Create a new IntersectionObserver instance
 *
 * @param root - The node element that is used as the viewport for checking
 * @param margin - Margin around the root. Can have values similar to the CSS margin property,
 * @param threshold - Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed.
 * @param delay - The minimum interval between notifications from the observer.
 * @param trackVisibility - Sets which visibility checks are performed by the observer.
 * @param onEnter - Callback when the element enters the viewport
 * @param onLeave - Callback when the element leaves the viewport
 * @param onUpdate - Callback when the element is updated
 * @param once - If true, stop observing the element after the first time it enters the viewport
 *
 * @returns {object} Object with the IntersectionObserver methods
 */
export function useIntersectionObserver({
	root = null,
	margin = '0px',
	threshold = [ 0. ],
	delay = 0,
	trackVisibility = false,
	triggerLeaveOnDestroy = false,
} = {}) {
	threshold = isArray(threshold) ? threshold : [ threshold ];

	let _dp = deferredPromise();
	let _update = null;
	let _observer = null;
	let _ready = false;
	let _useDocumentBodyAsRoot = false;
	let _vueComponent = null;
	const _list = new Map();

	onMounted(() => {
		const _currentInstance = getCurrentInstance();
		_vueComponent = _currentInstance.vnode.el || document.body;

		// If there's several data-v-observer, take the one that matches the root
		if (typeof root === 'string') {
			if (root.includes('.')) {
				root = _vueComponent.classList.contains(root.replace('.', ''))
					? _vueComponent
					: _vueComponent.querySelector(root);
			} else if (root.includes('#')) {
				root = _vueComponent.id === root.replace('#', '')
					? _vueComponent
					: _vueComponent.querySelector(root);
			} else {
				root = _vueComponent.dataset.vObserver === root
					? _vueComponent
					: _vueComponent.querySelector(`[data-v-observer="${ root }"]`);
			}
		}

		// If there's only one data-v-observer, take it as default root
		if (!root)
			root = _vueComponent.dataset.vObserver
				? _vueComponent
				: _vueComponent.querySelector('[data-v-observer]');

		// Otherwise take the body as default root
		if (!root) {
			root = document.body;
			_useDocumentBodyAsRoot = true;
		}

		// Unref the root element if it's a ref
		root = unref(root);

		if (_useDocumentBodyAsRoot && singletonObserver) _observer = singletonObserver;

		_observer =
			_observer ?? new IntersectionObserver(handleIntersect, {
				root,
				rootMargin: margin,
				threshold,
				delay,
				trackVisibility
			});

		if (_useDocumentBodyAsRoot && !singletonObserver) singletonObserver = _observer;

		_dp.resolve();
		_ready = true;
		_update = requestAnimationFrame(update);
	});

	onBeforeUnmount(destroy);

	return { observe, observeAll, unObserve, unObserveAll };

	function handleIntersect(entries) {
		entries.forEach((entry) => {
			const el = entry.target;
			const item = _list.get(el);
			if (!item) return;

			const ratio = entry.intersectionRatio;
			const visible = entry.isIntersecting;

			if (item.isVisible != visible && visible) item.onEnter(el, item);
			if (item.isVisible != visible && !visible) item.onLeave(el, item);

			item.isVisible = visible;
			item.ratio = ratio;

			if (item.once && visible) unObserve(item.ref);
		});
	}

	/**
	 * Detect when an element is visible in the viewport
	 *
	 * @param target - The node element to observe (Can be a Vue ref or a string for querySelector or directly the node element)
	 * @param opts.onEnter - Callback when the element enters the viewport
	 * @param opts.onLeave - Callback when the element leaves the viewport
	 * @param opts.onUpdate - Callback when the element is updated
	 * @param opts.once - If true, stop observing the element after the first time it enters the viewport
 	 */
	async function observe(target, opts = {}) {
		if (!_ready) await _dp;
		if (!target) return DEBUG && console.error('Need a target element to observe');

		opts.onEnter = opts.onEnter ?? NOOP;
		opts.onLeave = opts.onLeave ?? NOOP;
		opts.onUpdate = opts.onUpdate ?? NOOP;

		if (typeof target === 'string') target = root.querySelector(target);
		let el = unref(target);
		if (_list.has(el)) return DEBUG && console.error('Already observing this element ', el);

		_list.set(el, {
			...opts,
			ref: isRef(target) ? target : null,
			el,
			isVisible: false,
			ratio: 0,
			once: !!opts.once,
		});

		_observer.observe(el);
	}

	/**
	 * Detect when an element is visible in the viewport
	 *
	 * @param targets - The elements to observe
	 * @param opts.onEnter - Callback for all the elements when they enters the viewport
	 * @param opts.onLeave - Callback for all the elements when they leaves the viewport
	 * @param opts.onUpdate - Callback for all the elements when they're updated
	 * @param opts.once - Stop observing the element after the first time it enters the viewport
 	 */
	async function observeAll(targets, opts = {}) {
		if (!_ready) await _dp;
		if (!targets) return DEBUG && console.error('Need targets element to observe');
		if (typeof targets === 'string') targets = [ ...root.querySelectorAll(targets) ];
		targets = unref(targets);
		if (!isArray(targets)) targets = [ targets ];
		targets.forEach((target) => observe(target, opts));
	}

	/**
	 * Stop observing an element
	 *
	 * @param target - The node element to stop observing
	 */
	async function unObserve(target, opts = {}) {
		if (!target) return DEBUG && console.error('Need a target element to unobserve');
		let el = unref(target);
		if (!!opts.triggerLeaveOnDestroy && _list.has(el)) {
			const item = _list.get(el);
			item.isVisible && item.onLeave(el, item);
		}
		_observer && _observer.unobserve(el);
		_list.delete(el);
	}

	/**
	 * Stop observing an element
	 *
	 * @param targets - Array of refs element to stop observing
	 */
	function unObserveAll(targets, opts = {}) {
		if (!targets) return DEBUG && console.error('Need targets element to unobserve');
		targets = isArray(targets) ? targets : [ targets ];
		targets.forEach((target) => unObserve(target.el ?? target, opts));
	}

	function updateNode(node) {
		if (!node.isVisible) return;
		node.onUpdate(node.el, node);
	}

	function update() {
		_list.forEach(updateNode);
		requestAnimationFrame(update);
	}

	function destroy(hard = false) {
		_update && cancelAnimationFrame(_update);
		_update = null;

		unObserveAll(_list, { triggerLeaveOnDestroy });

		if (!_useDocumentBodyAsRoot) _observer && _observer.disconnect();
		_observer = null;

		if (hard) {
			_observer && _observer.disconnect();
			singletonObserver && singletonObserver.disconnect();
			singletonObserver = null;
		}
	}
}
