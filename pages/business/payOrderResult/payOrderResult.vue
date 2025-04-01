<!-- 支付结果页 -->
<template>
	<view>
		<view>
			<view class="icon">
				<uni-icons type="checkbox-filled" color="#2979ff" size="80" v-show="showIcon"></uni-icons>
				<uni-icons type="clear" color="#fa3534" size="80" v-show="!showIcon"></uni-icons>
				<h1 style="font-size:80rpx;">{{text}}</h1>
			</view>
			<view class="orderInfo">
				<u-cell-group>
					<u-cell :arrow="false" icon="order" title="订单编号" :value="orderNumber"></u-cell>
					<u-cell :arrow="false" icon="clock" title="下单时间" :value="created"></u-cell>
					<u-cell :arrow="false" icon="rmb-circle" title="支付方式" value="微信支付"></u-cell>
				</u-cell-group>
			</view>
			<view class="button">
				<u-row gutter="12" justify="center">
					<u-col span="6">
						<u-button type="success" size="default" :ripple="true" ripple-bg-color="#909399"
							@click="goto(`/pages/business/orderDetail/orderDetail?orderID=${orderID}`)" >查看订单</u-button>
					</u-col>
					<u-col span="6">
						<u-button type="primary" size="default"  :ripple="true" ripple-bg-color="#909399" @click="goto(`/pages/reservationDetail/reservationDetail?id=${reservationID}`)" >查看预约</u-button>
					</u-col>
				</u-row>
				<view class="toHome">
					<u-button type="primary" size="medium" :plain="true" @click="gotoTabbar('/pages/home/home')"
						:ripple="true" ripple-bg-color="#909399" shape="square">返回首页</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "payResultDetail",
		data() {
			return {
				payResult:"",
				text: "", // 支付结果文案
				orderStatus: 0, // 支付结果状态
				showIcon: false, // 是否显示支付成功icon
				orderNumber: "", // 订单编号
				created: "", // 订单创建时间
				orderID: "",// 订单ID
				reservationID:""// 预约ID
			}
		},
		methods: {
			// 获取详情
			getDetail(id) {
				// 请求后端（调云函数，获取该登录用户的图片数据）
				uniCloud.callFunction({
						name: 'getOrderDetail',
						data: {
							"id": id
						}
					})
					.then(res => {
						// 赋值给列表
						this.list = res.result.data;
						console.log(`getOrderDetail:${JSON.stringify(res.result.data)}`);

					}) // success
					.catch((err) => {}) // fail
			},
			goto(url) {
				uni.navigateTo({
					url: url,
					animationType: 'slide-in-right',
					animationDuration: 300
				})
			},
			gotoTabbar(url) {
				uni.switchTab({
					url: url,
					animationType: 'slide-in-right',
					animationDuration: 300
				})
			},
			pay(orderID) {
				console.log("pay to orderID:", orderID)
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
		//添加控件依赖
		components: {},
		onLoad(options) {
			// 当前页面
			console.log(`当前页面:payOrderResult`)
			console.log("options：",options)
			// 获取路由传入参数
			this.payResult = options.payResult
			console.log(`payOrderResult options.payResult:${options.payResult}`)
			// 获取用户信息
			this.pic = uni.getStorageSync("userInfo").avatarUrl;
			this.username = uni.getStorageSync("userInfo").nickName;
			this.openID = uni.getStorageSync("openID");
			var that = this;
			// 订单ID
			that.orderID = uni.getStorageSync("orderID");
			// todo 查询订单信息
			uniCloud.callFunction({
				name: "getMyOrderDetail",
				data: {
					"openID": uni.getStorageSync("openID"),
					"id": uni.getStorageSync("orderID")
				},
				success(res) {
					console.log("getMyOrderDetail res.data:", res.result.data)
					that.orderStatus = res.result.data[0].orderStatus;// 订单状态 
					that.reservationID = res.result.data[0].reservationID;// 订单对应预约ID
					if (that.orderStatus == 2) { // 1-待付款、2-已支付、3-退款中、4-已退款
						that.showIcon = true;
						that.text = "支付成功"
					} else {
						that.showIcon = false;
						that.text = "支付失败"
					}
					// 订单编号
					that.orderNumber = res.result.data[0].orderNumber;
					// 下单时间
					that.created = that.getYMDHMS(res.result.data[0].created);
				}

			})
		},
	}
</script>

<style lang="scss">
	.button {
		margin-left: 5%;
		margin-right: 5%;
		text-align: center;
	}

	.orderInfo {
		margin-top: 20%;
		margin-bottom: 10%;
	}

	// 轮播图
	.wrap {
		padding: 40rpx;
	}

	.payButton {
		text-align: right;
	}

	.icon {
		text-align: center;
		margin-top: 20%;
		margin-bottom: 10%;
	}

	.toHome {
		text-align: center;
		margin-top: 10%;
		margin-bottom: 10%;
	}
</style>
