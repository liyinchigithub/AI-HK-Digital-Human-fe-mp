<template>
	<view>
		<u-cell-group>
			<u-cell icon="integral" title="新增同步微信地址" :value="address" arrow-direction="right"
				@click="getWechatAddress()"></u-cell>

		</u-cell-group>
		<!-- 空数据 -->
		<view class="">
			<u-empty marginTop="100rpx" :show="isEmpty" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png"
				:width="screenWidth" :height="screenHeight" textSize="40">
			</u-empty>
		</view>
		<!-- 列表数据 -->
		<view v-for="(address, index) in addressList" :key="index" v-show="!isEmpty">
			<u-swipe-action>
				<u-swipe-action-item :options="options1" @click="swipeActionItemClick(address._id)">
					<view class="swipe-action u-border-top u-border-bottom">
						<view class="swipe-action__content">
							<text class="swipe-action__content__text">{{address.addressee}}</text>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>
		<!-- 模态框 -->
		<u-modal :show="modalShow" @confirm="showModalConfirm" @cancel="showModalCancel" :title="showModalTitle"
			:content="showModalContent" :confirmText="confirmText" :cancelText="cancelText" :showConfirmButton="true"
			:showCancelButton="true" ref="uModal" :asyncClose="true"></u-modal>
		<!-- 上拉加载更多 -->
		<view class="loading" v-show="!isEmpty">{{ loadingText }}</view>
		<!-- 返回顶部 -->
		<view class="wrap">
			<u-back-top :scroll-top="scrollTop" :mode="mode" :icon-style="iconStyle"></u-back-top>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				address: "", // 地址
				pic: "", // 头像
				nickName: "", // 昵称
				openID: "", // 微信用户ID
				screenHeight: 0,
				screenWidth: 0,
				isEmpty: false, // 是否显示“空数据”
				addressList: [], // 列表数据
				cancelText: "取消",
				confirmText: "确认",
				modalShow: false,
				loadingText: "加载中...",
				scrollTop: 0,
				mode: "fixed",
				iconStyle: "line",
				pageNum: 1,
				pageSize: 4,
				total: 0,
				loading: false,
				loadingMore: false,
				loadingMoreLoading: false,
				loadingMoreEnd: false,
				loadingMoreEndLoading: false,
				showModalTitle: "二次确认",
				showModalContent: "是否删除地址",
				options1: [{
					text: "删除",
					style: {
						backgroundColor: "#f56c6c",
					},
				}, ],
				id: "",
			};
		},
		onPullDownRefresh() {
			// 请求云函数-用户服务地址
			this.getMyAddressList();
		},
		onLoad() {
			// 当前页面
			console.log(`当前页面:address`)
			// 读取缓存内容
			this.openID = uni.getStorageSync("openID");
			this.userID = uni.getStorageSync("userID");
			// 请求云函数-用户服务地址
			this.getMyAddressList();// 不能放在created中，且要在获取openID和userID之后
			
		},
		created(){
			
		},
		methods: {
			// 同步微信地址
			getWechatAddress() {
				var that = this;
				// 调用微信自带收货地址页面
				uni.chooseAddress({
					// 当用户选择地址并确定，触发回调函数Sucess事件
					success(res) {
						console.log(res.userName)
						console.log(res.postalCode)
						console.log(res.provinceName)
						console.log(res.cityName)
						console.log(res.countyName)
						console.log(res.detailInfo)
						console.log(res.nationalCode)
						console.log(res.telNumber)
						// 拼接完整地址
						that.address = `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`
						//  请求云函数，查询是否有该用户的数据
						uniCloud.callFunction({
							name: "address", // 云函数名
							data: {
								method: "addAddress",
								openID:that.openID,
								userID: that.userID,
								deliveryAddress: "",
								addressee: that.address,
								phone: res.telNumber,
							},
							success: (res) => {
								console.log("address addAddress:" + JSON.stringify(res))
								// 下拉刷新
								uni.startPullDownRefresh({
									success() {
										uni.showToast({
											title:" 已更新"
										})
									}
								})
							}, // 调用云函数成功处理
							fail: (err) => {
								console.error(err)
							}, // 调用云函数失败处理
							complete: () => {

							}
						});
					}
				})
			},
			// 点击
			swipeActionItemClick(id) {
				// 显示弹窗
				this.modalShow = true;
				// 存储当前点击的收藏商品ID
				this.id = id;
			},
			//  确认弹窗确认按钮
			showModalConfirm() {
				//  关闭确认弹窗
				this.modalShow = false;
				// 移除收藏
				this.deleteAddress(this.id);
				// 调试输出
				console.log(`deleteAddress id:${this.id}`);
				// 更新
				setTimeout(() => {
					this.getMyAddressList();
				}, 2000);
			},
			showModalCancel() {
				//  关闭确认弹窗
				this.modalShow = false;
			},
			// 滚动触底
			scrolltolower() {
				this.getMore();
			},
			// 页面跳转
			goto(url) {
				uni.navigateTo({
					url: url,
				});
			},
			// 移除我的收藏
			deleteAddress(id) {
				// 重写this为that
				var that = this;
				// 请求云函数-获取分类第2个数据，即约定第2个分类是家政
				uniCloud.callFunction({
					name: "address",
					data: {
						method: "deleteAddress",
						_id: id,
					},
					success: (res) => {
						// todo  刷新页面
						// that.addressList = res.result.data;
						// console.log("that.addressList:", that.addressList);
						//  判断是否删除成功
						if (res.result.code == 1) {
							// 下拉刷新
							uni.startPullDownRefresh({
								success() {
									uni.showToast({
										title:" 已更新"
									})
								}
							})
							//  提示
							uni.showToast({
								title: "删除成功",
								icon: "none",
								duration: 2000,
							});

						} else {
							//  提示
							uni.showToast({
								title: "删除失败",
								icon: "none",
								duration: 2000,
							});
						}
						
						// 隐藏顶栏加载logding
						uni.hideNavigationBarLoading();
						// 关键，决定是否进行加载数据
						that.loadingText = "加载更多";
						// 实际开发中通常是网络请求，加载完数据后就停止。这里仅做演示，加延迟为了体现出效果。
						uni.stopPullDownRefresh();
					},
				});
			},
			// 获取我的地址列表
			getMyAddressList() {
				this.pageNum = 1;
				// 显示loading
				uni.showNavigationBarLoading();
				// 重写this为that
				var that = this;
				// 请求云函数
				uniCloud.callFunction({
					name: "address",
					data: {
						"method": "getAddress",
						"pageNum": that.pageNum,
						"pageSize": that.pageSize,
						"isEnable": true,
						"userID": that.userID,
						"openID": that.openID,
					},
					success: (res) => {
						console.log("getAddress request data",{
						"method": "getAddress",
						"pageNum": that.pageNum,
						"pageSize": that.pageSize,
						"isEnable": true,
						"userID": that.userID,
						"openID": that.openID
					})
						that.addressList = res.result.data;
						console.log("that.addressList res:", res.result.data);
						// 是否空数据
						if (that.addressList.length == 0) {
							that.isEmpty = true;
						}
						// 隐藏顶栏加载logding
						uni.hideNavigationBarLoading();
						// 关键，决定是否进行加载数据
						that.loadingText = "加载更多";
						// 实际开发中通常是网络请求，加载完数据后就停止。这里仅做演示，加延迟为了体现出效果。
						uni.stopPullDownRefresh();
					},
				});
			},
			// 加载更多
			getMore() {
				var that = this;
				// 判断当前是否数据可加载
				if (that.loadingText != "" && that.loadingText != "加载更多") {
					that.loadingText = "到底啦~";
					return false;
				}
				that.loadingText = "加载中...";
				// 页面加载
				that.pageNum++;
				// 调用云函数，获取列表
				uniCloud
					.callFunction({
						name: "address",
						data: {
							method: "getAddress",
							userID: that.userID,
							openID: that.openID,
							pageNum: that.pageNum,
							pageSize: that.pageSize,
							isEnable: true,
						},
					})
					.then((res) => {
						that.loadingText = "";
						console.log("getMore res：",res);
						// 新旧数据拼接
						that.addressList = that.addressList.concat(res.result.data);
						that.loadingText = "加载更多";
						// 判断是否加载完毕
						if (res.result.data.length == 0) {
							// 是否空数据
							if (that.addressList.length == 0) {
								that.isEmpty = true;
							}
							//在当前页面隐藏导航条加载动画。
							uni.hideNavigationBarLoading();
							that.loadingText = "已加载全部";
							return false;
						}
						// 隐藏loading
						uni.hideNavigationBarLoading();
						// 实际开发中通常是网络请求，加载完数据后就停止。这里仅做演示，加延迟为了体现出效果。
						uni.stopPullDownRefresh();
					}) // success
					.catch((err) => {
						console.log(err);
					}); // fail
			},
		},

	}
</script>

<style lang="scss">
	.loading {
		text-align: center;
		color: #8f8f94;
	}
	.u-page {
		padding: 0;
	}

	.u-demo-block__title {
		padding: 10px 0 2px 15px;
	}

	.swipe-action {
		&__content {
			padding: 25rpx 0;

			&__text {
				font-size: 15px;
				color: $u-main-color;
				padding-left: 30rpx;
			}
		}
	}
</style>