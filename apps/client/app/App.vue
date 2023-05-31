<template>
	<main class="ui">
		<nav>
			<RouterLink to="/">
				Home
			</RouterLink>
			<RouterLink to="/work">
				Work
			</RouterLink>
		</nav>

		<RouterView />
	</main>

	<WebGL />
</template>

<script setup></script>

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
