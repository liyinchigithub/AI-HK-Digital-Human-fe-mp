<template>
	<view>
		
		<view class="tabBar" :style="ios?'padding-bottom: 40rpx':''">
			<view class="gird-tab" v-for="(item,index) in tabData" :key="index"
			:class="pageIndex==index?'tabOn':''" @click="toTab(item, index)">
				<image class="tabIcon" :src="pageIndex==index?item.icon2:item.icon1" mode="" v-if="item.style==0"></image>
				<view class="tabIcon" v-if="item.style==1">
					<view class="iconBox">
						<image class="tabIcon" :src="pageIndex==index?item.icon2:item.icon1" mode=""></image>
					</view>
				</view>
				<view class="tabText" v-if="textType==1">{{item.name}}</view>
				<view class="tabDrop" v-if="textType==2" :class="pageIndex==index?'dropOn':''"></view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		props: {
			pageIndex: {
				type: Number,
				default: 0
			},
			textType: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				ios: false,
				tabData: [{
					pageUrl: '/pages/index/index',
					name: '首页',
					icon1: '../../static/nabar1.png',   //默认图标
					icon2: '../../static/nabar1-a.png',   //选中图标
					style: 0
				},{
					pageUrl: '/pages/index/index',
					name: '扫一扫',
					icon1: '../../static/sao.png',   //默认图标
					icon2: '../../static/sao.png',   //选中图标
					style: 1
				},{
					pageUrl: '/pages/user/user',
					name: '我的',
					icon1: '../../static/nabar2.png',   //默认图标
					icon2: '../../static/nabar2-a.png',   //选中图标
					style: 0
				}]
			}
		},
		created() {
			const self = this;
			uni.getSystemInfo({
				success: function (res) {
					if(res.osName=='ios'){
						self.ios = true;
					}
				}
			});
		},
		methods: {
			
			toTab(item, index){
				if(this.pageIndex!=index){
					this.$emit('toTab', item);
				}
			}
			
		}
	}
</script>

<style lang="scss">
.tabBar{
	width: 100%;
	display: flex;
	position: fixed;
	padding: 20rpx 0;
	bottom: 0;
	box-shadow: 0rpx 0rpx 20rpx #e2e2e2;
	
	.gird-tab{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		
		.tabText{
			font-size: 24rpx;
			padding-top: 10rpx;
		}
		
		.tabIcon{
			width: 50rpx;
			height: 50rpx;
			position: relative;
		}
		
		.tabDrop{
			width: 8rpx;
			height: 8rpx;
			background-color: #dddddd;
			border-radius: 50%;
			margin-top: 10rpx;
		}
		
		.dropOn{
			background-color: #DE1F27;
		}
		
		.iconBox{
			width: 100rpx;
			height: 100rpx;
			background-color: #DE1F27;
			position: absolute;
			bottom: 0;
			left: 50%;
			margin-left: -50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			border: 10rpx solid #fff;
			box-shadow: 0rpx -10rpx 20rpx #e2e2e2;
		}
	}
	
	.tabBadge{
		position: absolute;
		left: 55%;
		top: -20rpx;
	}
}

.tabOn .tabText{
	color: #DE1F27;
}
</style>
