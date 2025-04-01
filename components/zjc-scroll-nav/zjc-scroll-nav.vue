<template>
	<view class="card_swiper_out">
		<scroll-view @scroll="changeScroll" :show-scrollbar="true" :enable-flex="true" :scroll-x="true"
			class="card_swiper">
			<block v-if="platformList.length < 10">
				<view class="item" v-for="(item,index) in platformList" :key="index"
					@click.stop="goClassiFication(item.url,index,platformList.length)">
					<img class="item_img" :src="item.image" />
					<view style="margin-left:35upx;font-size: 30rpx;text-align: center;">{{item.title}}</view>
				</view>
			</block>
			<block v-else>
				<view class="u-margin-bottom-26">
					<view class="item" v-for="(item,index) in platformList.slice(1,11)" :key="index"
						@click.stop="goClassiFication(item,index,platformList.length)">
						<img class="item_img" :src="item.image" />
						<view style="margin-left:35upx;font-size: 30rpx;text-align: center;">{{item.title}}</view>
					</view>
				</view>
				<view class="u-padding-bottom-26">
					<view class="item" v-for="(item,index) in platformList.slice(10)" :key="index"
						@click.stop="goClassiFication(item,index,platformList.length)">
						<img class="item_img" :src="item.image" />
						<view style="margin-left:35upx;font-size: 30rpx;text-align: center;">{{item.title}}</view>
					</view>
				</view>
			</block>
		</scroll-view>
		<view v-if="platformList.length > 10" class="scroll_bar" :style="{width:scrollwidth}">
			<view class="left_line" :style="{left:scrollLeft}"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				firstColumn: [],
				towColumn: [],
				scrollwidth: 0,
				scrollLeft: 0
			}
		},
		props: {
			platformList: {
				type: Array,
				default: [],
				required: true
			}
		},
		watch: {
			platformList(arr) {
				this.firstColumn = this.getFirstColumn(arr)
				this.scrollwidth = this.getScrollwidth(arr)
				this.towColumn = this.getTowColumn(arr)
			}
		},
		methods: {
			// 页面跳转
			goClassiFication(page,index,platformListLength){
				//  判断是否最后一个（最后一个跳转分类/全部服务）
				if (index==(platformListLength-1)) {
					uni.switchTab({
						url:"/pages/classification/classification"
					})
				} else{
					uni.navigateTo({
						url:page
					})
				}
				
			},
			getFirstColumn(arr) {
				return arr.slice(0, Math.ceil(arr.length / 2))
			},
			// 计算滚动条的长度
			getScrollwidth(arr) {
				let height = (arr.length - 10) / 2
				let one = 10 * height + 24
				return one + 'rpx'
			},
			getTowColumn(arr) {
				let list = arr.slice(Math.ceil(arr.length / 2), arr.length)
				if (list.length) {
					// let obj = {
					// 	gt_id: 0,
					// 	gt_name: "全部分类",
					// 	icon_url: "",
					// }
					// list.splice(4, 0, obj)
					return list
				}
			},
			
			changeScroll(e) {
				console.log(e)
				let columnLength = this.firstColumn.length
				this.scrollLeft = e.detail.scrollLeft / columnLength + 'rpx'
				console.log(this.scrollLeft)
			},
		}
	}
</script>

<style scoped lang="scss">
	// 菜单
	.scroll_box {
		width: calc(100% - 48upx);
		height: 376upx;
		background: #ffffff;
		border-radius: 24upx;
		padding: 24upx;
	}
	.scroll_item {
		text-align: center;
		width: 96upx;
		color:#666666;
	}
	.item_img {
		width: 100upx;
		height: 100upx;
		background: #EFEFEF;
		border-radius: 50%; // 方形10%
		margin-left:40upx;
		margin-bottom: 10upx;
		font-size: 40upx;
		display: block;
	}
	
	.card_swiper_out {
		height: 240rpx;
		position: relative;
		padding:  90upx 20upx 25upx 20upx; // 上右下左
		background: #FFFFFF;
		border-radius: 20upx;
		// width: 100%;
		overflow-y: auto;
		color: #666666;
	}

	.card_swiper {
		white-space: nowrap;
		width: 100%;
	}

	.item {
		width: 96upx;
		display: inline-block;
		text-align: center;
		color: #767780;
		font-size: 24upx;
		margin-right: 80upx;
	}

	.item:nth-last-child(1) {
		margin-right: 0;
	}

	.scroll_bar {
		background: rgba(242, 169, 64, 0.2);
		height: 8upx;
		border-radius: 5upx;
		position: relative;
		left: 50%;
		transform: translate(-50%, 0);
		z-index: 9;
		bottom: 0;
		transition: all 0.5s ease-in;
	}

	.left_line {
		content: ' ';
		width: 24upx;
		height: 8upx;
		background: red;
		border-radius: 5upx;
		position: absolute;
		top: 0;
	}
</style>
