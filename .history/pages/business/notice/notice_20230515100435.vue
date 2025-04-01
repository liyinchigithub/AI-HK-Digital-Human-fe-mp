<template>
	<!-- 通知列表页 -->
	<view>
		<!-- 顶栏 -->
		<u-navbar title="消息" @leftClick="leftClick()" fixed leftText="返回" leftIconSize="25px" :autoBack="true">
		</u-navbar>
		<!-- 空数据 -->
		<view class="">
			<u-empty marginTop="100rpx" :show="isEmpty" mode="message" icon="http://cdn.uviewui.com/uview/empty/message.png" :width="screenWidth"
				:height="screenHeight" textSize="40">
			</u-empty>
		</view>
		<!-- 列表 -->
		<view class="notice-item" v-show="!isEmpty">
			<view class="" v-for="(item, index) in newsList" :key="index"
				@click="goto(`/pages/notice/noticeDetail?_id=${item._id}`)">
				<text class="time">{{getYMDHMS(item.noticeSendTime)}}</text>
				<view class="content">
					<text class="title">{{item.noticeTitle}}</text>
					<view class="img-wrapper">
						<image class="pic" :src="item.noticeImage[0].fileID"></image>
					</view>
					<text class="introduce">
						{{item.noticeContent}}
					</text>
					<view class="bot b-t">
						<text>查看详情</text>
						<text class="more-icon yticon icon-you"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="loading" v-show="!isEmpty">{{loadingText}}</view>
	</view>
</template>
var _self, page = 1, timer = null;
<script>
	export default {
		data() {
			return {
				isEmpty: false, // 是否显示“空数据”
				//  列表数据
				newsList: [
				// 	{
				// 	created: 0,
				// 	isEnable: 1,
				// 	noticeContent: "加载中",
				// 	noticeImage: [],
				// 	noticeNumber: "加载中",
				// 	noticeSendTime: 0,
				// 	noticeTitle: "加载中",
				// 	updated: 0,
				// },
				],
				loadingText: '加载中...', // 当前状态
				pageNum: 1, //默认页数
				pageSize: 5, //一页加载数据条数
				total: 0,
			}
		},
		methods: {
			// 页面跳转
			goto(url) {
				uni.navigateTo({
					url: url
				})
			},
			leftClick() {

			},
			// 获取公告消息列表数据
			getNotice() {
				this.pageNum = 1;
				// 显示loading
				uni.showNavigationBarLoading();
				var that = this; // 重写this为that
				uniCloud.callFunction({
					name: "getNotice",
					data: {
						"pageNum": that.pageNum,
						"pageSize": that.pageSize,
						"isEnable": true
					},
					success: function(res) {
						console.log("notice res:", res.result.data)
						that.newsList = res.result.data
						console.log(res.result.data);
						// 是否空数据
						if (that.newsList.length == 0) {
						  that.isEmpty = true;
						}
						// 隐藏loading
						uni.hideNavigationBarLoading();
						// 停止下拉刷新加载
						uni.stopPullDownRefresh();
						// 关键，决定是否进行加载数据
						that.loadingText = '加载更多';
						console.log(res.result.data);
					},
				})
			},
			// 时间戳转年月日
			getYMDHMS(timestamp) {
				var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
				var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

				var strDate = Y + M + D + h + m + s;
				return strDate;
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
				//在当前页面显示导航条加载动画。
				uni.showNavigationBarLoading();
				// 页面加载
				this.pageNum++;
				// 调用云函数，获取列表
				uniCloud.callFunction({
						name: 'getNotice',
						data: {
							"pageNum": this.pageNum,
							"pageSize": this.pageSize,
							"isEnable": true
						}
					})
					.then(res => {
						// 
						this.loadingText = '';

						console.log(res);
						// 新旧数据拼接
						this.newsList = this.newsList.concat(res.result.data);
						this.loadingText = '加载更多';
						// 判断是否加载完毕
						if (res.result.data.length == 0) {
							// 是否空数据
							if (that.newsList.length == 0) {
							  that.isEmpty = true;
							}
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
		onLoad() {
			// 当前页面
			console.log(`当前页面:notice`)
		},
		created() {
			this.getNotice()
		},
		onPullDownRefresh() {
			this.getNotice()
		},
		//页面滚动到底部的事件
		onReachBottom() {
			this.getMoreNews();
		},

	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}

	.notice-item {
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

	.content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	}

	.title {
		display: flex;
		align-items: center;
		height: 90upx;
		font-size: 32upx;
		color: #303133;
	}

	.img-wrapper {
		width: 100%;
		height: 260upx;
		position: relative;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36upx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding: 16upx 0;
		font-size: 28upx;
		color: #606266;
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
</style>