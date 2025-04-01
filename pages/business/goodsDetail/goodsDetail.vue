<template>
  <view>
    <view class="image-container">
      <image :src="goodsDetailData.image.url" class="main-image"></image>
    </view>
    <view class="info">
      <text class="title">{{ goodsDetailData.title }}</text>
      <view class="price-time">
        <u-row justify="space-between">
          <u-col span="7">
            <text class="favourPrice">{{ goodsDetailData.favourPrice }}元</text>
            <!-- <text class="originalPrice">{{ goodsDetailData.originalPrice }}元</text> -->
          </u-col>
          <u-col span="5" offset="1">
            <text class="time">{{ goodsDetailData.serviceDuration }}分钟</text>
          </u-col>
          <u-col span="6" offset="2">
            <text class="selection">{{ goodsDetailData.salesVolume }}人选择</text>
          </u-col>
        </u-row>
      </view>
    </view>
    <view class="tabs">
      <text @click="scrollTo('introduction')">项目介绍</text>
      <text @click="scrollTo('orderInfo')">下单须知</text>
    </view>
    <view ref="introduction" class="section">
      <!-- <view class="project-title">项目介绍:</view> -->
      <image :src="goodsDetailData.imageList[0].url" mode="widthFix" class="project-introduction"></image>
    </view>
    <view ref="orderInfo" class="section">
      <view class="order-info-container">
        <view class="order-instructions">下单须知:</view>
        <text>{{ goodsDetailData.OrderInstructions }}</text>
      </view>
    </view>
    <button class="select-button" @click="goto('/pages/business/worker/worker?goodsID=' + this.goodsID)" >选择理疗师</button>
    <!-- 跳转师傅页，并路由传参goodsID -->
    <!-- <u-button class="select-button" color="#00bcd4" @click="goto('/pages/business/worker/worker?goodsID=' + this.goodsID)" type="primary" shape="circle" text="选择理疗师"></u-button> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentSection: '', // 当前滚动到的部分
      // 商品数据
      goodsDetailData: {
        title: 'loading...',
        favourPrice: 'loading...',
        originalPrice: 'loading...',
        image: {
          url: 'loading...',
        },
        serviceDuration: 'loading...',
        salesVolume: 'loading...',
      },

    };
  },
  scrollTo(section) {
    this.$nextTick(() => {
      const element = this.$refs[section];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.error(`Element with ref ${section} not found.`);
      }
    });
  },
  methods: {
    // 页面滚动
    scrollTo(section) {
      this.$nextTick(() => {
        const element = this.$refs[section];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.error(`Element with ref ${section} not found.`);
        }
      });
    },
    // 页面跳转
    goto(url) {

      // 判断是否登录，未登录跳转登录页，已登录跳转指定页面
      // if (
      //   uni.getStorageSync("openID") == "" ||
      //   uni.getStorageSync("openID") == undefined ||
      //   uni.getStorageSync("userID") == "" ||
      //   uni.getStorageSync("userID") == undefined
      // ) {
      //   // 自有登录页
      //   uni.navigateTo({
      //     url: "/pages/business/login/login",
      //   });
      //   // // 统一登录页
      //   // uni.navigateTo({
      //   //   url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=weixin",
      //   // });
      //   return;
      // } else {
      //   uni.navigateTo({
      //     url: url,
      //   });
      // }
    },
    // 分享给微信好友
    shareFriend() { },
    // 分享到微信朋友圈
    shareFriendQuan() { },
    // 客服
    customerService() {
      // 跳转客服
    },
    // 商品该数据
    getGoodsDetailData(goodsID) {
      var that = this;
      // 调用云函数，获取列表
      uniCloud
        .callFunction({
          name: "goods",
          data: {
            methods: "getGoodsDetail",
            orderGoodsID: goodsID, // 商品ID
          },
        })
        .then((res) => {
          console.log("getGoodsDetail res", res);
          // 判断
          if (res.result && res.result.data && res.result.data[0]) {
            that.goodsDetailData = res.result.data[0];
            console.log("this.goodsDetailData", that.goodsDetailData);
            that.title = that.goodsDetailData["title"];
            console.log("that.title", that.title);
            that.favourPrice = that.goodsDetailData["favourPrice"];
            console.log("that.favourPrice", that.favourPrice);
            that.image = that.goodsDetailData.imageList[0]["url"];
            that.originalPrice = that.goodsDetailData["originalPrice"];
            console.log("that.image", that.image);
            that.serviceDuration = that.goodsDetailData["serviceDuration"];
            console.log("that.serviceDuration", that.serviceDuration);
            that.salesVolume = that.goodsDetailData["salesVolume"];
            console.log("that.salesVolume", that.salesVolume);

          } else {
            console.error("Data format error:", res);
          }
          // 缓存存储商品ID
          uni.setStorageSync("goodsID", that.goodsID),
            // 隐藏loading
            uni.hideNavigationBarLoading();
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
          success: function (data) {
            console.log(
              "选中了第" +
              (data.tapIndex + 1) +
              "个按钮,第" +
              (data.index + 1) +
              "张图片"
            );
          },
          fail: function (err) {
            console.log(err.errMsg);
          },
        },
      });
    },
    onImgLoad(e) {
      // 当图片加载完成后，获取图片的原始宽度和高度，并根据宽度计算出高度
      const { width, height } = e.mp.detail;
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
        },
      });
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
    this.getGoodsDetailData(options.goodsID);

    //  获取url路由参数
    var launchOptions = uni.getLaunchOptionsSync();
    console.log("goodsDetail onLoad launchOptions", launchOptions.query);
    // 存储分享者微信openID
    uni.setStorageSync("sharerInfo", launchOptions.query);
    // 获取URL中的参数
    let query = launchOptions.query;
    // 判断是否有分享ID
    if (query.sharerOpenID == undefined || query.sharerOpenID == "") {
      // 没有分享ID
      console.log("没有分享ID");
    } else {
      this.sharerOpenID = query.sharerOpenID;
      this.shareGoodsID = query.goodsID;
      console.log("sharerOpenID:", this.sharerOpenID);
      console.log("shareGoodsID", this.shareGoodsID);
    }
  },
  // uniapp微信小程序分享页面到微信好友
  onShareAppMessage() {
    // TODO	读取缓存分享人ID
    return {
      title: this.goodsDetailData.title,
      path: `/pages/business/goodsDetail/goodsDetail?goodsID=${this.goodsID
        }&sharerOpenID=${uni.getStorageSync("openID")}`, //分享的页面路径
    };
  },
  // uniapp微信小程序分享页面到微信朋友圈
  onShareTimeline() {
    // TODO	读取缓存分享人ID
    return {
      title: this.goodsDetailData.title,
      path: "/pages/business/goodsDetail",
      query: `goodsID=${this.goodsID}&sharerOpenID=${uni.getStorageSync(
        "openID"
      )}`,
      imageUrl: this.goodsDetailData["image"]["url"],
    };
  },
  created() { },
  mounted() {
    this.isCollected = false;
    // 测试 ref 是否存在
    console.log("this.$refs.introduction",this.$refs.introduction); // 应该输出 DOM 元素
    console.log("this.$refs.orderInfo",this.$refs.orderInfo); // 应该输出 DOM 元素
    this.$nextTick(() => {
    this.scrollTo('orderInfo');
  });
  },
  destroyed() {
    this.isCollected = false;
  },
};
</script>

<style lang="scss">
.header {
  text-align: center;
  font-size: 18px;
  padding: 10px;
  background-color: #fff;
}

.image-container {
  padding: 10px;
}

.main-image {
  width: 100%;
  border-radius: 1px;
}

.project-introduction {
  width: 100%;
  height: auto;
  object-fit: contain; /* 或者使用 cover，根据需要调整 */
}

.info {
  padding: 10px;
  background-color: #fff;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.price-time {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
  margin-bottom: 10rpx;
  margin-left: 10rpx;
}

.originalPrice {
  color: #837f7e;
  font-size: 35rpx;
  margin-top: 10rpx;
  margin-left: 20rpx;
  text-decoration: line-through; /* 添加删除线 */
}
.favourPrice {
  color: #ff5722;
  font-size: 50rpx;
  margin-top: 10rpx;
}

.time,
.selection {
  font-size: 14px;
  color: #999;
}

.tabs {
  display: flex;
  justify-content: space-around;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
}

.section {
  width: 100%;
  overflow: hidden; /* 确保没有滚动条 */
}

.select-button {
  position: fixed;
  padding: -10px;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  background-color: #71d5a1;
  color: white;
  text-align: center;
  font-size: 40rpx;
  border-radius: 100rpx;
  z-index: 100;
}

.order-instructions {
  font-size: 35rpx;
  margin-bottom: 10rpx;
  font-weight: bold;

}

.project-title {
  font-size: 35rpx;
  margin-bottom: 10rpx;
  margin-left: 30rpx;
  font-weight: bold;

}


.order-info-container {
  padding: 10px;
  background-color: #f7f7f7;
  border-radius: 10px;
  margin-bottom: 150rpx;
}

.order-info-container text {
  font-size: 14px;
  color: #424242;
}
</style>
