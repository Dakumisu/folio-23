// import { raf } from '@mm56/utils/raf';
import { onBeforeUnmount, onMounted, shallowRef } from 'vue';
import Lenis from './lenis';

export function useSmoothScroll({
	ref,
	lerp,
	ease,
	duration,
	orientation,
	gestureOrientation,
	smoothWheel,
	smoothTouch,
	wheelMultiplier,
	touchMultiplier,
	normalizeWheel,
	infinite
} = {}) {
	ref = ref ?? shallowRef();
	let lenis;

	let _update = null;
	let _dt = 0;
	let _et = 0;
	let _time = 0;

	onMounted(() => {
		lenis = new Lenis({
			listenerTarget: window,
			wrapper: ref.value.parentNode,
			content: ref.value,
			lerp: lerp,
			easing: ease,
			duration: duration,
			orientation: orientation,
			gestureOrientation: gestureOrientation,
			smoothWheel: smoothWheel,
			smoothTouch: smoothTouch,
			wheelMultiplier: wheelMultiplier,
			touchMultiplier: touchMultiplier,
			normalizeWheel: normalizeWheel,
			infinite: infinite
		});

		lenis.on('scroll', (e) => {
			// app.$store.virtualScrollY = e.animatedScroll;
		});

		// raf.add(updateLenis);
		_update = requestAnimationFrame(update);
	});

	onBeforeUnmount(() => {
		if (!lenis) return;
		// app.$store.virtualScrollY = 0;
		lenis.destroy();
		// raf.remove(updateLenis);
	});

	function update() {
		_time = performance.now();
		_dt = _time - _et;
		_et += _dt;

		// lenis.update(dt);
		lenis.raf(_et);
		_update = requestAnimationFrame(update);
	}

	function onStart() {
		lenis.start();
	}

	function onStop() {
		lenis.stop();
	}

	function scrollTo(value, opts = {}) {
		lenis.scrollTo(value, opts);
	}

	return {
		ref,
		onStart,
		onStop,
		scrollTo
	};
}


