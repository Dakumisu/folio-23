<template>
	<main class="ui">
		<!-- <div class="center container"> -->
		<!-- <TextShuffle
				tag="h1"
				text="Portfolio 23'"
				direction="random"
			/> -->
		<!-- <TextShuffle
				tag="p"
				text="Work in progress... (too lazy to finish it)"
				direction="random"
			/> -->
		<!-- </div> -->
		<div class="side infos">
			<span>Dakumisu</span>
			<span>Web Developer & Photographer</span>
			<span>Available for <span v-html="randomEmoji"></span> freelance <span v-html="randomEmoji"></span></span>
			<span>/</span>
			<span>Former Student @
				<TextShuffle
					tag="a"
					href="https://www.gobelins.fr/"
					target="_blank"
					text="Gobelins"
				/></span>
			<span>Former Developer @
				<TextShuffle
					tag="a"
					href="https://www.merci-michel.com/"
					target="_blank"
					text="Merci-Michel"
				/></span>
		</div>
		<div class="side socials">
			<TextShuffle
				tag="a"
				href="mailto:dakumisu.psd@gmail.com"
				text="Mail......../"
			/>
			<TextShuffle
				tag="a"
				href="https://github.com/Dakumisu"
				target="_blank"
				text="Github....../"
			/>
			<TextShuffle
				tag="a"
				href="https://twitter.com/dakumisu_"
				target="_blank"
				text="Twitter...../"
			/>
			<TextShuffle
				tag="a"
				href="https://www.instagram.com/dakumisu.cool/"
				target="_blank"
				text="Instagram.../"
			/>
			<span>/</span>
			<TextShuffle
				tag="a"
				href="https://photo.dakumisu.fr/"
				target="_blank"
				text="Gallery...../"
			/>
		</div>
	</main>

	<WebGL />
</template>

<script setup>
	import { prng } from '@lm/utils/maths';
	import { onMounted, shallowRef } from 'vue';

	const EMOJIS = [ '✨', '💸', '🫶', '😎', '🤓', '✌️', '🌻' ];
	const randomEmoji = shallowRef('');

	onMounted(() => {
		randomEmoji.value = prng.pick(EMOJIS);
	});
</script>

<style lang="scss">
.ui {
	position: relative;
	z-index: 1;
	overflow: hidden;
	min-height: 100vh;
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.page {
	position: relative;
	z-index: 1;
	overflow-y: auto;
	height: 100%;
	width: 100%;
}

.center {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;

	:deep(p) {
		padding: 10px;
		color: #000;
		margin: 5px 0;
	}

	:deep(h1) {
		padding: 20px;
		color: #000;
		margin: 5px 0;
	}
}

.side {
	position: fixed;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;

	&.infos {
		top: 25px;
		left: 25px;
	}

	&.socials {
		bottom: 25px;
		right: 25px;
		align-items: flex-end;
	}

	* {
		letter-spacing: -.05rem;
		font-size: .8rem;
		position: relative;
	}
}

a {
	text-decoration: none;
}

h1, p, a {
	background-color: #fff;
	color: #000;
	margin: 5px 0;
}

h1 {
	padding: 20px;
}

p {
	padding: 10px;
}

nav {
	position: absolute;
	top: 5%;
	right: 5%;
	z-index: 2;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
