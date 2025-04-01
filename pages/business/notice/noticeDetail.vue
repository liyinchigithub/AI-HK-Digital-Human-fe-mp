<template>
	<view>
		<!-- 微信小程序顶部白块 -->
		<!-- #ifdef MP -->
		<view style="height: 40rpx;">
		</view>
		<!-- #endif -->
		<!-- 通知详情页 -->
		<uni-card class="card">
			<view class="">
				<view class="img-wrapper">
					<image class="pic" :src="item.noticeImage[0].fileID"></image>
				</view>
			</view>
			<view class="title">
				【{{ item.noticeTitle == undefind ? "loading" : item.noticeTitle }}】
			</view>
			<view class="">
				{{ item.noticeContent == undefind ? "loading" : item.noticeContent }}
			</view>
			<view class="time">
				<text class="time">{{ getYMDHMS(item.noticeSendTime) }}</text>
			</view>
		</uni-card>

	</view>
</template>

<script>
export default {
	data() {
		return {
			id: "loading",
			item: []
		}
	},
	methods: {
		leftClick() {
			console.log('leftClick navigateBack');
			uni.navigateBack()
		},
		getNoticeDetail(id) {
			console.log("getNoticeDetail id:", id)
			var that = this;
			uniCloud.callFunction({
				name: "getNoticeDetail",
				data: {
					"_id": id
				},
				success: function (res) {
					console.log("getNoticeDetail res", res)
					that.item = res.result.data[0];
					// 更新已读状态
					that.markAsRead(id);
				}
			})
		},
		markAsRead(id) {
			uniCloud.callFunction({
				name: "markNoticeAsRead",
				data: {
					"_id": id,
					"openID": uni.getStorageSync("openID")
				},
				success: function (res) {
					console.log("Marked as read", res);
				}
			});
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
	},
	created() {

	},
	onLoad(options) {
		// 当前页面
		console.log(`当前页面:noticeDetail`)
		// 页面接收路由参数
		console.log("notice Detail options：", options)
		this.id = options._id;
		this.getNoticeDetail(this.id)
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
	color: #000000;
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
</style>
