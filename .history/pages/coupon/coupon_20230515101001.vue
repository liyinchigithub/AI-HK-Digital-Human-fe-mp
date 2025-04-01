<template>
	<view>

		<u-subsection :list="tabList" :current="curNow" @change="tabClick" fontSize="30rpx" inactiveColor="#2979ff"
			activeColor="#2979ff"></u-subsection>
		<!-- 空数据 -->
		<view class="">
			<u-empty marginTop="100rpx" :show="isEmpty" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" :width="screenWidth"
				:height="screenHeight" textSize="40">
			</u-empty>
		</view :show="!isEmpty">
		<!-- 优惠券列表 -->
		<view class="" v-for="(item,index) in newsList" :key="index">
			<coolcCoupon :item="item"></coolcCoupon>
		</view>

		<!-- TODO 分页 -->
		<view class="loading" v-show="!isEmpty">{{loadingText}}</view>
	</view>
</template>
var _self, page = 1, timer = null;
<script>
	import coolcCoupon from "@/components/coolc-coupon/coolc-coupon.vue"
	export default {
		data() {
			return {
				// 分段器 index 0、1、2、3、4、5
				tabList: ['未使用', '已使用'], // 订单状态：0-未使用、1-已使用
				curNow: 0, // 分段器默认选中第一个
				screenHeight: 0,
				screenWidth: 0,
				isEmpty: false, // 是否显示“空数据”
				// 优惠券
				newsList: [],
				loadingText: '加载中...', // 当前状态
				pageNum: 1, //默认页数
				pageSize:4, //一页加载数据条数
				total: 0,
				couponData: {
					"couponName": "立减券",
					"money": "100", //
					"end_time": "2023-05-01", // 有效期截止
					"ticket": "0000000001", // 券号
					"title": "",
					"url": "/pages/home/home" // 
				}
			}
		},
		components: {
			coolcCoupon
		},
		methods: {
			// 顶栏返回
			leftClick() {
				console.log('leftClick switchTab /pages/my/my');
				uni.switchTab({
					url: "/pages/my/my"
				})
			},
			// 切换tab点击事件
			tabClick(index) {
				this.curNow = index;
				console.log('this.curNow：', index==0?"未使用":"已使用");
				this.getListData(index) // 未使用
			},
			//
			getCoupon(item) {
				//这是点击领取优惠券时触发的事件
				console.log("item:", item)
			},
			// 券去使用
			goUseCoupon(couponID, isCanUse, fullAmount) {
				if (isCanUse == "已使用") {
					uni.showToast({
						title: "优惠券已使用"
					})
				} else {
					// 判断合计金额是否满足优惠券使用过门槛
					console.log("fullAmount:", fullAmount)
					console.log("currentTotalPrice:", uni.getStorageSync("currentTotalPrice"))
					if (fullAmount > uni.getStorageSync("currentTotalPrice")) {
						uni.showToast({
							title: "不满足使用条件"
						})
					} else {
						uni.setStorageSync("currentSelectCouponID", couponID)
						uni.navigateBack({
							delta: 2
						})
					}
				}
			},
			// 获取优惠券列表数据
			getListData(index) {
				uniCloud.callFunction({
					name: "getCoupon",
					data: {
						"openID": uni.getStorageSync("openID"),
						"pageSize": this.pageSize,
						"pageNum": this.pageNum,
						"isUsed": index==0?false:true, // 是否已被使用
						"isEnable": true// 是否可用
					},
					success: (res) => {
						this.newsList = res.result.data;
						console.log("res.result.data:", res.result.data)
						// 是否空数据
						if (this.newsList.length == 0) {
							this.isEmpty = true;
						}
						// 隐藏loading
						uni.hideNavigationBarLoading();
						// 停止下拉刷新加载
						uni.stopPullDownRefresh();
						// 关键，决定是否进行加载数据
						this.loadingText = '加载更多';
						console.log(res.result.data);
					}
				})
			},
			// 加载更多
			getMoreNews() {
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
						name: "getCoupon",
						data: {
							"openID": uni.getStorageSync("openID"),
							"pageSize": this.pageSize,
							"pageNum": this.pageNum,
							"isUsed": this.curNow==0?false:true, // 是否已被使用
							"isEnable": true// 是否可用
						}
					})
					.then(res => {
						this.loadingText = '';
						console.log("getCoupon res.result.data:", res);
						// 新旧数据拼接
						this.newsList = this.newsList.concat(res.result.data);
						this.loadingText = '加载更多';
						// 判断是否加载完毕
						if (res.result.data.length == 0) {
							// 是否空数据
							if (this.newsList.length == 0) {
								this.isEmpty = true;
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
		},
		created() {
			this.getListData(1)
		},
		onPullDownRefresh() {
			this.getListData(1)
		},
		//页面滚动到底部的事件
		onReachBottom() {
			this.getMoreNews();
		},
		onLoad() {
			// 当前页面
			console.log(`当前页面:coupon`)
			this.getListData(this.curNow)
		}
	}
</script>

<style>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}

	.card-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.dateTime {
		display: flex;
		align-items: right;
		justify-content: right;
		height: 80upx;
		padding-top: 10upx;
		font-size: 26upx;
		color: #fa3534;
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
		font-size: 30upx;
		margin-left: 1%;
		margin-right: 1%;
		margin-top: 1%;
		margin-buttom: 1%;
		color: black;
		line-height: 38upx;
		color: #303133;
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