<!-- 买卡 -->
<template>
	<view class="">
		<!-- 遮罩层 -->
		<!-- <u-overlay :show="maskShow" @click="maskShow = false">
			<u-loading-icon text="加载中" textSize="18"></u-loading-icon>
		</u-overlay> -->
		<!-- 加载页 -->
		<u-loading-page :loading="maskShow" bg-color="#e8e8e8" color="#ffffff" font-size="40">
		<!-- 分段 -->
		<u-subsection :list="list" :current="curNow" @change="sectionChange" fontSize="30rpx" inactiveColor="#2979ff"
			activeColor="#2979ff"></u-subsection>
		<!-- 列表 -->
		<view class="">
			<uni-card v-for="(item, index) in newsList" :key="index"
				@click="goto(`/pages/orderDetail/orderDetail?_id=${item._id}`)">
				<!-- <text class="time">{{getYMDHMS(item.noticeSendTime)}}</text> -->
				<view class="">
					<view class="">
						<u-row justify="space-between">
							<u-col span="10">
								<view class="demo-layout bg-purple">
									<text class="introduce">
										下单时间：{{getYMDHMS(item.created)}}
									</text>
								</view>
							</u-col>
						</u-row>
						<u-line></u-line>
						<u-col span="10">
							<view class="demo-layout bg-purple">
								<text class="dateTime">
									商品名称：{{item.goodsName}}
								</text>
							</view>
							<view class="demo-layout bg-purple">
								<text class="dateTime">
									数量：{{item.goodsCount}}
								</text>
							</view>
						</u-col>
						<u-line></u-line>
						<u-row justify="space-between">
							<u-col span="10">
								<view class="demo-layout bg-purple">
									<text class="introduce">
										支付金额：{{item.actualAmountPaid}}
									</text>
								</view>
							</u-col>
						</u-row>
						<u-row justify="space-between">
							<u-col span="10">
								<view class="demo-layout bg-purple">
									<text class="introduce">
										订单状态：{{item.orderStatus==1?"已付款":(item.orderStatus==2?"退款中":((item.orderStatus==3?"已退款":((item.orderStatus==4?"已完成":"待评价")))))}}
									</text>
								</view>
							</u-col>
						</u-row>
					</view>
				</view>
			</uni-card>
		</view>
		<view class="loading">{{loadingText}}</view>
		</u-loading-page>
		
	</view>
</template>
var _self, page = 1, timer = null;
<script>
	export default {
		name: "",
		data() {
			return {
				// 分段器 index 0、1、2、3、4、5
				list: ['全部', '已付款', '退款中', '已退款', '已完成', '待评价'], // 订单状态：1-已付款、2-退款中、3-已退款、4-已完成、5-待评价
				curNow: 0, // 分段器默认选中第一个
				isAllStatus: true, // 是否全部订单
				// 列表内容
				newsList: [{
					_id: "加载中",
					title: "加载中",
					dateTime: 0,
					isEnable: 1,
					coverImage: {
						"url": ""
					},
					imageList: [{
						"url": ""
					}, ]
				}],
				collectionName: "getOrder",
				loadingText: '加载中...', // 当前状态
				pageNum: 1, //默认页数
				pageSize: 4, //一页加载数据条数
				total: 0,
				// 遮罩
				maskShow: true,

			}
		},
		methods: {
			//
			sectionChange(index) {
				this.curNow = index;
				console.log(`sectionChange 当前选中:${index}`)
				// 判断index是否为0（全部订单）
				if (index == 0) {
					this.isAllStatus = true;
				} else {
					this.isAllStatus = false;
				}

				// 更新列表数据收到
				this.getListData(index);
			},
			// 页面跳转
			goto(url) {
				uni.navigateTo({
					url: url
				})
			},
			// 获取列表数据
			getListData(index) { // 订单状态：1-已付款、2-退款中、3-已退款、4-已完成、5-待评价
				// 显示遮罩
				this.maskShow = true
				// 初始化页码
				this.pageNum = 1;
				// 显示loading
				uni.showNavigationBarLoading();
				var that = this; // 重写this为that
				console.log(`getListData index:${index}`)
				console.log(`getListData isAllStatus:${that.isAllStatus}`)
				// 判断是否全部订单
				if (index != 0) {
					that.isAllStatus = false;
				} else {
					// 解决点击1-5后，再点击0，不显示数据的问题
					that.isAllStatus = true;
				}
				// debugger
				uniCloud.callFunction({
					name: "order",
					data: {
						"method": "getOrderList",
						"pageNum": that.pageNum, //页码
						"pageSize": that.pageSize, // 每页数据
						"isAllStatus": that.isAllStatus, // 是否全部订单
						"orderStatus": Number(index), // 订单状态：1-已付款、2-退款中、3-已退款、4-已完成、5-待评价
						"orderType": "普通订单", // 订单类型
						"openID": uni.getStorageSync("openID"), // 
						"userID": uni.getStorageSync("userID"), // 
						"isEnable": true
					},
					success: (res) => {
						console.log("order getOrderList res:", res)
						// 赋值给列表
						that.newsList = res.result.data
						console.log(res.result.data);
						// 隐藏loading
						uni.hideNavigationBarLoading();
						// 停止下拉刷新加载
						uni.stopPullDownRefresh();
						// 关键，决定是否进行加载数据
						that.loadingText = '加载更多';
						console.log(res.result.data);
						// 隐藏遮罩
						that.maskShow = false
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
						name: "order",
						data: {
							"method": "getOrderList",
							"isAllStatus": this.isAllStatus, // 是否全部订单
							"orderStatus": this.curNow, // 订单状态：1-已付款、2-退款中、3-已退款、4-已完成、5-待评价
							"orderType": "普通订单", // 订单类型
							"openID": uni.getStorageSync("openID"), // 
							"userID": uni.getStorageSync("userID"), // 
							"isEnable": true,
							"pageNum": this.pageNum,
							"pageSize": this.pageSize,
							"isEnable": 1
						}
					})
					.then(res => {
						this.loadingText = '';
						console.log(res);
						// 新旧数据拼接
						this.newsList = this.newsList.concat(res.result.data);
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
		created() {
			
		},
		onPullDownRefresh() {
			// 默认获取订单
			this.getListData(this.curNow)
		},
		//页面滚动到底部的事件
		onReachBottom() {
			this.getMoreNews();
		},
		onLoad(options) {
			// debugger
			console.log(`options.orderStatus:${options.orderStatus}`)
			// 当前选中
			this.curNow = options.orderStatus;
			// 默认获取订单
			this.getListData(this.curNow)
			// 当前页面
			console.log(`当前页面:order`)
		},
		// uniapp微信小程序分享页面到微信好友
		onShareAppMessage() {
			// TODO	读取缓存分享人ID
			return {
				title: '智慧生活',
				path: '/pages/order/order' //分享的页面路径
			}
		},
		// uniapp微信小程序分享页面到微信朋友圈
		onShareTimeline() {
			return {
				title: '智慧生活 ',
				query: ``,
				imageUrl: 'https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/498fe04a-ba2f-46a1-81e4-fb2b6436bfca.jpeg',
			}
		},
	}
</script>

<style lang='scss'>
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