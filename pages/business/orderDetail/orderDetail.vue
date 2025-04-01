<template>
	<view>
		<uni-card class="card">
			<u-row gutter="12">
				<u-col span="10">
					<view
						style="color: #f56c6c;font-size: 40rpx;margin-top: 20rpx;margin-bottom: 20rpx;text-align: center;">
						<text>{{orderDetailData.orderStatus==1?"已付款":(orderDetailData.orderStatus==2?"退款中":((orderDetailData.orderStatus==3?"已退款":((orderDetailData.orderStatus==4?"已完成":(orderDetailData.orderStatus==5?"待评价":"待付款"))))))}}</text>
					</view>
				</u-col>
			</u-row>
		</uni-card>
		<uni-card class="card">
			<u-row gutter="12"
				@click="goto(`/pages/business/goodsDetail/goodsDetail?goodsID=${orderDetailData.orderGoodsID}`)">
				<u-col span="5">
					<u--image :showLoading="true" :src="orderDetailData.imageUrl" width="160rpx" height="160rpx">
					</u--image>
				</u-col>
				<u-col span="10">
					<u-row gutter="12">
						<text
							style="font-size: 30rpx;color: black;margin-top: 10rpx;margin-bottom: 10rpx;">{{orderDetailData.orderGoodsName}}</text>
					</u-row>
					<u-row getter="flex-end">
						x<text
							style="font-size: 30rpx;color: black;margin-top: 10rpx;margin-bottom: 10rpx;">{{orderDetailData.orderGoodsCount}}</text>
					</u-row>
				</u-col>
			</u-row>
			<!-- <u-divider text="分割线" :dot="true"></u-divider> -->
			<u-row gutter="12">
				<u-col span="8">
					<view style="font-size: 30rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
						<text style="color:#909399;">商品价格：</text>
					</view>
				</u-col>
				<u-col span="4">
					<view style="font-size: 30rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
						<text style="color:black;margin-left: 20rpx;">
							{{orderDetailData.orderCurrentAmount}}</text> <text
							style="margin-left: 10rpx;color:black;">元</text>
					</view>
				</u-col>
			</u-row>
			<u-row gutter="12">
				<u-col span="8">
					<view style="font-size: 30rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
						<text style="color: #909399;">优惠金额：</text>
					</view>
				</u-col>
				<u-col span="4">
					<view style="font-size: 30rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
						<text style="font-size: 50rpx;color: red;border: 10ch;margin-left: 20rpx;"> - </text>
						<text
							style="color:black;margin-left: 20rpx;">{{orderDetailData.orderDiscountAmount}}</text><text
							style="color:black;margin-left: 10rpx;">元</text>
					</view>
				</u-col>
			</u-row>
			<u-row gutter="12">
				<u-col span="8">
					<view style="font-size: 30rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
						<text style="color: #909399;">应付金额：</text>
					</view>
				</u-col>
				<u-col span="4">
					<view style="font-size: 30rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
						<text style="color:black;margin-left: 20rpx;">
							{{orderDetailData.amountPayable}}</text> <text
							style="color:black;margin-left: 10rpx;">元</text>
					</view>
				</u-col>
			</u-row>
			<u-row gutter="12">
				<u-col span="8">
					<view style="font-size: 30rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
						<text style="color: #909399;">实付金额：</text>
					</view>
				</u-col>
				<u-col span="4">
					<view style="font-size: 30rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
						<text
							style="color:black;margin-left: 20rpx;text-align: right;">{{orderDetailData.actualAmountPaid}}</text><text
							style="color:black;margin-left: 10rpx;text-align: right;">元</text>
					</view>
				</u-col>
			</u-row>
		</uni-card>
		<uni-card class="card">
			<u-row gutter="12">
				<u-col span="10">
					<view style="margin-top: 20rpx;margin-bottom: 20rpx;">
						<text style="color: #909399;font-size: 30rpx;">订单号：</text><text
							style="color:black;">{{orderDetailData._id}}</text>
					</view>
				</u-col>
				<u-col span="2">
					<u-button type="error" :plain="true" text="复制" @click="copyOrder(orderDetailData._id)"
						size="mini"></u-button>
				</u-col>
			</u-row>
			<u-row gutter="12">
				<u-col span="5">
					<view style="margin-top: 20rpx;margin-bottom: 20rpx;">
						<text style="color:#909399;font-size: 30rpx;">创建时间：</text>
					</view>
				</u-col>
				<u-col span="7">
					<view style="margin-top: 20rpx;margin-bottom: 20rpx;">
						<text style="color:black;">{{getYMDHMS(orderDetailData.created)}}</text>
					</view>
				</u-col>
			</u-row>
		</uni-card>
		<uni-card class="card">
			<u-row justify="end">
				<u-col span="4">
					<view style="margin-left: 10rpx;margin-right: 20rpx;">
						<!-- 再次购买按钮 -->
						<u-button type="primary" text="再次购买"
							@click="goto(`/pages/business/goodsDetail/goodsDetail?goodsID=${orderDetailData.orderGoodsID}`)"></u-button>
					</view>
				</u-col>
				<u-col span="4">
					<!-- todo 申请退款按钮 -->
					<view style="margin-left: 10rpx;margin-right: 20rpx;">
						<u-button type="warning" text="申请退款" @click="applyRefund()"></u-button>
					</view>
				</u-col>
				<u-col span="4">
					<!-- todo 申请退款按钮 -->
					<view style="margin-left: 10rpx;margin-right: 20rpx;">
						<u-button type="info" text="联系客服" open-type="contact"></u-button>
					</view>
				</u-col>
			</u-row>
		</uni-card>
		<!-- 申请退款确认弹窗 -->
		<u-modal :show="modalShow" title="确认" content="是否申请退款" :closeOnClickOverlay="true" confirmText="确定" cancelText="取消" @confirm="confirm()" :showCancelButton="true" :showConfirmButton="true"
			@cancel="cancel()" @close="close"></u-modal>
		<!-- uni-pay 组件（隐藏） -->
		<!-- https://uniapp.dcloud.net.cn/uniCloud/uni-pay.html#组件方法 -->
		<!-- 其他参数 :debug="true" :adpid="adpid" return-url="/pages/business/orderDetail/orderDetail" -->
		<uni-pay ref="uniPay" v-show="false" @fail="onFail"></uni-pay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderDetailData: {
					_id: "",
					orderGoodsID: "", // 订单-商品ID
					orderGoodsName: "", // 订单-商品名称
					orderGoodsCount: "",
					orderType: "",
					orderStatus: 6,
					orderOriginalAmount: "",
					orderCurrentAmount: "",
					orderDiscountAmount: "",
					amountPayable: "",
					actualAmountPaid: "",
					orderPayType: "",
					discountMethod: "",
					isAssociatedBookingSheet: "",
					reservationID: "",
					openID: "",
					userID: "",
					created: "",
					isEnable: "",
					imageUrl: "",
				},
				// 申请退款确认弹窗
				modalShow: false,
				confirmText: "确认",
				cancelText: "取消",


			};
		},
		methods: {
			goto(url) {
				// reLaunch会关闭之前所有页面，navigateTo保留之前访问所有页面
				uni.navigateTo({
					url: url
				})
			},
			// 查询退款状态
			async getRefund() {
				let res = await this.$refs.uniPay.getRefund({
					out_trade_no: this.orderDetailData.uniPayOutTradeNo, // 插件支付单号
				});
				if (res) {
					uni.showModal({
						content: res.errMsg,
						showCancel: false
					});
				}
			},
			// 发起退款
			applyRefund() {
				// 显示确认弹窗
				this.modalShow = true
			},
			// 申请退款确认弹窗-确认
			async confirm() {
				// todo 更新页面、更新订单状态为"退款中""
				let result = await this.$refs.uniPay.refund({
					out_trade_no: this.orderDetailData.uniPayOutTradeNo, // 插件支付单号
					refund_fee:(this.orderDetailData.actualAmountPaid)*100
				});
				// 
				if (result) {
					uni.showToast({
						title: result.errMsg,
						icon: "none"
					});
				}
				// 查询退款状态
				// this.getRefund();
				// 关闭确认弹窗
				this.modalShow = false
				
			},
			// 申请退款确认弹窗-cancel
			cancel() {
				// 关闭确认弹窗
				this.modalShow = false
			},
			// 申请退款确认弹窗close
			close() {
				// 关闭确认弹窗
				this.modalShow = false
			},
			// 获取商品图片
			getGoodsImageDetail() {
				var that = this;
				uniCloud.callFunction({
					name: "goods",
					data: {
						"method": "getGoodsDetail",
						"orderGoodsID": that.orderDetailData.orderGoodsID
					},
					success(res) {
						console.log("goods getGoodsDetail res.result.data:", res.result.data)
						that.orderDetailData.imageUrl = res.result.data[0].image.url
						that.orderDetailData.orderGoodsName = res.result.data[0].title
						that.orderDetailData.classTypeID = res.result.data[0].classTypeID
						that.orderDetailData.brandID = res.result.data[0].brandID
						
					}
				})
			},
			// 获取微信支付订单信息
			getUniPayOrderInfo() {
				var that = this;
				uniCloud.callFunction({
					name: "getUniPayOrder",
					data: {
						"orderNo": that.orderDetailData.orderNo
					},
					success(res) {
						console.log("getUniPayOrder res：", res)
						// 微信支付订单，实际支付金额
						that.orderDetailData.actualAmountPaid = res.result.data[0].total_fee / 100;
						that.orderDetailData.uniPayOutTradeNo = res.result.data[0].out_trade_no;
					}
				})
			},
			// 获取自有订单信息
			getOrderData() {
				var that = this;
				//在当前页面显示导航条加载动画。
				uni.showNavigationBarLoading();
				// 调用云函数，获取列表
				uniCloud
					.callFunction({
						name: "order",
						data: {
							"method": "getOrderDetail",
							"orderID": that.orderDetailData.orderID,
						},
					})
					.then((res) => {
						that.loadingText = "";
						console.log(`orderID:${that.orderDetailData.orderID}`);
						console.log(`getOrderDetail res :${JSON.stringify(res.result)}`);
						// 新旧数据拼接
						that.orderDetailData._id = res.result.data[0]._id;
						that.orderDetailData.orderGoodsID = res.result.data[0].orderGoodsID; // 商品ID
						that.orderDetailData.orderGoodsName = res.result.data[0].orderGoodsName; // 订单商品名称
						that.orderDetailData.orderGoodsCount = res.result.data[0].orderGoodsCount; // 订单购买商品数量
						that.orderDetailData.orderType = res.result.data[0].orderType; // 订单类型
						that.orderDetailData.orderStatus = res.result.data[0].orderStatus // 订单状态
						that.orderDetailData.orderOriginalAmount = res.result.data[0].orderOriginalAmount // 原价
						that.orderDetailData.orderCurrentAmount = res.result.data[0].orderCurrentAmount; // 现价
						that.orderDetailData.orderDiscountAmount = res.result.data[0]
							.orderDiscountAmount; // 优惠金额（原价-现价=优惠金额）
						that.orderDetailData.amountPayable = res.result.data[0].amountPayable; // 应付金额
						that.orderDetailData.actualAmountPaid = res.result.data[0].actualAmountPaid; // 实际支付金额
						that.orderDetailData.orderPayType = res.result.data[0].orderPayType; //
						that.orderDetailData.discountMethod = res.result.data[0].discountMethod; //
						that.orderDetailData.isAssociatedBookingSheet = res.result.data[0].isAssociatedBookingSheet; //
						that.orderDetailData.reservationID = res.result.data[0].reservationID; // 预约单ID
						that.orderDetailData.openID = res.result.data[0].openID;
						that.orderDetailData.userID = res.result.data[0].userID;
						that.orderDetailData.created = res.result.data[0].created;
						that.orderDetailData.isEnable = res.result.data[0].isEnable;
						that.orderDetailData.orderNo = res.result.data[0].orderNo;
						// 隐藏loading
						uni.hideNavigationBarLoading();
						// 获取商品数据
						that.getGoodsImageDetail()
						// 获取微信支付订单数据
						that.getUniPayOrderInfo()
					}) // success
					.catch((err) => {
						console.log(err);
					}); // fail
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
			// 复制订单号
			copyOrder(orderID) {
				uni.setClipboardData({
					data: orderID,
					success() {
						uni.showToast({
							title: "复制成功"
						})
					}
				})
			}
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
				path: `/pages/business/orderDetail/orderDetail?_id=${this.orderDetailData._id}`, //分享的页面路径
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