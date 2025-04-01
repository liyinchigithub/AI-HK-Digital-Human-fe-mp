<template>
	<view class="coupon-item">
		<view class="coupon-money" @click="useCoupon(item)">
			<!-- 优惠券-名称 -->
			<u-row customStyle="margin-left: 10px;margin-bottom: 10px;">
				<u-col span="23">
					<view class="nick" v-if="!types">{{ item.couponName }}</view>
				</u-col>
			</u-row>
			<!-- 优惠券-金额 -->
			<u-row customStyle="margin-left: 2px;margin-top: 20px;margin-bottom: 5px">
				<u-col span="5">
					<view class="layof" :style="{ color: theme }">￥{{ item.discountAmount }}</view>
				</u-col>
			</u-row>
			<!-- 优惠券-截止有效期-->
			<u-row customStyle="margin-left: 2px;margin-top: 20px;margin-bottom: 5px;color: #424242;">
				<u-col span="14">
					<view class="end_time">【有效期至】{{ getYMDHMS(item.alidityEndTime) }} </view>
				</u-col>
			</u-row>
			<!-- 优惠券-券号-->
			<u-row customStyle="margin-left: 2px;margin-top: 20px;margin-bottom: 10px;color: #424242;">
				<u-col span="17">
					<text @click="copyID(item._id)"> 【券号】{{ item._id }}</text>
				</u-col>
			</u-row>
			<!-- <view style="color: red;">{{item.isUsed!=true?"已使用":"未使用"}}</view> -->
			<!-- <view class="demand">{{item.openID}}</view> -->
		</view>
		<!-- <view class="get-btn" v-if="types" :style="{ color: color, borderColor: color, background: solid }">选择使用</view> -->
		<navigator class="get-btn" v-if="!types" :style="{ color: color, borderColor: color, background: solid }"
			:url='item.url' @click="useCoupon(item)">立即使用</navigator>
	</view>
</template>

<script>
export default {
	components: {

	},
	data() {
		return {

		}
	},
	props: {
		item: {
			type: Object
		},
		types: {
			type: String,
			default: ''
		},
		theme: {
			type: String,
			default: '#71d5a1'
		},
		solid: {
			type: String,
			default: '#ffffff'
		},
		color: {
			type: String,
			default: '#71d5a1'
		},
	},
	methods: {
		copyID(_id) {
			uni.setClipboardData({
				data: _id,
				success() {
					uni.showToast({
						icon: 'none',
						title: '复制成功'
					});
				}
			})
		},
		// 点击优惠券卡片
		useCoupon(item) {
			// 清除优惠券缓存
			console.log("coupon item:", item)
			//
			try {
				// 判断是否可用券，不可用券则不暂存
				if (item.isUsed != true) {
					uni.setStorageSync('selectCoupon', JSON.stringify(item)); // 优惠券列表，点击选择优惠券，暂存到缓存，用户支付页面获取该优惠券后支付接口计算实际支付金额
					// TODO 支付页需要判断优惠券是否可用
					// 返回上一页（路由跳转支付页）
					// uni.navigateBack()
					uni.switchTab({
						url: '/pages/worker/worker'
					});
				} else {
					uni.showToast({
						title: '该券已使用'
					});
				}
			} catch (e) {
				// error
				console.log(e)
			}

		},
		// 时间戳转年月日
		getYMDHMS(timestamp) {
			var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			var Y = date.getFullYear() + "-";
			var M =
				(date.getMonth() + 1 < 10 ?
					"0" + (date.getMonth() + 1) :
					date.getMonth() + 1) + "-";
			var D =
				(date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
			var h =
				(date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
			var m =
				(date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
				":";
			var s =
				date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

			var strDate = Y + M + D + h + m + s;
			return strDate;
		},
	}
}
</script>

<style lang='scss'>
.coupon-item {
	width: 92%;
	height: auto;
	display: table;
	border-radius: 10upx;
	padding: 0 20upx;
	margin-top: 22upx;
	border: 1px solid #a09595;
	position: relative;

	.coupon-money {
		width: 550upx;
		height: auto;
		display: table;
		float: left;
		padding: 26upx 0;
		border-style: none dotted none none;
		border-color: #8d8383;

		.nick {
			width: 100%;
			height: 50upx;
			line-height: 30upx;
			/* font-size: $font-sm; */
			color: rgb(255, 98, 0);
			font-weight: bold;
			font-size: 45rpx;
		}

		.tit {
			width: 100%;
			height: 50upx;
			line-height: 50upx;
			/* font-size: $font-sm; */
			color: rgb(255, 255, 255);
		}

		.demand {
			width: 100%;
			height: 30upx;
			line-height: 30upx;
			/* font-size: $font-sm; */
			/* color: $font-color-999; */
		}

		.layof {
			width: 100%;
			height: 48upx;
			line-height: 30upx;
			font-size: 70upx;
			font-weight: bold;
		}

		.end_time {
			width: 100%;
			height: 30upx;
			line-height: 30upx;
			/* font-size: $font-sm; */
			/* color: $font-color-999; */
		}
	}

	.get-btn {
		margin-top: 50rpx;
		width: 146upx;
		height: 52upx;
		line-height: 50upx;
		position: absolute;
		top: 50%;
		right: 5upx;
		margin-top: -26upx;
		// text-align: center;
		// border-radius: 60upx;
		color: #ff9000;
		// border: 1px solid #ff9000;
		/* font-size: $font-sm; */
		float: right;
	}
}

.coupon-item:after {
	width: 40upx;
	height: 20upx;
	position: absolute;
	left: 460upx;
	top: -1px;
	border-radius: 0 0 40upx 40upx;
	content: "";
	display: block;
	background: '#ffffff';
	border: 1px solid #71d5a1;
	border-top: 0px;
}

.coupon-item:before {
	width: 40upx;
	height: 20upx;
	position: absolute;
	left: 460upx;
	bottom: -1px;
	border-radius: 40upx 40upx 0 0;
	content: "";
	display: block;
	background: '#ffffff';
	border: 1px solid #71d5a1;
	border-bottom: 0px;
}
</style>