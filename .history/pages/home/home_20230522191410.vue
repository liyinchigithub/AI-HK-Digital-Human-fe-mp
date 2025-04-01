<template>
	<view>
		<!-- 滚动通知 -->
		<view class="" v-show="noticeBarShow">
			<u-notice-bar mode="closable" :text="noticeText" speed="100" fontSize="30"></u-notice-bar>
		</view>
		<!-- 搜索 -->
		<view class="">
			<uni-card :is-shadow="true" is-full>
				<u-search placeholder="搜索" :borderColor="white" shape="round" searchIconSize="50" :showAction="false"
					height="70" @focus="goto('/pages/business/search/search')"></u-search>
			</uni-card>
		</view>
		<!-- 轮播图 TODO 跳转商品详情-->
		<view class="">
			<u-swiper :list="bannerList" @click="bannerClick()" keyName="image" showTitle :autoplay="true" circular
				height="300" duration="1000" indicatorMode="line"></u-swiper>
		</view>
		<!-- 金刚区-品牌 -->
		<view class="">
			<uni-card :is-shadow="true" is-full>
				<zjc-scroll-nav :platformList="brandList"></zjc-scroll-nav>
			</uni-card>
		</view>
		<!-- 拼图 todo -->

		<!-- 金刚区-分类 -->
		<!-- <view>
			<u-grid :border="true" col="3" align="center">
				<u-grid-item v-for="(listItem,listIndex) in diamondRegionList" :key="listIndex" bgColor="#ffffff"
					@click="goto(listItem.url)">
					<view class="grid-item">
						<u--image :showLoading="true" :src="listItem.image" width="70rpx" height="70rpx"></u--image>
						<text class="grid-text">{{listItem.title}}</text>
					</view>
				</u-grid-item>
			</u-grid>
		</view> -->
		<!-- 标签-列表 -->
		<u-sticky bgColor="#fff">
			<!-- 我要入驻 -->
			<uni-card :is-shadow="true" is-full @click="goto('/pages/business/settleIn/settleIn')">
				<view style="color: #ff9900;font-size: 35rpx;height: 55rpx;"> 申请入驻（商家、个人）</view>
			</uni-card>
			<!-- 列表-标签 -->
			<uni-card :is-shadow="true" is-full>
				<u-tabs @click="tabClick" @change="tabChange" :list="tabList" lineWidth="30" lineColor="#f56c6c"
					:activeStyle="{
				            color: '#303133',
				            fontWeight: 'bold',
				            transform: 'scale(1.05)'
				        }" :inactiveStyle="{
				            color: '#606266',
				            transform: 'scale(1)'
				        }" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"></u-tabs>
			</uni-card>
		</u-sticky>
		<!-- 列表-标签内容 -->
		<view class="" v-for="(item,index) in listData" :key="index">
			<uni-card :title="item.classTypeName" :extra="item.createDate"
				@click="goto(`/pages/business/homeCardDetail/homeCardDetail?id=${item._id}`)">
				<u-row justify="space-between" gutter="13">
					<u-col span="3">
						<view style="margin-left: 5rpx;margin-right: 3rpx;margin-top: 30rpx;margin-bottom: 50rpx">
							<u--image src="https://cdn.uviewui.com/uview/album/1.jpg" shape="circle" width="110"
								height="110"></u--image>
						</view>
					</u-col>
					<u-col span="8">
						<view class="card_title">
							<!-- 文本超出隐藏 -->
							<u--text :lines="2" size="30" :text="item.title">
							</u--text>
						</view>
					</u-col>
					<u-col span="5">
						<!-- 空 -->
					</u-col>
				</u-row>
				<u-row justify="space-between" gutter="13">
					<u-col span="13">
						<view style="margin-left: 20rpx;margin-right: 20rpx;margin-top: 20rpx;margin-bottom: 20rpx;">
							<!-- 	<u-read-more>
								<rich-text :nodes="item.content" showHeight="100" :toggle="true" @load="load"></rich-text>
							</u-read-more> -->
							<u-read-more ref="uReadMore" :toggle="true" :showHeight="50" :fontSize="30">
								<u-parse :content="item.content" @load="load"></u-parse>
							</u-read-more>
						</view>
					</u-col>
				</u-row>
				<u-row justify="space-between" gutter="13">
					<u-col span="3">
					</u-col>
					<u-col span="3">
					</u-col>
					<u-col span="4">
					</u-col>
				</u-row>
				<u-row justify="space-between" gutter="15">
					<u-col span="3">
						<u--image :showLoading="true" :src="src" width="80px" height="80px"
							@click="previewImageSingle(src)"></u--image>
					</u-col>
					<u-col span="5">
					</u-col>
					<u-col span="3">
						<view>
							<u-button style="" :plain="true" shape="circle" type="primary" text="立即抢单">
							</u-button>
						</view>
					</u-col>
					<u-col span="3">

					</u-col>
				</u-row>
			</uni-card>

		</view>
		<!-- 上拉加载更多 -->
		<view class="loading">{{loadingText}}</view>
		<!-- 返回顶部 -->
		<view class="wrap">
			<u-back-top :scroll-top="scrollTop" :mode="mode" :icon-style="iconStyle"></u-back-top>
		</view>
		<!-- 悬浮球 -->
		<moFabToRelease :defaultPost="right" :defaultY="200" :type="type" :defer="false" />

		<!-- 客服弹窗 -->
		<u-popup closeable border-radius="20" v-model="customerPopupShow"  mode="center"   width="550rpx"
			 height="800rpx">
			<view style="text-align: center;margin-top:10%;margin-bottom: 10%;margin-left: 40%;margin-right: 40%;">
				<span>客服</span>
			</view>
			<view style="align-content: center;">
				<u-row  justify="center">
					<u-col>
						<u-image width="100%" height="500rpx" :src="wexinQRcode"></u-image>
					</u-col>
					<view style="text-align: center;color:black;">
						长按二维码，添加客服微信
					</view>
				</u-row>
				<u-row>
					<view style="margin-top: 5%;">
						<button type="primary" @click="callPhone">电话联系客服</button>
					</view>
				</u-row>
			</view>
		</u-popup>
	</view>
	</view>

</template>
var _self, page = 1, timer = null;
<script>
	import moFabToRelease from "@/uni_modules/mo-fab/mo-fab/components/mo-fab/mo-fab-to-release.vue";
	export default {
		name: "index",
		data() {
			return {
				// 轮播图参数
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				// 轮播图
				bannerList: [{
					image: "https://cdn.uviewui.com/uview/swiper/swiper2.png",
					title: "加载中",
					toGoodsID: "",
					toUrl: "",
					isToUrl: false,
					status: true
				}, ],
				// 轮播图预览
				imagePreviewList: [],
				// 金刚区-品牌
				brandList: [{
					image: "",
					title: "",
					url: "",
				}, ],
				// 金刚区-分类
				diamondRegionList: [{
						image: "",
						title: "",
						url: "",
					},
					{
						image: "",
						title: "",
						url: "",
					},
					{
						image: "",
						title: "",
						url: "",
					},
				],
				// 滚动通知
				noticeText: [],
				// tab分类
				tabList: [],
				//
				src: "https://cdn.uviewui.com/uview/album/1.jpg",
				// 分享海报
				poster: {
					title: "aaaa",
					sub_title: "bbbb",
					price: "10",
					image: [
						"http://5b0988e595225.cdn.sohucs.com/images/20190812/cf02e53ea95e4248a4a198814f7534e4.jpeg",
					],
				},
				// 客服弹窗
				customerPopupShow: false,
				wexinQRcode: "", // 客服二维码地址
				address: "", // 地图导航到门店的地址-云函数查数据库取值
				beginTime: "", // 开始营业时间-云函数查数据库取值
				endTime: "", // 结束营业时间-云函数查数据库取值
				businessHours: "", // 开始、结束营业时间-由beginTime和endTime拼接
				customerPhone: "", // 客服电话-云函数查数据库取值
				latitude: 0, // 纬度，范围为-90~90，负数表示南纬，使用 gcj02 国测局坐标系
				longitude: 0, // 经度，范围为-180~180，负数表示西经，使用 gcj02 国测局坐标系
				// 返回顶部
				scrollTop: 0,
				mode: "square",
				iconStyle: {
					fontSize: "32rpx",
					color: "#409EFF",
				},
				// tab列表分页
				pageNum: 1,
				pageSize: 4,
				total: 0,
				loadingText: "加载中...", // 当前状态
				index: "",
				// 列表卡片
				listData: [],
				noticeBarShow: false, //   通知栏是否显示
			};
		},
		methods: {
			// 更多
			load() {
				// this.$refs.uReadMore.init();
			},
			// 页面跳转
			goto(url) {
				uni.navigateTo({
					url: url,
				});
			},
			// 轮播图-点击事件
			bannerClick(index) {
				console.log(`轮播图当前点击图片${index}`);
				// 判断是跳商品还是自定义链接
				if (this.bannerList[index].isToUrl) {
					// 跳转自定义链接
					// 判断是否包含https，包含则直接跳转，不包含则拼接
					if (this.bannerList[index].toUrl.indexOf("https") != -1) {
						uni.navigateTo({
							url: this.bannerList[index].toUrl,
						});
					} else {
						uni.navigateTo({
							url: `/pages/business/webView/webView?url=${this.bannerList[index].toUrl}`,
						});
					}

				} else {
					// 跳转商品详情
					uni.navigateTo({
						url: `/pages/business/goodsDetail/goodsDetail?id=${this.bannerList[index].toGoodsID}`,
					});
				}
			},
			// 金刚区-点击事件-索引
			clickItem(index) {
				console.log(`banner index:${index}`);
			},
			// 获取手机号码
			decryptPhoneNumber(e) {
				console.log(e);
				console.log(JSON.stringify(e.detail.encryptedData));
				console.log(JSON.stringify(e.detail.iv));
			},
			// 打开map地图
			openMap() {
				let that = this;
				// 获取当前的地理位置、速度
				// uni.getLocation({
				//     type: 'wgs84',
				//     success: function (res) {
				//         console.log('当前位置的经度：' + res.longitude);
				//         console.log('当前位置的纬度：' + res.latitude);
				//     }
				// });

				// 打开地图选择位置
				// uni.chooseLocation({
				//     success: function (res) {
				//         console.log('位置名称：' + res.name);
				//         console.log('详细地址：' + res.address);
				//         console.log('纬度：' + res.latitude);
				//         console.log('经度：' + res.longitude);
				//     }
				// });

				// var map = uni.createMapContext('map');
				// map.moveToLocation();

				// 使用应用内置地图查看位置
				uni.getLocation({
					type: "gcj02", //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						const latitude = res.latitude;
						const longitude = res.longitude;
						console.log(
							`res.latitude:${res.latitude} res.longitude：${res.longitude}`
						);
						uni.openLocation({
							// 自定义门店经纬度（经纬度获取工具 https://jingweidu.bmcx.com/）
							scale: 18, // 缩放比例，范围5~18，默认为18
							name: "智慧生活", // 位置名
							address: that.address,
							latitude: Number(that.latitude), // 纬度，范围为-90~90，负数表示南纬，使用 gcj02 国测局坐标系
							longitude: Number(that.longitude), // 经度，范围为-180~180，负数表示西经，使用 gcj02 国测局坐标系
							success: function() {
								console.log("success");
							},
						});
					},
				});
			},
			//分享海报
			sharePoster() {
				//获取带参数二维码
				this.is_show_model = false;
				this.$refs.poster.showCanvas("https://oss.zhangyubk.com/cmqrcode.jpg");
			},
			// 拨打电话
			openPhone() {
				var that = this;
				// 弹窗显示二维码和电话
				that.customerPopupShow = true;
			},
			// 拨打电话
			callPhone() {
				var that = this;
				// 请求云函数获取号码
				uni.makePhoneCall({
					// 手机号
					phoneNumber: that.customerPhone,
					// 成功回调
					success: (res) => {
						console.log("调用成功!");
					},

					// 失败回调
					fail: (res) => {
						console.log("调用失败!手机号码：", that.customerPhone);
					},
				});
			},

			// 返回顶部
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			// 轮播图-点击事件
			viewSwiperImage(index) {
				// 初始化
				this.imagePreviewList = [];
				console.log(`轮播图当前点击图片${index}`);
				// 改造bannerList用于预览图片传入imagePreviewList（只有图片地址的数组）
				for (var elm of this.bannerList) {
					console.log("elm.image", elm.image);
					this.imagePreviewList.push(elm.image);
				}
				console.log(JSON.stringify(this.imagePreviewList));
				// 调用图片预览API
				this.$options.methods.previewImage(index, this.imagePreviewList);
			},
			// 预览图片-多张
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
			// 预览图片-单张（普通图片点击事件）
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
			// 首页轮播图数据
			getHomeBanner() {
				uniCloud
					.callFunction({
						name: "getHomeBanner",
					})
					.then((res) => {
						this.bannerList = res.result.data;
						console.log("bannerList:", res.result.data);
					});
			},
			//  图片自适应
			imageLoad(e) {
				var $width = e.detail.width, //获取图片真实宽高
					$height = e.detail.height,
					ratio = $width / $height; //图片的真实宽高比例
				var viewHeight = 250, //设置图片显示高度
					viewWidth = 250 * ratio; //计算的宽度值

				const query1 = uni.createSelectorQuery().in(this);
				query1
					.select(".question-title")
					.boundingClientRect((data) => {
						// 获取图片区域的宽度
						console.log(data);
						if (viewWidth > data.width) {
							// 如果计算出来的图片宽度大于图片区域的宽度，则重新计算
							viewWidth = data.width; //固定图片宽度为区域宽度
							viewHeight = viewWidth / ratio; // 根据比例计算高度
						}
						var image = this.images;
						image = {
							width: viewWidth,
							height: viewHeight,
						};
						console.log(image);
						this.images = image;
					})
					.exec();
			},
			// 分类数据
			getClassTypeData() {
				uniCloud.callFunction({
					name: "getClassType",
					data: {
						isEnable: true,
					},
					success: (res) => {
						console.log("getClassType res.result.data", res.result.data);
						// this.tabList = res.result.data;
						this.tabList.push(res.result.data[0]);
					},
				});
			},
			// 发布信息数据
			getReleaseInfoData(index) {
				this.pageNum = 1;
				// 显示loading
				// uni.showNavigationBarLoading();
				// 重写this为that
				var that = this;
				// 请求云函数-获取对应tab数据
				uniCloud.callFunction({
					name: "getReleaseInfo",
					data: {
						classType: index.id,
						pageNum: that.pageNum,
						pageSize: that.pageSize,
						// "adCode": "10000",
						isEnable: true,
					},
					success: (res) => {
						console.log("getReleaseInfo res.result.data:", res.result.data);
						that.listData = res.result.data;
						// 关键，决定是否进行加载数据
						that.loadingText = "加载更多";
					},
				});
			},
			// tabList 点击事件
			tabClick(index) {
				this.listData = 0;
				this.index = index;
				console.log("tab click", index);
				this.getReleaseInfoData(index);
			},
			// tabList 点击切换事件
			tabChange(index) {
				// 初始化
				this.pageNum = 1;
				this.pageSize = 4;
				this.total = 0;
				console.log("tab change", index);
			},
			// 加载更多
			getMoreNews() {
				var that = this;
				// 判断当前是否数据可加载TODO
				if (this.loadingText != "" && this.loadingText != "加载更多") {
					this.loadingText = "到底啦~";
					return false;
				}
				this.loadingText = "加载中...";
				// 页面加载
				this.pageNum++;
				// 调用云函数，获取列表
				uniCloud
					.callFunction({
						name: "getReleaseInfo",
						data: {
							classType: that.index.id,
							pageNum: that.pageNum,
							pageSize: that.pageSize,
							// "adCode": "10000",
							isEnable: true,
						},
					})
					.then((res) => {
						this.loadingText = "";
						console.log(res);
						// 新旧数据拼接
						this.listData = this.listData.concat(res.result.data);
						this.loadingText = "加载更多";
						// 判断是否加载完毕
						if (res.result.data.length == 0) {
							//在当前页面隐藏导航条加载动画。
							uni.hideNavigationBarLoading();
							this.loadingText = "已加载全部";
							return false;
						}
						// 隐藏loading
						uni.hideNavigationBarLoading();
					}) // success
					.catch((err) => {
						console.log(err);
					}); // fail
			},
			// 金刚区-品牌
			getBrand() {
				var that = this;
				uniCloud.callFunction({
					name: "getBrand",
					data: {},
					success: (res) => {
						console.log("getBrand res.result.data:", res.result.data);
						// 地址
						that.brandList = res.result.data;
					},
				});
			},
			// 金刚区-分类
			getDiamondRegion() {
				var that = this;
				uniCloud.callFunction({
					name: "getDiamondRegion",
					data: {},
					success: (res) => {
						console.log("getDiamondRegion res.result.data:", res.result.data);
						// 地址
						that.diamondRegionList = res.result.data;
					},
				});
			},
			// 基础数据
			getBasicInforMation() {
				var that = this;
				uniCloud.callFunction({
					name: "getBasicInformation",
					data: {
						// "spaceID": uni.getSystemInfo("spaceID") // 注意：这边不使用同步sync
					},
					success: (res) => {
						console.log("res.result.data[0]:", res.result.data[0]);
						// 地址
						that.address = res.result.data[0].address;
						console.log("address", res.result.data[0].address);
						// 开始营业时间
						that.beginTime = res.result.data[0].beginTime;
						console.log("beginTime", res.result.data[0].beginTime);
						// 结束营业时间
						that.endTime = res.result.data[0].endTime;
						console.log("endTime", res.result.data[0].endTime);
						that.businessHours = `${that.beginTime}-${that.endTime}`;
						// 门店客服二维码
						that.wexinQRcode = res.result.data[0].wexinQRcode.url;
						console.log("wexinQRcode", res.result.data[0].wexinQRcode);
						// 门店客服电话
						that.customerPhone = res.result.data[0].customerPhone;
						console.log("customerPhone", res.result.data[0].customerPhone);
						// 门店地图导航-纬度
						that.latitude = res.result.data[0].latitude;
						console.log("latitude", res.result.data[0].latitude);
						// 门店地图导航-经度
						that.longitude = res.result.data[0].longitude;
						console.log("longitude", res.result.data[0].longitude);

						console.log("getBasicInformation：", res.result.data);
					},
				});
			},
			// 首页顶部公告消息
			getNoticeBar() {
				var that = this;
				uniCloud.callFunction({
					name: "getNoticeBar",
					data: {
						isEnable: true, // 注意：这边不使用同步sync
					},
					success: (res) => {
						console.log("res.result.data", res.result.data);
						// 格式化数据只去title放入数组中
						for (var elm of res.result.data) {
							console.log("elm.title", elm.title);
							that.noticeText.push(elm.title);
						}
						// 类数组转成数组
						that.noticeText = JSON.parse(JSON.stringify(that.noticeText));
						console.log(
							"that.noticeText:",
							JSON.parse(JSON.stringify(that.noticeText))
						);

						// 判断是否有通知内容
						if (this.noticeText.length > 0) {
							this.noticeBarShow = true;
						} else {
							this.noticeBarShow = false;
						}
					},
				});
			},
		},
		//添加控件依赖
		components: {
			moFabToRelease, // 发布
		},
		//
		created() {
			// 当前页面
			console.log(`当前页面:home`);
			// 请求云函数-服务分类数据
			this.getClassTypeData();
			// 请求首页轮播图；
			this.getHomeBanner();
			// 请求金刚区-分类
			this.getDiamondRegion();
			// 请求金刚区-品牌
			this.getBrand()
			// 请求基础信息
			this.getBasicInformation();
			// 默认tab初始化数据
			this.tabClick(0);
			//
		},
		// onPullDownRefresh() {
		// 	// 初始化list
		// 	// this.listData = []
		// 	this.getReleaseInfoData(0)
		// },
		//页面滚动到底部的事件
		onReachBottom() {
			this.getMoreNews();
		},
		onLoad() {
			// 请求tab列表数据
			this.getReleaseInfoData(0);
			// 请求首页公告
			this.getNoticeBar();
		},
		// 分享微信好友
		onShareAppMessage() {
			// TODO	读取缓存分享人ID
			return {
				title: "智慧生活",
				path: "/pages/home/home", //分享的页面路径
			};
		},
		// 分享微信朋友圈
		onShareTimeline() {
			// TODO	读取缓存分享人ID
			return {
				title: "智慧生活",
				// query: 'name=1&age=2',
				imageUrl: "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/498fe04a-ba2f-46a1-81e4-fb2b6436bfca.jpeg",
			};
		},
	};
</script>

<style>
	.card_title {
		font-size: 30rpx;
	}

	.custom-style {
		color: #606266;
		width: 400rpx;
	}

	.uni-margin-wrap {
		width: 690rpx;
		width: 100%;
	}

	.swiper {
		height: 300rpx;
	}

	.swiper-item {
		display: block;
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
	}

	.swiper-list {
		margin-top: 40rpx;
		margin-bottom: 0;
	}

	.uni-common-mt {
		margin-top: 60rpx;
		position: relative;
	}

	.info {
		position: absolute;
		right: 20rpx;
	}

	.uni-padding-wrap {
		width: 550rpx;
		padding: 0 100rpx;
	}

	.index-top-buttom {
		text-align: center;
		margin-top: 10upx;
		margin-bottom: 10upx;
	}

	.title {
		display: flex;
		flex-direction: column;
		margin-left: 0rpx;
		margin-top: 50rpx;
	}

	.u-content {
		margin-left: 50rpx;
		margin-right: 50rpx;
		margin-top: 10rpx;
		text-align: left;
	}

	.wrap {
		padding: 40rpx;
	}

	page {
		background-color: #f0eefc;
		/* padding-bottom: 30upx; */
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

	/* .content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	} */

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
		color: #8f8f94;
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

	.grid-img {
		/* margin-left: 5rpx; */
	}

	.grid-text {
		font-size: 14px;
		color: #909399;
		text-align: center;
		padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}

	.grid-item {
		text-align: center;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}
</style>