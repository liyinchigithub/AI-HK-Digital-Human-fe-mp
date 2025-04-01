<template>
	<view class="list">
		<!-- 空数据 -->
		<view class="">
			<u-empty marginTop="100rpx" :show="isEmpty" mode="favor" icon="http://cdn.uviewui.com/uview/empty/data.png"
				:width="screenWidth" :height="screenHeight" textSize="40">
			</u-empty>
		</view>
		<!-- 列表数据 -->
		<view class="content" v-show="!isEmpty">
			<view class="uni-worker-list">
				<view class="uni-worker" v-for="(worker, index) in collectWorkerList" :key="index">
					<view class="card-item" @click="handleClick(worker.workerDetail._id)">
						<u-row>
							<u-col span="3">
								<image class="worker-image" :src="worker.workerDetail.workPhoto[0].url"
									@click.stop="previewImageSingle(worker.workerDetail.workPhoto[0].url)"></image>
							</u-col>
							<u-col span="5">
								<view class="worker-header">
									<text class="worker-name">{{ worker.workerDetail.username }}</text>
									<text class="worker-rating">⭐ 5</text>
									<text class="worker-tag"
										@click.stop="previewImageMultiple(worker.workerDetail.lifePhoto)">生活照</text>
								</view>
								<text class="worker-orders">近半年已服务{{ worker.workerDetail.serviceOrderNumber }}单</text>
								<view class="worker-actions">
									<u-row justify="space-between" customStyle="margin-top: 20rpx;margin-bottom: 5rpx">
										<u-col span="8">
											<u-tag plain :text="worker.workerDetail.isOnline ? '可服务' : '邀上线'"
												type="warning"></u-tag>
										</u-col>
										<u-col span="5" offset="1">
											<u-icon name="chat" :size="30"></u-icon><text class="worker-stats"> {{
												worker.workerDetail.workerEvaluationNumber }}</text>
										</u-col>
										<u-col span="5" offset="1">
											<u-icon name="heart" :size="30"></u-icon><text class="worker-stats"> {{
												worker.workerDetail.workerFavorited }}</text>
										</u-col>
									</u-row>
								</view>
							</u-col>
							<u-col span="4" class="right-section">
								<u-row>
									<text class="next-available">最近可约21:00</text>
								</u-row>
								<u-row>
									<text class="distance-info">2公里免出行</text>
								</u-row>
								<u-row>
									<button class="book-now" @click.stop="toOrder(worker._id)">立即预约</button>
								</u-row>
							</u-col>
						</u-row>
					</view>
				</view>
			</view>
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
	components: {},
	data() {
		return {
			screenHeight: 0,
			screenWidth: 0,
			isEmpty: false, // 是否显示“空数据”
			collectWorkerList: [],
			cancelText: "取消",
			confirmText: "确认",
			modalShow: false,
			loadingText: "加载中...",
			scrollTop: 0,
			mode: "fixed",
			iconStyle: "line",
			page: 1,
			pageSize: 5,
			total: 0,
			loading: false,
			loadingMore: false,
			loadingMoreLoading: false,
			loadingMoreEnd: false,
			loadingMoreEndLoading: false,
			showModalTitle: "二次确认",
			showModalContent: "是否移除收藏",
			options1: [{
				text: "删除",
				style: {
					backgroundColor: "#f56c6c",
				},
			},],
			id: "",
		};
	},
	onLoad(options) {
		this.getMyColletWorkerList();
	},
	onShow() {
		this.getMyColletWorkerList(); // 在页面显示时重新获取收藏列表
	},
	methods: {
		// 预览图片单张（普通图片点击事件）
		previewImageSingle(url) {
			uni.previewImage({
				current: 0, // 当前显示图片的索引
				urls: [url], // 需要预览的图片http链接列表
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function (data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function (err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		// 预览图片多张（头像点击事件）
		previewImageMultiple(images) {
			const urls = images.map(img => img.url);
			uni.previewImage({
				current: 0, // 当前显示图片的索引
				urls: urls, // 需要预览的图片http链接列表
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function (data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function (err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		// 点击
		handleClick(id) {
			console.log("handleClick id:", id);
			// 跳转workerDetail
			uni.navigateTo({
				url: `/pages/business/workerDetail/workerDetail?workerID=${id}`,
			});
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
			this.deleteCollectWorker(this.id);
			// 调试输出
			console.log(`deleteCollectWorker id:${this.id}`);
			// 更新
			setTimeout(() => {
				this.getMyColletList();
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
		deleteCollectWorker(id) {
			// 重写this为that
			var that = this;
			// 请求云函数-获取分类第2个数据，即约定第2个分类是家政
			uniCloud.callFunction({
				name: "collectWorker",
				data: {
					method: "deleteCollectWorker",
					workerID: id,
					userID: uni.getStorageSync("userID"),
					openID: uni.getStorageSync("openID"),
				},
				success: (res) => {
					that.collectWorkerList = res.result.data;
					// console.log("that.collectWorkerList:", that.collectWorkerList);
					// 隐藏顶栏加载logding
					uni.hideNavigationBarLoading();
					// 关键，决定是否进行加载数据
					that.loadingText = "加载更多";
					// 实际开发中通常是网络请求，加载完数据后就停止。这里仅做演示，加延迟为了体现出效果。
					uni.stopPullDownRefresh();
				},
			});
		},
		// 获取我的收藏列表
		getMyColletWorkerList() {
			this.pageNum = 1;
			// 显示loading
			uni.showNavigationBarLoading();
			// 重写this为that
			var that = this;
			// 请求云函数-获取分类第2个数据，即约定第2个分类是家政
			uniCloud.callFunction({
				name: "collectWorker",
				data: {
					methods: "getMyCollectWorker",
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					isEnable: true,
					userID: uni.getStorageSync("userID"),
					openID: uni.getStorageSync("openID"),
				},
				success: (res) => {
					// console.log("res:", JSON.stringify(res));
					if (res.result && Array.isArray(res.result.data)) {
						this.collectWorkerList = res.result.data.map(worker => ({
							...worker,
							// 确保包含所有需要的字段
							username: worker.username || '未知',
							workPhoto: worker.workPhoto || [{ url: 'default.jpg' }],
							serviceOrderNumber: worker.serviceOrderNumber || 0,
							isOnline: worker.isOnline || false,
							workerEvaluationNumber: worker.workerEvaluationNumber || 0,
							workerFavorited: worker.workerFavorited || 0,
						}));
						this.isEmpty = this.collectWorkerList.length === 0;
					} else {
						this.collectWorkerList = [];
						this.isEmpty = true;
					}
					uni.hideNavigationBarLoading();
					this.loadingText = "加载更多";
					uni.stopPullDownRefresh();
				},
				fail: (err) => {
					this.collectWorkerList = [];
					this.isEmpty = true;
					uni.hideNavigationBarLoading();
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
					name: "collectWorker",
					data: {
						methods: "getMyCollectWorker",
						pageNum: that.pageNum,
						pageSize: that.pageSize,
						isEnable: true,
						userID: uni.getStorageSync("userID"),
						openID: uni.getStorageSync("openID"),
					},
				})
				.then((res) => {
					that.loadingText = "";
					// console.log("res:", JSON.stringify(res));
					if (res.result && Array.isArray(res.result.data)) {
						// 新旧数据拼接
						that.collectWorkerList = that.collectWorkerList.concat(res.result.data);
						that.loadingText = "加载更多";
						// 判断是否加载完毕
						if (res.result.data.length == 0) {
							// 是否空数据
							if (that.collectWorkerList.length == 0) {
								that.isEmpty = true;
							}
							// 在当前页面隐藏导航条加载动画。
							uni.hideNavigationBarLoading();
							that.loadingText = "已加载全部";
							return false;
						}
					} else {
						console.error("Unexpected response format:", res);
						that.loadingText = "加载失败，请重试";
					}
					// 隐藏loading
					uni.hideNavigationBarLoading();
					// 实际开发中通常是网络请求，加载完数据后就停止。这里仅做演示，加延迟为了体现出效果。
					uni.stopPullDownRefresh();
				}) // success
				.catch((err) => {
					console.log(err);
					that.loadingText = "加载失败，请重试";
				}); // fail
		},
	},
	/**
	 * 下拉刷新回调函数
	 */
	onPullDownRefresh() {
		this.getMyColletWorkerList();
	},
	/**
	 * 上拉加载回调函数
	 */
	onReachBottom() {
		this.getMore();
	},
	// // 分享微信好友
	// onShareAppMessage() {
	//   // TODO	读取缓存分享人ID
	//   return {
	//     title: "师傅服务平台-用户端",
	//     path: `/pages/business/home/home`, //分享的页面路径
	//   };
	// },
	// // 分享微信朋友圈
	// onShareTimeline() {
	//   // TODO	读取缓存分享人ID
	//   return {
	//     title: "[师傅服务平台-用户端]"+this.item.title,
	// 	path: `/pages/business/home/home`, //分享的页面路径,
	//     // query: `id=${this.id}`,
	//     imageUrl:this.item.imageList[0].url
	//   };
	// },
};
</script>

<style lang="scss">
.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}

/* 列表内容 */
.content {
	margin-top: 20rpx;
}

/* worker */
.uni-worker-list {
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	flex-direction: row;
}

.uni-worker {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin: 10rpx;
	padding: 20rpx;
	width: 100%;
	background: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.worker-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.worker-header {
	display: flex;
	align-items: center;
	margin-bottom: 10rpx;
}

.worker-name {
	font-size: 32rpx;
	font-weight: bold;
	margin-right: 10rpx;
}

.worker-rating {
	font-size: 28rpx;
	color: #f39c12;
	margin-right: 10rpx;
}

.worker-tag {
	font-size: 24rpx;
	color: #71d5a1;
	border: 1px solid #71d5a1;
	border-radius: 10rpx;
	padding: 2rpx 6rpx;
}

.worker-orders {
	font-size: 25rpx;
	color: #888;
	margin-bottom: 10rpx;
}

.worker-actions {
	display: flex;
	align-items: center;
	margin-bottom: 10rpx;
	margin-left: -20rpx;
}

.right-section {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.next-available,
.distance-info {
	font-size: 28rpx;
	color: #888;
	margin-bottom: 10rpx;
}

.book-now {
	background-color: #71d5a1;
	color: #fff;
	padding: 10rpx 20rpx;
	margin-top: 20rpx;
	margin-left: 20rpx;
	border-radius: 10rpx;
	font-size: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 230rpx;
	height: 60rpx;
}

.empty-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 200rpx;
	margin-top: 50rpx;
}

.overlay-content {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
}
</style>