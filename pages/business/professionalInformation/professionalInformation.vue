<template>
	<view>
		<view class="">
			<!-- 分类tab -->
			<u-tabs :list="tabList" lineWidth="30" lineColor="#f56c6c" :activeStyle="{
            color: '#303133',
            fontWeight: 'bold',
            transform: 'scale(1.05)'
        }" :inactiveStyle="{
            color: '#606266',
            transform: 'scale(1)'
        }" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;" @click="tabClick" @change="tabChange">
			</u-tabs>
		</view>
		<view class="">
			<!-- TODO 数据来源于请求云函数 -->
			<view class="" v-for="(item,index) in newsList">
				<uni-card class="card">
					<view class="img-wrapper">
						<image class="pic" :src="item.coverImage.url"></image>
					</view>
					<uni-card class="card">
						<view class="">
							{{item.title}}
						</view>
					</uni-card>
					<uni-card class="card">
						<view class="">
							{{item.content}}
						</view>
					</uni-card>
					<view class="">
						<button style="width: 400upx;color: #FFFFFF;background-color: #409EFF;" type="info"
							open-type="contact">立即咨询</button>
					</view>
				</uni-card>
			</view>
			<!-- 底部文案：加载更多、加载中、到底啦 -->
			<view class="loading">{{loadingText}}</view>
		</view>
		<!-- 遮罩 -->
		<u-overlay :show="maskShow" @click="maskShow = false"></u-overlay>
	</view>
</template>
var _self, page = 1, timer = null;
<script>
	export default {
		data() {
			return {
				collectionName: "getEduInfoType",
				currentSelectTab: {},
				_id: "",
				// 分类tab
				tabList: [{
					name: "",
				}],
				list: [],
				newsList: [],
				maskShow: true,
				pageNum: 1, //默认页数
				pageSize: 4, //一页加载数据条数
				total: 0,
				loadingText: '加载中...', // 当前状态
			}
		},
		// 下拉刷新的事件
		onPullDownRefresh() {
			// 初始化数据
			this.init();
		},
		//页面滚动到底部的事件
		onReachBottom() {
			this.getMoreNews();
		},
		methods: {
			tabClick(item) {
				console.log('item', item);
				// 当前选中tab
				this.currentSelectTab = {
					"name": item.name,
					"index": item.index
				}
				// 请求列表数据
				this.getDataList(item.name)
			},
			tabChange(index) {
				console.log("tab index:", index)
			},
			// 初始化获取分类tab
			getEduInfoTypeTab() {
				uniCloud.callFunction({
					name: this.collectionName,
					data: {
						isEnable: 1
					},
					success: (res) => { // 注意：使用箭头函数，如果使用function会导致在onLoad()获取不到数据
						this.tabList = res.result.data
						// 隐藏遮罩
						this.maskShow = false
						console.log("getEduInfoTypeTab:", res.result.data)

					}
				})
			},
			// 获取
			getDataList(tabName) {
				this.pageNum = 1;
				// 初始化list
				this.newsList = []
				console.log("getDataList()", tabName)
				uniCloud.callFunction({
					name: "getEduInfoTypeID",
					data: {
						"eduInfotypeName": tabName
					}
				}).then((res) => {
					console.log("getEduInfoTypeID res.result.data[0]:", res.result.data)
					this._id = res.result.data[0]._id;
					console.log("getEduInfoTypeID()", this._id)
					// 请求云函数
					uniCloud.callFunction({
						name: "getProfessionalInformation",
						data: {
							"eduInfoType": this._id,
							"isEnable": 1,
							"pageNum": this.pageNum,
							"pageSize": this.pageSize
						}
					}).then((res2) => {
						console.log("getProfessionalInformation res.result.data：", res2.result.data);
						this.newsList = res2.result.data
						console.log(res2.result.data);
						// 隐藏loading
						uni.hideNavigationBarLoading();
						// 停止下拉刷新加载
						uni.stopPullDownRefresh();
						// 关键，决定是否进行加载数据
						this.loadingText = '加载更多';
					})
				})
			},
			// 加载更多
			getMoreNews() {
				// 判断当前是否数据可加载TODO
				if (this.loadingText != '' && this.loadingText != '加载更多') {
					this.loadingText = "到底啦~"
					return false;
				}
				this.loadingText = '加载中...';
				//在当前页面显示导航条加载动画。
				uni.showNavigationBarLoading();
				// 页面加载
				this.pageNum++;
				// 发起请求
				console.log("111",{"pageNum": this.pageNum,"pageSize": this.pageSize})
				// 调用云函数，获取视频列表
				uniCloud.callFunction({
						name: "getProfessionalInformation",
						data: {
							"eduInfoType": this._id,
							"isEnable": 1,
							"pageNum": this.pageNum,
							"pageSize": this.pageSize
						}
					})
					.then(res => {
						this.loadingText = '';
						if (res.result.data == []) {
							//在当前页面隐藏导航条加载动画。
							uni.hideNavigationBarLoading();
							this.loadingText = '已加载全部';
							return false;
						}
						// 
						console.log(res);
						// 新旧数据拼接
						this.newsList = this.newsList.concat(res.result.data);
						this.loadingText = '加载更多';
						// 隐藏loading
						uni.hideNavigationBarLoading();
					}) // success
					.catch((err) => {
						console.log(err);
					}) // fail
			},
			init() {
				uniCloud.callFunction({
					name: this.collectionName,
					data: {
						isEnable: 1
					},
					success: (res) => { // 注意：使用箭头函数，如果使用function会导致在onLoad()获取不到数据
						this.tabList = res.result.data
						// 隐藏遮罩
						this.maskShow = false
						console.log("getEduInfoTypeTab:", res.result.data)
						// 初始化list
						this.newsList = []
						console.log("getDataList()", res.result.data[0].name)
						uniCloud.callFunction({
							name: "getEduInfoTypeID",
							data: {
								"eduInfotypeName": res.result.data[0].name
							}
						}).then((res2) => {
							console.log("getEduInfoTypeID res2.result.data[0]:", res2.result.data)
							this._id = res2.result.data[0]._id;
							console.log("getEduInfoTypeID()", this._id)
							// 请求云函数
							uniCloud.callFunction({
								name: "getProfessionalInformation",
								data: {
									"eduInfoType": this._id,
									"isEnable": 1,
									"pageNum": this.pageNum,
									"pageSize": this.pageSize
								}
							}).then((res3) => {
								console.log("getProfessionalInformation res.result.data：", res3
									.result.data);
								this.newsList = res3.result.data
							})
						})
					}
				})

			}
		},
		beforeCreate() {

		},
		created() {

		},
		onLoad() {
			this.pic = uni.getStorageSync("userInfo").avatarUrl;
			this.username = uni.getStorageSync("userInfo").nickName;
			this.openID = uni.getStorageSync("openID");
			// 初始化数据
			this.init();
		},
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

/* 	.card {
		height: 30rpx;
		background: #ffffff;
		margin-top: 1%;
		margin-left: 1%;
		margin-right: 1%;
		border-radius: 15rpx;
		position: relative;
	} */

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
