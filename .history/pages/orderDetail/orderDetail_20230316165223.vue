<template>
	<view>
		<uni-card>
			<view class="">
				<u--image :showLoading="true" :src="orderDetailData.coverImage.url" width="100%" height="300px">
				</u--image>
			</view>
		</uni-card>
		<uni-card>
			<view class="title">
				<u--text :text="orderDetailData.title" size="35"></u--text>
			</view>
		</uni-card>
		<uni-card>
			<view class="content">
				<u--text :text="orderDetailData.contentsConsultation" size="30"></u--text>
			</view>
		</uni-card>
		<u-divider text="share" :dot="true" textColor="#18b566" lineColor="#18b566"></u-divider>
		<view class="share">
			<u--text text="分享到微信" openType="share" size="40" @click="clickHandler"></u--text>
			<!-- <u--text text="分享到微信" size="40" @click="shareFriend"></u--text>
			<u--text text="分享到朋友圈" size="40" @click="shareFriendQuan"></u--text> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				"orderDetailData": {
					"_id": "",
					"contentsConsultation": "",
					"coverImage": {},
					"created": "",
					"dateTime": "",
					"orderType": "",
					"imageList": [],
					"isEnable": 1,
					"title": "",
					"videoSrc": "",

				},
				"collectionName": "getOrderDetail"
			}
		},
		methods: {
			// 分享给微信好友
			shareFriend() {

			},
			// 分享到微信朋友圈
			shareFriendQuan() {


			},
			clickHandler() {
				// #ifndef MP-WEIXIN
				uni.$u.toast('请在微信小程序内查看效果')
				// #endif
			},
			getOrderData() {
				//在当前页面显示导航条加载动画。
				uni.showNavigationBarLoading();
				// 调用云函数，获取列表
				uniCloud.callFunction({
						name: this.collectionName,
						data: {
							"_id": this.orderDetailData._id
						}
					})
					.then(res => {
						this.loadingText = '';
						console.log(res);
						// 新旧数据拼接
						this.orderDetailData.contentsConsultation = res.result.data[0].contentsConsultation;
						this.orderDetailData.coverImage = res.result.data[0].coverImage;
						this.orderDetailData.created = res.result.data[0].created;
						this.orderDetailData.dateTime = res.result.data[0].dateTime;
						this.orderDetailData.orderType = res.result.data[0].orderType;
						this.orderDetailData.imageList = res.result.data[0].imageList;
						this.orderDetailData.isEnable = res.result.data[0].isEnable;
						this.orderDetailData.title = res.result.data[0].title;
						this.orderDetailData.videoSrc = res.result.data[0].videoSrc;
						// 隐藏loading
						uni.hideNavigationBarLoading();
					}) // success
					.catch((err) => {
						console.log(err);
					}) // fail
			}
		},
		onLoad(options) {
			console.log(options._id)
			//
			this.orderDetailData._id = options._id
			// 
			this.getOrderData()
			// 当前页面
			console.log(`当前页面:orderDetail`)

		},
		// uniapp微信小程序分享页面到微信好友
		onShareAppMessage() {
			return {
				title: this.orderDetailData.title,
				path: `/pages/orderDetail/orderDetail?_id=${this.orderDetailData._id}` //分享的页面路径
			}
		},
		// uniapp微信小程序分享页面到微信朋友圈
		onShareTimeline() {
			return {
				title: this.orderDetailData.title,
				query: `_id=${this.orderDetailData._id}`,
				imageUrl: this.orderDetailData.coverImage['url'],
			}
		},
		created() {

		}
	}
</script>

<style>
	.title {
		margin-left: 5%;
		margin-right: 5%;
		margin-top: 5%;
		margin-lbuttom: 5%;
		color: black;
	}

	.content {
		color: black;
		margin-left: 2%;
		margin-right: 2%;
		margin-top: 2%;
		margin-lbuttom: 2%;
	}

	.share {
		color: green;
		margin-left: 2%;
		margin-right: 2%;
		margin-top: 2%;
		margin-lbuttom: 2%;
	}
</style>
