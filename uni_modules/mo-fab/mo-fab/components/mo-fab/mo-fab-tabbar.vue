<template>
	<!-- 悬浮导航示例 -->
	<moFab 
	defaultPost="right"
	@dragInit="drag_init"
	@dragmove="drag_init"
	@dragend="drag_init">
		<view class="dropbox" :class="[clsRight&&'right']">
			<view class="dropbtn" 
			@click.stop="change">
				<div v-if="!clsRight" :class="['close-icon mr5',open&&'active']">
					<span></span>
					<span></span>
					<span></span>
				</div>
				<text>菜单</text>
				<div v-if="clsRight" :class="['close-icon ml5',open&&'active']">
					<span></span>
					<span></span>
					<span></span>
				</div>
			</view>

			<view class="dropup" :style="{width:dropWhidth}">
				<view  
					v-for="tab in tabBarList" 
					:key="tab.pagePath" 
					class="drop-item"
					@click="tabRouter(tab)"
					:url="tab.pagePath"
				>
					<image :src="`${tab.iconPath}`" class="iconimg">
					<text>{{tab.text}}</text>
				</view >
				
			</view>
		</view>
	</moFab>
</template>

<script>
	import moFab from './mo-fab.vue'
	export default {
		name: 'moFabBar',
		components: { moFab },
		props: {
			tabBarList: { // tabbar列表
				type: Array,
				default: () => []
			},
		},
		data() {
			return {
				open: false,
				dropWhidth: 0,
				dir: 1
			}
		},
		computed:{
			clsRight(){
				return this.dir == 1 
			}
		},
		methods: {
			drag_init(e){
				this.dir = e.dir
			},
			change(){
				this.open = !this.open
				this.dropWhidth = this.open&&this.tabBarList.length ? (this.tabBarList.length + 0.4) * 55 + 'px' : 0
			},
			tabRouter(tab){
				uni.switchTab({
					url: '/' + tab.pagePath
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	$theme-color: rgb(144, 88, 235);
	$shadow: 0 0 5px 2px rgba(0,0,0,.2);
	.dropbox{
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		box-shadow: $shadow;
		&.right{
			.dropup{
				right: inherit;
				margin-left: 80%;
				margin-right: 0;
				left: 0;
				border-radius: 0 50rpx 50rpx 0;
			}
		}
	}
	.dropbtn{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		position: relative;
		border-radius: 50%;
		z-index: 2;
		font-size: 24rpx;
		background: $theme-color;
	}
	.dropup{
		position: absolute;
		top: 50%;
		right: 0;
		height: 70%;
		margin-right: 80%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		background: $theme-color;
		border-radius: 50rpx 0 0 50rpx;
		font-size: 24rpx;
		overflow: hidden;
		z-index: 1;
		transition: transform 0.2s, margin 0.2s, width 0.2s;
		box-shadow: $shadow;
		.drop-item{
			white-space: nowrap;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 10rpx;
			height: 100%;
		}
	}
	.iconimg{
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}


	.close-icon{
		display: block;
		position: relative;
		width: 10px;
		span{
			display: block;
			width: 100%;
			height: 3rpx;
			background-color: #fff;
			border-radius: 4rpx 4rpx;
			transition: transform .2s, opacity .2s, height .2s;
			opacity: 1;
			&:nth-of-type(2){
				margin: 6rpx 0;
				width: 8px;
			}
		}
		&.active{
			span{
				height: 2rpx;
				&:nth-of-type(1){
					transform: rotate(45deg) translateY(50%);
				}
				&:nth-of-type(3){
					transform: rotate(-45deg) translateY(-50%);
				}
				&:nth-of-type(2){
					opacity: 0;
					height: 0rpx;
					position: absolute;
				}
			}
		}
	}
</style>
