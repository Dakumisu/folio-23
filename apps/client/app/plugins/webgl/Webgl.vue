<template>
	<aside
		v-once
		ref="wrapper"
		class="webgl-wrapper"
	></aside>
</template>

<script setup>
	import { inject, onMounted, onUnmounted, ref } from 'vue';

	const wrapper = ref();
	const canvas = ref();
	const webgl = inject('webgl', null);

	onMounted(() => {
		if (!webgl || !webgl.canvas) return;

		canvas.value = webgl.canvas;
		canvas.value.classList.add('webgl-canvas');
		wrapper.value.appendChild(canvas.value);
	});

	onUnmounted(() => {
		if (canvas.value && canvas.value.parentNode === wrapper.value)
			wrapper.value.removeChild(canvas.value);
		canvas.value = null;
	});

	defineExpose({ wrapper, canvas });
</script>

<style lang="scss" scoped>
	aside.webgl-wrapper {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: hidden;
		overflow: clip;
		user-select: none;
		contain: strict;
	}

	canvas.webgl-canvas {
		outline: none;
	}
</style>
