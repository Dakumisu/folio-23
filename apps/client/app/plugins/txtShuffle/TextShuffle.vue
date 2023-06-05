<template>
	<component
		:is="props.tag"
		class="txt-shuffle"
		@mouseenter="txtShuffle"
		@touchstart="txtShuffle"
	>
		{{ props.text }}
	</component>
</template>

<script setup>
	import { inject } from 'vue';
	const textShuffle = inject('textShuffle', null);
	const { shuffle, directions: shuffleDirs } = textShuffle;

	const props = defineProps({
		tag: {
			type: String,
			default: 'span'
		},
		text: {
			type: String,
			default: ''
		},

		direction: {
			type: String,
			default: 'right'
		},
		duration: {
			type: Number,
			default: 1000
		},

		waitUntilComplete: {
			type: Boolean,
			default: false
		}
	});

	const directions = {
		'right': shuffleDirs.RIGHT,
		'left': shuffleDirs.LEFT,
		'random': shuffleDirs.RANDOM,
	};

	let canShuffle = true;
	const dir = directions[ props.direction ];

	function txtShuffle({ target }) {
		if (props.waitUntilComplete && !canShuffle) return;
		canShuffle = false;
		shuffle({
			duration: props.duration,
			direction: dir,
			text: props.text,
			onUpdate: (text) => target.innerText = text,
			onComplete: () => canShuffle = true
		});
	}
</script>

<style lang='scss' scoped>

</style>
