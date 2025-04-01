<template>
	<view>
		<!-- 遮罩 -->
		<u-overlay :show=" overlayShow" @click="overlayShow = false">
			<view class="warp">
				<view class="rect" @tap.stop>
					{{ overlayText }}
				</view>
			</view>
		</u-overlay>
		<!-- 商品 -->
		<uni-card>
			<!-- 商品封面图片 -->
			<view class="">
				<u--image :showLoading="true" :src="goodsDetailData['image']['url']" width="100%" height="300px"
					@click="previewImageSingle(goodsDetailData['image']['url'])">
				</u--image>
			</view>
			<view>
				<!-- 商品现价 -->
				<u-row justify="flex-start" customStyle="margin-top: 30rpx;margin-bottom: 20rpx">
					<u-col span="5">
						<text class="favourPrice">
							¥{{ goodsDetailData.favourPrice }}
						</text>
					</u-col>
					<!-- 商品标签 -->
					<u-tag plain plainFill type="error" shape="circle" :text="goodsDetailData.tip" size="mini"></u-tag>
				</u-row>
				<!-- 商品原价 -->
				<u-row customStyle="margin-top: 20rpx;margin-bottom: 10rpx">
					<u-col span="10">
						<span class="originalPrice">原价 ¥ </span><span
							class="huaxian">{{ goodsDetailData.originalPrice }}</span>
					</u-col>
				</u-row>
			</view>
		</uni-card>
		<uni-card>
			<!-- 商品名称 -->
			<u-row customStyle="margin-top: 5rpx;margin-bottom: 5rpx">
				<u-col span="12">
					<view class="title">
						<u--text :text="goodsDetailData.title" size="35"></u--text>
					</view>
				</u-col>
			</u-row>
			<!-- 快递费和月销量 -->
			<u-row customStyle="margin-top: 20rpx;margin-bottom: 10rpx">
				<u-col span="7">
					<text>快递费：{{goodsDetailData.expressCharge}}元</text>
				</u-col>
				<u-col span="5">
					<text>月销量：{{goodsDetailData.monthlySales}}件</text>
				</u-col>
			</u-row>
		</uni-card>
		<uni-card>
			<view class="content">
				<u--text :text="goodsDetailData.desc" size="35"></u--text>
			</view>
		</uni-card>
		<uni-card>
			<!-- 商品其他图片 -->
			<view class="container" v-for="(img, index) in goodsDetailData.imageList" :key="index">
				<image class="img" mode="widthFix" :src="img['url']" :style="{ height: imgHeight + 'px' }"
					@load="onImgLoad" @click="previewImageSingle(img['url'])" />
			</view>
		</uni-card>
		<vk-data-goods-sku-popup ref="skuPopup" v-model="skuKey" border-radius="20" :localdata="goodsInfo"
			:mode="skuMode" @open="onOpenSkuPopup" @close="SkuPopup" @add-cart="addCart" @buy-now="buyNow">
		</vk-data-goods-sku-popup>
		<view class="nav">
			<!-- <view class="uni-tabbar-border"></view> -->
			<u-row justify="space-between" gutter="10" style="margin-top: 10upx;">
				<u-col span="5">
					<u-grid :border="false">
						<u-grid-item @click="customerService()" style="margin-left: 5upx;margin-right: 5upx;">
							<u-icon color="#409EFF" name="kefu-ermai" size="35" open-type="contact"></u-icon>
							<u-text size="35" text="客服" align="center" open-type="contact"></u-text>
						</u-grid-item>
						<u-grid-item @click="collect()" style="margin-left: 5upx;margin-right: 5upx;">
							<!-- 未收藏 -->
							<u-icon v-if="!isCollected" name="heart" size="35"></u-icon>
							<!-- 已收藏 -->
							<u-icon color="#F56C6C" v-if="isCollected" name="heart-fill" size="35"></u-icon>
							<u-text size="35" text="收藏" align="center"></u-text>
						</u-grid-item>
						<u-grid-item style="margin-left: 5upx;margin-right: 5upx;">
							<u-icon color="#409EFF" name="share-square" size="35" open-type="share"></u-icon>
							<u-text size="35" text="分享" align="center" open-type="share"></u-text>
						</u-grid-item>
					</u-grid>
				</u-col>

				<u-col span="6" customStyle="padding-right:5upx;margin:5px 0" getter="4">
					<!-- 立即购买 -->
					<view class="" v-show="!isNoInventory">
						<u-button class="custom-style" type="primary" text="立即购买" color="#e1251b"
							@click="goto(`/pages/business/payOrder/payOrder?goodsID=${this.goodsID}&goodsNum=1`)"></u-button>
					</view>
					<!-- 暂无库存 -->
					<view class="" v-show="isNoInventory">
						<u-button disabled class="custom-style" type="primary" text="暂无库存" color="#909399"
							@click="showToast('很抱歉，该商品暂无库存')"></u-button>
					</view>
				</u-col>
			</u-row>
		</view>
		<u-toast ref=" uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品数据
				goodsDetailData: {
					"title": "加载中",
				},
				// 是否显示无库存按钮
				isNoInventory: false,
				// 收藏icon
				isCollected: false,
				// 遮罩
				overlayShow: false,
				// 遮罩文本
				overlayText: "",
				// 其他图片高度
				imgHeight: 0,

			};
		},
		methods: {
			// 页面跳转
			goto(url) {
				// 判断是否登录，未登录跳转登录页，已登录跳转指定页面
				if (uni.getStorageSync("userID") == "") {
					uni.navigateTo({
						url: "/pages/business/login/login",
					});
					return;
				}else{
					uni.navigateTo({
						url: url,
					});
				}
				
			},
			// 分享给微信好友
			shareFriend() {},
			// 分享到微信朋友圈
			shareFriendQuan() {},
			// 客服
			customerService() {
				// 跳转客服
			},
			// 查询该商品用户是否收藏
			isShowCollected() {
				uniCloud.callFunction({
					name: "getIsCollectStatus",
					data: {
						goodsID: this.goodsID,
						openID: uni.getStorageSync("openID"),
						userID: uni.getStorageSync("userID"),
						isEnable: true,
					},
					success: (res) => {
						console.log(
							`getIsCollectStatus res.result.data:${JSON.stringify(
              res.result.data
            )}`
						);
						if (res.result.data.isCollected == true) {
							this.isCollected = true;
						} else {
							this.isCollected = false;
						}
					},
				});
			},
			// 收藏
			collect() {
				// 显示遮罩
				this.overlayShow = true;
				// 判断当前是否收藏
				if (this.isCollected == false) {
					// 收藏
					uniCloud.callFunction({
						name: "collect",
						data: {
							method: "addCollect",
							openID: uni.getStorageSync("openID"),
							userID: uni.getStorageSync("userID"),
							goodsID: this.goodsID,
							goodsName: this.goodsDetailData.title,
							goodsImage: this.goodsDetailData["image"]["url"],
						},
						success: (res) => {
							console.log(`addCollect userID :${uni.getStorageSync("userID")}`);
							console.log(
								`addCollect res.result.data${JSON.stringify(res.result.data)}`
							);
							this.isCollected = res.result.data.isCollected;
							// 隐藏遮罩
							this.overlayShow = false;
							this.overlayText = "收藏成功";
						},
						fail: (e) => {
							// 隐藏遮罩
							this.overlayShow = false;
							this.overlayText = "收藏失败";
						},
					});
				} else {
					// 取消收藏
					uniCloud.callFunction({
						name: "collect",
						data: {
							method: "deleteCollect",
							openID: uni.getStorageSync("openID"),
							userID: uni.getStorageSync("userID"),
							goodsID: this.goodsID,
						},
						success: (res) => {
							console.log(
								`deleteCollect userID :${uni.getStorageSync("userID")}`
							);
							console.log(
								`deleteCollect res.result.data${JSON.stringify(res.result.data)}`
							);
							this.isCollected = false;
							// 隐藏遮罩
							this.overlayShow = false;
							this.overlayText = "取消收藏";
						},
						fail: (e) => {
							// 隐藏遮罩
							this.overlayShow = false;
							this.overlayText = "取消收藏失败";
						},
					});
				}
			},
			// 商品数据
			getGoodsDetailData() {
				//在当前页面显示导航条加载动画。
				uni.showNavigationBarLoading();
				// 调用云函数，获取列表
				uniCloud
					.callFunction({
						name: "goods",
						data: {
							method: "getGoodsDetail",
							orderGoodsID: this.goodsID, // 商品ID
						},
					}).then((res) => {
						this.loadingText = "";
						console.log(res);
						// 商品信息
						this.goodsDetailData = res.result.data[0];
						// 是否开启无库存
						this.isNoInventory = res.result.data[0].isNoInventory
						console.log("isNoInventory:", this.isNoInventory)
						// 缓存存储商品ID
						uni.setStorageSync("goodsID", this.goodsID),
							// 隐藏loading
							uni.hideNavigationBarLoading();
						// 查询该商品用户是否收藏
						this.isShowCollected();
					}) // success
					.catch((err) => {
						console.log(err);
					}); // fail
			},
			// 预览图片多张
			previewImage(indexImg, photoImg) {
				// let photoList = photoImg.map(item => {
				// 	let newImg = 'data:image/jpeg;base64,' + item
				// 	return newImg;
				// }); //  这一步是为了给每一条图片数据，添加 'data:image/jpeg;base64,'。如果你的图片数据是完整的base64。此条步骤可以省略
				uni.previewImage({
					current: indexImg,
					urls: photoImg,
				});
			},
			// 预览图片单张（普通图片点击事件）
			previewImageSingle(url) {
				uni.previewImage({
					current: 0, // 索引图片
					urls: [url], // 图片地址（数组）
					longPressActions: {
						itemList: ["发送给朋友", "保存图片", "收藏"],
						success: function(data) {
							console.log(
								"选中了第" +
								(data.tapIndex + 1) +
								"个按钮,第" +
								(data.index + 1) +
								"张图片"
							);
						},
						fail: function(err) {
							console.log(err.errMsg);
						},
					},
				});
			},
			onImgLoad(e) {
				// 当图片加载完成后，获取图片的原始宽度和高度，并根据宽度计算出高度
				const {
					width,
					height
				} = e.mp.detail;
				this.imgHeight = (height / width) * 100; // 高度 = 原始高度 / 原始宽度 * 100
			},
			// 显示toast
			showToast(text) {
				this.$refs.uToast.show({
					...text,
					complete() {
						// params.url && uni.navigateTo({
						// 	url: params.url
						// })
					}
				})
			},

		},
		watch: {
			// watch第一次绑定值的时候不会执行监听，修改数据才会触发函数
			isCollected(newVal, oldVal) {
				console.log("isCollected oldVal:", oldVal); // coderkey
				console.log("isCollected newVal:", newVal); // pink
			},
		},
		onLoad(options) {
			// 当前页面
			console.log(`当前页面:goodsDetailData`);
			console.log("options.goodsID:", options.goodsID);
			this.goodsID = options.goodsID;
			// 请求商品详情数据
			this.getGoodsDetailData();
		},
		// uniapp微信小程序分享页面到微信好友
		onShareAppMessage() {
			// TODO	读取缓存分享人ID
			return {
				title: this.goodsDetailData.title,
				path: `/pages/business/goodsDetail/goodsDetail?goodsID=${this.goodsID}`, //分享的页面路径
			};
		},
		// uniapp微信小程序分享页面到微信朋友圈
		onShareTimeline() {
			// TODO	读取缓存分享人ID
			return {
				title: this.goodsDetailData.title,
				path:"/pages/business/goodsDetail",
				query: `goodsID=${this.goodsID}`,
				imageUrl: this.goodsDetailData['image']['url'],
			};
		},
		created() {},
		mounted() {
			this.isCollected = false;
		},
		destroyed() {
			this.isCollected = false;
		},
	};
</script>

<style lang="scss">
	.custom-style {
		color: #ff0000;
		width: 100rpx;
	}

	.originalPrice {
		font-size: 30rpx;
		color: #82848a;
		text-decoration: line-through
	}

	.huaxian {
		font-size: 30rpx;
		color: #82848a;
		text-decoration: line-through
	}

	.nav {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: fixed; // 固定在底部
		bottom: 0rpx; // fixed底部距离
		left: 0;
		right: 0;
		/* #ifdef H5 */
		left: var(--window-left);
		right: var(--window-right);
		/* #endif */
		background-color: #ffffff;
		height: 150rpx; // 调整底栏高度

		// .uni-tabbar-border {
		// 	background-color: rgba(0, 0, 0, 0.33);
		// 	position: absolute;
		// 	left: 0;
		// 	top: 0;
		// 	right: 0;
		// 	height: 50rpx;
		// 	-webkit-transform: scaleY(.5);
		// 	transform: scaleY(.5);
		// }
	}

	.favourPrice {
		margin-left: 5%;
		margin-right: 5%;
		margin-top: 5%;
		margin-buttom: 5%;
		font-size: 50rpx;
		color: red;
	}

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

	.imageList {
		width: 100%;
		height: auto;
	}

	.share {
		color: green;
		margin-left: 2%;
		margin-right: 2%;
		margin-top: 2%;
		margin-buttom: 2%;
	}

	.container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.img {
		width: 100%;
	}
</style>