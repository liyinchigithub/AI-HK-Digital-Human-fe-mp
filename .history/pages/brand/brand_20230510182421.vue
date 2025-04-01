<template>
  <!-- 配件 -->
  <view>
    <!-- 搜索 -->
    <view class="">
      <u-search
        inputAlign="center"
        v-model="searchVal"
        height="90"
        borderColor="#C0C4CC"
        searchIconColor="#409EFF"
        bgColor="#FFFFFF"
        :searchIconSize="50"
        shape="square"
        :clearabled="true"
        :showAction="true"
        actionText="搜索"
        :animation="true"
        @custom="search()"
        @clear="clear()"
        @search="search()"
      ></u-search>
    </view>
    <!-- 空数据 -->
    <view class="" v-show="isEmpty">
      <u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/car.png">
      </u-empty>
    </view>
    <!-- 列表内容 -->
    <view class="content">
      <view class="uni-product-list">
        <view
          class="uni-product"
          v-for="(product, index) in productList"
          :key="index"
        >
          <view
            class=""
            @click="
              goto(`/pages/goodsDetail/goodsDetail?goodsID=${product._id}`)
            "
          >
            <view class="image-view">
              <image
                class="uni-product-image"
                :src="product['image']['url']"
              ></image>
            </view>
            <view class="uni-product-title">{{ product.title }}</view>
            <!-- 标签 -->
            <!-- <view class="">
							<u-row customStyle="margin-top: 10rpx;margin-bottom: 10rpx">
								<text class="uni-product-tip">{{ product.tip }}</text>
							</u-row>
						</view> -->
            <view class="uni-product-price">
              <u-row customStyle="margin-top: 20rpx;margin-bottom: 10rpx">
                <u-col span="6">
                  <!-- 原价 -->
                  <text class="uni-product-price-favour"
                    >￥{{ product.originalPrice }}</text
                  >
                </u-col>
                <u-col span="6">
                  <!-- 现价（优惠价） -->
                  <text class="uni-product-price-original"
                    >￥{{ product.favourPrice }}</text
                  >
                </u-col>
              </u-row>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 上拉加载更多 -->
    <view class="loading">{{ loadingText }}</view>
    <!-- 返回顶部 -->
    <view class="wrap">
      <u-back-top
        :scroll-top="scrollTop"
        :mode="mode"
        :icon-style="iconStyle"
      ></u-back-top>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isEmpty: false, // 是否显示“空数据”
      brandID: "", // 品牌ID
      searchVal: "", // 搜索
      product: {},
      //
      title: "product-list",
      productList: [],
      renderImage: false,
      // 返回顶部
      scrollTop: 0,
      mode: "square",
      iconStyle: {
        fontSize: "32rpx",
        color: "#409EFF",
      },
      // tab列表分页
      pageNum: 1,
      pageSize: 6,
      total: 0,
      loadingText: "加载中...", // 当前状态
      index: "",
    };
  },
  methods: {
    // 搜索
    search(val) {
      var that = this;
      console.log(val);
      //
      uniCloud.callFunction({
        name: "goods",
        data: {
          method: "getGoodsSearch",
          isEnable: true,
          brandID: that.brandID,
          title: that.searchVal,
          pageNum: that.pageNum,
          pageSize: that.pageSize,
        },
        success: (res) => {
          that.productList = res.result.data;
          console.log("that.productList:", that.productList);
          // 是否空数据
          if (that.productList.length == 0) {
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
    // 搜索-清除
    clear() {
      this.searchVal = "";
    },
    // 页面跳转
    goto(url) {
      uni.navigateTo({
        url: url,
      });
    },
    getProductList(brandID) {
      this.pageNum = 1;
      // 显示loading
      uni.showNavigationBarLoading();
      // 重写this为that
      var that = this;
      // 请求云函数-获取分类第2个数据，即约定第2个分类是家政
      uniCloud.callFunction({
        name: "goods",
        data: {
          method: "getBrandGoods",
          brandID: brandID,
          isEnable: true,
          pageNum: that.pageNum,
          pageSize: that.pageSize,
        },
        success: (res) => {
          that.productList = res.result.data;
          console.log("that.productList:", that.productList);
          // 是否空数据
          if (that.productList.length == 0) {
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
    getMoreNews() {
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
          name: "goods",
          data: {
            method: "getBrandGoods",
            brandID: that.brandID,
            isEnable: true,
            pageNum: that.pageNum,
            pageSize: that.pageSize,
          },
        })
        .then((res) => {
          that.loadingText = "";
          console.log(res);
          // 新旧数据拼接
          that.productList = that.productList.concat(res.result.data);

          that.loadingText = "加载更多";
          // 判断是否加载完毕
          if (res.result.data.length == 0) {
            // 是否空数据
            if (that.productList.length == 0) {
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
  //页面滚动到底部的事件
  onReachBottom() {
    this.getMoreNews();
  },
  onLoad(options) {
    this.getProductList(options.brandID);
    this.brandID = options.brandID;
  },
  // onPullDownRefresh() {
  //     this.getProductList()
  // },
  // 分享微信好友
  onShareAppMessage() {
    // TODO	读取缓存分享人ID
    return {
      title: "智慧生活",
      path: `/pages/goods/goods`, //分享的页面路径
    };
  },
  // 分享微信朋友圈
  onShareTimeline() {
    // TODO	读取缓存分享人ID
    return {
      title: "智慧生活",
      // query: 'name=1&age=2',
      imageUrl:
        "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/498fe04a-ba2f-46a1-81e4-fb2b6436bfca.jpeg",
    };
  },
};
</script>

<style>
/* 搜索 */

/* 列表内容 */
content {
  margin-top: 20rpx;
}

/* product */
page {
  background: #ffffff;
}

view {
  font-size: 28upx;
}

.uni-product-list {
  /* border: 2px solid #303133; */
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
}

.uni-product {
  /* border: 2px solid #c0c4cc; */
  margin-left: 10rpx;
  margin-right: 5rpx;
  margin-top: 5rpx;
  margin-bottom: 5rpx;
  padding: 10upx;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.image-view {
  height: 330upx;
  width: 330upx;
  margin: 12upx 0;
}

.uni-product-image {
  height: 330upx;
  width: 330upx;
}

.uni-product-title {
  width: 300upx;
  word-break: break-all;
  display: -webkit-box;
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.uni-product-price {
  margin-top: 10upx;
  font-size: 28upx;
  line-height: 1.5;
  position: relative;
}

.uni-product-price-original {
  color: #e80080;
}

.uni-product-price-favour {
  color: #888888;
  text-decoration: line-through;
  margin-left: 10upx;
}

.uni-product-tip {
  position: absolute;
  right: 10upx;
  background-color: #ff3333;
  color: #ffffff;
  padding: 0 10upx;
  border-radius: 5upx;
}

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

s .card-item {
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
</style>