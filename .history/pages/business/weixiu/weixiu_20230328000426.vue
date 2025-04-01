<template>
	<view>
		<!-- 列表内容 -->
		<view class="" v-for="(item,index) in listData" :key="index">
			<uni-card :title="item.title"
				@click="goto(`/pages/homeCardDetail/homeCardDetail?id=${item._id}`)">
				<u-row justify="space-between" gutter="13">
					<u-col span="3">
						<view style="margin-left: 5rpx;margin-right: 3rpx;margin-top: 30rpx;margin-bottom: 50rpx">
							<u--image src="https://cdn.uviewui.com/uview/album/1.jpg" shape="circle" width="110"
								height="110"></u--image>
						</view>
					</u-col>
					<u-col span="8">
						{{item.content}}
					</u-col>
					<u-col span="5">
						<!-- 空 -->
					</u-col>
				</u-row>
				<u-row justify="space-between" gutter="13">
					<u-col span="13">
						<view style="margin-left: 20rpx;margin-right: 20rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
							<!-- 	<u-read-more>
								<rich-text :nodes="item.content" showHeight="100" :toggle="true" @load="load"></rich-text>
							</u-read-more> -->
							<!-- <u-read-more ref="uReadMore" :toggle="true" :showHeight="100" :fontSize="30">
								<u-parse :content="item.content" @load="load"></u-parse>
							</u-read-more> -->
						</view>
					</u-col>
				</u-row>
				<u-row justify="space-between" gutter="13">
					<u-col span="3">
					</u-col>
					<u-col span="3">
					</u-col>
					<u-col span="4">
					</u-col>
				</u-row>
				<u-row justify="space-between" gutter="15">
					<u-col span="3">
					</u-col>
					<u-col span="5">
					</u-col>
					<u-col span="3">
						<view>
							<u-button style="" :plain="true" shape="circle" type="primary" text="立即抢单">
							</u-button>
						</view>
					</u-col>
					<u-col span="3">
		
					</u-col>
				</u-row>
			</uni-card>
		
		</view>
		<!-- 上拉加载更多 -->
		<view class="loading">{{loadingText}}</view>
		<!-- 返回顶部 -->
		<view class="wrap">
			<u-back-top :scroll-top="scrollTop" :mode="mode" :icon-style="iconStyle"></u-back-top>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 分类-维修默认取第一个
				classType:"",
				//
				listData:[],
				// 返回顶部
				scrollTop: 0,
				mode: 'square',
				iconStyle: {
					fontSize: '32rpx',
					color: '#409EFF',
				},
				// tab列表分页 
				pageNum: 1,
				pageSize: 4,
				total: 0,
				loadingText: '加载中...', // 当前状态
				index: "",
			}
		},
		methods: {
			// 页面跳转
			goto(url) {
				uni.navigateTo({
					url: url
				})
			},
			//
			load() {
				this.$refs.uReadMore.init();
			},
			getReleaseInfoData(index) {
				this.pageNum = 1;
				// 显示loading
				uni.showNavigationBarLoading();
				// 重写this为that
				var that = this;
				// 请求云函数-获取分类第一个数据，即约定第一个分类是维修
				uniCloud.callFunction({
					name:"getClassType",
					data:{
						"isEnable":true
					},
					success: (res) => {
						that.classType=res.result.data[0].id
						console.log("that.classType:",that.classType)
						// 请求云函数-获取”维修“类型的数据
						uniCloud.callFunction({
							name: "getReleaseInfo",
							data: {
								"classType": that.classType,
								"pageNum": that.pageNum,
								"pageSize": that.pageSize,
								// "adCode": "10000",
								"isEnable": true
							},
							success: (res) => {
								console.log("getReleaseInfo res.result.data:", res.result.data)
								that.listData = res.result.data
								// 隐藏顶栏加载logding
								uni.hideNavigationBarLoading();
								// 关键，决定是否进行加载数据
								that.loadingText = '加载更多';
							}
						})
					}
				})
				
			},
			// 加载更多
			getMoreNews() {
				var that = this;
				// 判断当前是否数据可加载TODO
				if (this.loadingText != '' && this.loadingText != '加载更多') {
					this.loadingText = "到底啦~"
					return false;
				}
				this.loadingText = '加载中...';
				// 页面加载
				this.pageNum++;
				// 调用云函数，获取列表
				uniCloud.callFunction({
						name: "getReleaseInfo",
						data: {
							"classType": that.classType,
							"pageNum": that.pageNum,
							"pageSize": that.pageSize,
							// "adCode": "10000",
							"isEnable": true
						}
					})
					.then(res => {
						this.loadingText = '';
						console.log(res);
						// 新旧数据拼接
						this.listData = this.listData.concat(res.result.data);
						this.loadingText = '加载更多';
						// 判断是否加载完毕
						if (res.result.data.length == 0) {
							//在当前页面隐藏导航条加载动画。
							uni.hideNavigationBarLoading();
							this.loadingText = '已加载全部';
							return false;
						}
						// 隐藏loading
						uni.hideNavigationBarLoading();
					}) // success
					.catch((err) => {
						console.log(err);
					}) // fail
			},
		},
		//页面滚动到底部的事件
		onReachBottom() {
			this.getMoreNews();
		},
		onLoad() {
			// 请求tab列表数据
			this.getReleaseInfoData(0)
		},
		// 分享微信好友
		onShareAppMessage() {
			return {
				title: '智慧生活',
				path: '/pages/home/home' //分享的页面路径
			}
		},
		// 分享微信朋友圈
		onShareTimeline() {
			return {
				title: '智慧生活',
				// query: 'name=1&age=2',
				imageUrl: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-bbd2c18f-fb4a-4ae6-aa91-e5b8c7674b8e/60b0af83-3a0b-485a-b9f3-a7c48e0f187f.jpeg',
			}
		}
	}
</script>

<style>
.card_title {
		font-size: 30rpx;
	}

	.custom-style {
		color: #606266;
		width: 400rpx;
	}

	.uni-margin-wrap {
		width: 690rpx;
		width: 100%;
		;
	}

	.swiper {
		height: 300rpx;
	}

	.swiper-item {
		display: block;
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
	}

	.swiper-list {
		margin-top: 40rpx;
		margin-bottom: 0;
	}

	.uni-common-mt {
		margin-top: 60rpx;
		position: relative;
	}

	.info {
		position: absolute;
		right: 20rpx;
	}

	.uni-padding-wrap {
		width: 550rpx;
		padding: 0 100rpx;
	}

	.index-top-buttom {
		text-align: center;
		margin-top: 10upx;
		margin-bottom: 10upx;
	}

	.title {
		display: flex;
		flex-direction: column;
		margin-left: 0rpx;
		margin-top: 50rpx;
	}

	.u-content {
		margin-left: 50rpx;
		margin-right: 50rpx;
		margin-top: 10rpx;
		text-align: left;
	}

	.wrap {
		padding: 40rpx;
	}

	page {
		background-color: #f0eefc;
		/* padding-bottom: 30upx; */
	}

	s .card-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		padding-top: 10upx;
		font-size: 26upx;
		color: #7d7d7d;
	}

	/* .content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	} */

	.title {
		display: flex;
		align-items: center;
		height: 90upx;
		font-size: 32upx;
		color: #303133;
	}

	.img-wrapper {
		width: 100%;
		height: 290upx;
		position: relative;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}

	.introduce {
		display: inline-block;
		padding: 16upx 0;
		font-size: 35upx;
		margin: 5% 5% 5% 5%;
		color: black;
		line-height: 38upx;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		font-size: 24upx;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: 32upx;
	}

	.loading {
		text-align: center;
		color: #8F8F94;
	}

	.card {
		height: 30rpx;
		background: #ffffff;
		margin-top: 1%;
		margin-left: 1%;
		margin-right: 1%;
		border-radius: 15rpx;
		position: relative;
	}

	.originalPrice {
		text-decoration: line-through;
		color: #a4a7b0;
		font-size: 40rpx;
		margin-left: 25%;
		margin-right: 2%;

	}

	.presentPrice {
		color: orange;
		font-size: 60rpx;
		margin-left: 1%;
	}
</style>
