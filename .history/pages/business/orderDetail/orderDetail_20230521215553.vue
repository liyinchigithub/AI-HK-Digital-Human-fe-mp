<template>
	<view>
		<uni-card class="card">
			<u-row gutter="12" style="margin-top: 10rpx;margin-bottom: 50rpx;">
				<u-col span="6" style="font-size: 50rpx;color: black;">
					订单号
					{{orderDetailData.orderNumber}}
				</u-col>
			</u-row>
			<u-row gutter="12" style="margin-top: 10rpx;margin-bottom: 50rpx;">
				<u-col span="6" style="font-size: 50rpx;color: black;">
					<u--image :showLoading="true" :src="orderDetailData.image.url" width="100rpx" height="100rpx">
					</u--image>
				</u-col>
				<u-col span="6" style="font-size: 50rpx;color: black;">
					支付时间
					{{orderDetailData.created}}
				</u-col>
			</u-row>
		</uni-card>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderDetailData: {
					"orderID": "", // 订单ID
					"image": [], // 商品图片
					"created": "加载中", // 支付时间
					"orderNumber": "加载中", // 订单编号
					"goodsName": "加载中", // 商品名称
					"goodsID": "加载中", // 商品ID
					"orderStatus": "加载中", //订单状态
					"orderType": "加载中", // 订单类型
					"amountPayable": 0, // 应付金额
					"actualAmountPaid": 0, // 实际支付金额
					"discountAmount": 0, // 优惠金额
					"reservationID": "", // 预约记录ID
					"openID": "", // 微信用户ID
					"userID": "", // 用户ID
					"created": "", // 创建订单时间
					"expectedAppointmentDateTime": "", // 期望预约日期时间
					"actualAppointmentDateTime": "", // 实际上门服务日期时间
				},

			};
		},
		methods: {
			// 分享给微信好友
			shareFriend() {},
			// 分享到微信朋友圈
			shareFriendQuan() {},
			clickHandler() {
				// #ifndef MP-WEIXIN
				uni.$u.toast("请在微信小程序内查看效果");
				// #endif
			},
			getOrderData() {
				//在当前页面显示导航条加载动画。
				uni.showNavigationBarLoading();
				// 调用云函数，获取列表
				uniCloud
					.callFunction({
						name: "order",
						data: {
							"method":"getOrderDetail",
							"_id": this.orderDetailData.orderID,
						},
					})
					.then((res) => {
						this.loadingText = "";
						console.log(`getOrderDetail res :${JSON.stringify(res.result)}`);
						// 新旧数据拼接
						// this.orderDetailData.goodName =res.result.data[0].goodName;
						this.orderDetailData.goodsID = res.result.data[0].goodsID; // 商品ID
						this.orderDetailData.orderNumber = res.result.data[0].orderNumber; // 订单号
						this.orderDetailData.orderType = res.result.data[0].orderType;	// 订单类型
						this.orderDetailData.orderStatus = res.result.data[0].orderStatus;// 订单状态：
						this.orderDetailData.originalPrice = res.result.data[0].originalPrice// 原价
						this.orderDetailData.currentPrice = res.result.data[0].currentPrice// 现价
						this.orderDetailData.amountPayable = res.result.data[0].amountPayable;
						this.orderDetailData.actualAmountPaid = res.result.data[0].actualAmountPaid;
						this.orderDetailData.discountAmount = res.result.data[0].discountAmount;
						this.orderDetailData.reservationID = res.result.data[0].reservationID;
						this.orderDetailData.openID = res.result.data[0].openID;
						this.orderDetailData.userID = res.result.data[0].userID;
						this.orderDetailData.created = res.result.data[0].created;
						this.orderDetailData.expectedAppointmentDateTime = res.result.data[0]
							.expectedAppointmentDateTime;
						this.orderDetailData.actualAppointmentDateTime = res.result.data[0].actualAppointmentDateTime;
						this.orderDetailData.isEnable = res.result.data[0].isEnable;
						// 隐藏loading
						uni.hideNavigationBarLoading();
					}) // success
					.catch((err) => {
						console.log(err);
					}); // fail
			},
		},
		onLoad(options) {
			console.log(`onLoad options.orderID:${options.orderID}`);
			//
			// this.orderStatus=options.orderStatus;// 订单状态
			this.orderDetailData.orderID = options.orderID;
			this.orderDetailData.reservationID = options.reservationID;
			//
			this.getOrderData();
			// 当前页面
			console.log(`当前页面:orderDetail`);
		},
		// uniapp微信小程序分享页面到微信好友
		onShareAppMessage() {
			// TODO	读取缓存分享人ID
			return {
				title: this.orderDetailData.title,
				path: `/pages/business/orderDetail/orderDetail?_id=${this.orderDetailData._id}`, //分享的页面路径
			};
		},
		// uniapp微信小程序分享页面到微信朋友圈
		onShareTimeline() {
			// TODO	读取缓存分享人ID
			return {
				title: this.orderDetailData.title,
				query: `_id=${this.orderDetailData._id}`,
				imageUrl: this.orderDetailData.coverImage["url"],
			};
		},
		created() {},
	};
</script>

<style>
	.title {
		margin-left: 5%;
		margin-right: 5%;
		margin-top: 5%;
		margin-buttom: 5%;
		color: black;
	}

	.content {
		color: black;
		margin-left: 2%;
		margin-right: 2%;
		margin-top: 2%;
		margin-buttom: 2%;
	}

	.share {
		color: green;
		margin-left: 2%;
		margin-right: 2%;
		margin-top: 2%;
		margin-buttom: 2%;
	}
</style>