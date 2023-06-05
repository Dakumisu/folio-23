<template>
	<main class="ui">
		<div class="center container">
			<TextShuffle
				tag="h1"
				text="Portfolio 23'"
				direction="random"
			/>
			<TextShuffle
				tag="p"
				text="Work in progres..."
				direction="random"
			/>
			<!-- <h1>
				Portfolio 23'
			</h1>
			<p>
				Work in progres...
			</p> -->
		</div>
		<div class="side infos">
			<span>Alex - Dakumisu</span>
			<span>Web Developper</span>
			<span>Student @ <a
				href="https://www.gobelins.fr/"
				target="_blank"
			>Gobelins</a></span>
			<span>Developper @ <a
				href="https://www.merci-michel.com/"
				target="_blank"
			>Merci-Michel</a></span>
		</div>
		<div class="side socials">
			<a href="mailto:dakumisu.psd@gmail.com">Mail</a>
			<a
				href="https://github.com/Dakumisu"
				target="_blank"
			>
				Github
			</a>
			<a
				href="https://twitter.com/Dakumisu_psd"
				target="_blank"
			>
				Twitter
			</a>
		</div>
	</main>

	<WebGL />
</template>

<script setup>

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
