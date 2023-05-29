<template>
	<div
		ref="home"
		class="page page-home"
		data-v-observer="home"
	>
		<h1>Home</h1>
		<p
			v-for="i in 2"
			:id="'a' + i"
			:key="'a' + i"
			class="leave paragraphs"
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi ipsa
			ducimus sapiente officiis vitae quis aspernatur veniam voluptatibus
			tenetur illum earum veritatis repudiandae, dolore deleniti culpa
			quasi quaerat optio temporibus?
		</p>

		<div
			class="child"
			data-v-observer="child"
		>
			<p
				v-for="i in 6"
				:id="'b' + i"
				:key="'b' + i"
				class="leave paragraphs"
			>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
				ipsa ducimus sapiente officiis vitae quis aspernatur veniam
				voluptatibus tenetur illum earum veritatis repudiandae, dolore
				deleniti culpa quasi quaerat optio temporibus?
			</p>
		</div>

		<p
			v-for="i in 2"
			:id="i"
			:key="i"
			class="leave paragraphs"
		>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi ipsa
			ducimus sapiente officiis vitae quis aspernatur veniam voluptatibus
			tenetur illum earum veritatis repudiandae, dolore deleniti culpa
			quasi quaerat optio temporibus?
		</p>

		<span
			ref="span"
			class="span"
		>
			SALUT C'EST MOI LE SPAN
		</span>
	</div>
</template>

<script setup>
	import { ref } from 'vue';
	import { useIntersectionObserver } from '~app/composables/useIntersectionObserver';

	const home = ref();
	const { observe: vHomeObserve, observeAll: vHomeObserveAll } =
		useIntersectionObserver({ triggerLeaveOnDestroy: true, root: home });

	vHomeObserveAll('.paragraphs', {
		onEnter: (node, item) => {
			console.log(node.id, item, 'enter');
			node.classList.add('enter');
			node.classList.remove('leave');
		},
		onLeave: (node, item) => {
			console.log(node.id, item, 'leave');
			node.classList.remove('enter');
			node.classList.add('leave');
		},
	});

	const span = ref();
	vHomeObserve(span, {
		onEnter: (node, e) => console.log('span enter', node, e),
		onLeave: (node, e) => console.log('span leave', node, e),
	});

	const { observeAll: vChildObserveAll } =
		useIntersectionObserver({ root: 'child' });

	vChildObserveAll('.paragraphs', {
		onEnter: (node) => {
			console.log(node.id, 'enter');
			node.classList.add('enter');
			node.classList.remove('leave');
		},
		onLeave: (node) => {
			console.log(node.id, 'leave');
			node.classList.remove('enter');
			node.classList.add('leave');
		},
	});
</script>

<style lang="scss" scoped>
	.child {
		height: 50vh;
		margin-top: 15rem;
		overflow: scroll;
		overflow-x: hidden;
		border: 1px solid red;
	}

	p {
		font-size: 4rem;
		line-height: 5rem;
		transition: color 0.25s linear;

		&.enter {
			color: green;
		}

		&.leave {
			color: red;
		}
	}
</style>
