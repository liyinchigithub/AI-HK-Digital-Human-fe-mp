<template>
	<movable-area class="buyo">
		<movable-view class="btn" :style="{visibility: visible ? 'visible' : 'hidden'}" :x="x" :y="y" :animation="animation"
			direction="all" @change="onChange" @click="onClick" @touchend="onTouchEnd">
			<slot></slot>
		</movable-view>
	</movable-area>
</template>

<script>
	export default {
		props: {
			adsorb: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				x: 0,
				y: 0,
				old: {
					x: 0,
					y: 0
				},
				visible: false,
				animation: false,
				width: 0
			}
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			query.select(".btn")
				.boundingClientRect((data) => {
					const screen = uni.getSystemInfoSync();
					this.width = data.width;
					this.x = screen.screenWidth - data.width;
					this.y = screen.screenHeight / 2;
					this.visible = true;
				})
				.exec();
		},
		methods: {
			// 滚动事件
			onChange(e) {
				this.old.x = e.detail.x;
				this.old.y = e.detail.y;
			},
			// 点击事件
			onClick() {
				this.$emit('click')
			},
			onTouchEnd() {
				if (!this.adsorb) return;
				const {
					x,
					y
				} = this.old;
				const screen = uni.getSystemInfoSync();
				let start;
				this.animation = true;
				if (x <= ((screen.screenWidth - this.width) / 2)) {
					start = 0;
				} else {
					start = screen.screenWidth - this.width;
				}
				this.$nextTick(() => {
					this.x = start;
					this.y = y;
				})
			}
		}
	}
</script>

<style lang="scss">
	.buyo {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;

		.btn {
			pointer-events: auto;
			width: auto;
			height: auto;
			visibility: visible;
		}
	}
</style>