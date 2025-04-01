<template>
  <!-- 师傅详情页 -->
  <view>
    <view>
      <!-- 遮罩 -->
      <u-overlay :show="overlayShow" @click="overlayShow = false">
        <view class="warp">
          <view class="rect" @tap.stop>
            {{ overlayText }}
          </view>
        </view>
      </u-overlay>
      <!-- 师傅 -->
      <uni-card>
        <!-- 师傅封面图片 -->
        <view class="worker-img">
          <u--image :showLoading="true" :src="workerDetailData['workPhoto'][0]['url']" width="100%" height="270px"
            @click="previewImageMultiple(workerDetailData.workPhoto)">
          </u--image>
        </view>
      </uni-card>
      <view class="workerInfo">
        <!-- 师傅名称 -->
        <view class="name-title">
          <text id="workerName">{{ workerDetailData.username }}</text>
          <text id="workerTitle" style="font-size: 20rpx;">中级精油SPA师</text>
        </view>
        <view class="attributes">
          <text>160cm</text>
          <text>丰韵</text>
          <text>天秤座</text>
        </view>
      </view>
    </view>
    <!-- 师傅简介 -->
    <view class="content">
      <u--text :text="workerDetailData.selfInfo" size="25"></u--text>
    </view>
    <!-- 保障权益 -->
    <view class="guarantee">
      <view class="icon-text">
        <u-icon name="lock" color="#4D9FA4" size="40"></u-icon>
        <text style="color: #000000;font-size: 25rpx;">保障</text>
      </view>
      <view class="icon-text">
        <u-icon name="rmb" color="#4D9FA4" size="40"></u-icon>
        <text style="color: #484949;font-size: 25rpx;">爽约包退</text>
      </view>
      <view class="icon-text">
        <u-icon name="integral" color="#4D9FA4" size="40"></u-icon>
        <text style="color: #484949;font-size: 25rpx;">安心认证</text>
      </view>
      <view class="icon-text">
        <u-icon name="thumb-up" color="#4D9FA4" size="40"></u-icon>
        <text style="color: #484949;font-size: 25rpx;">资质证书</text>
      </view>
    </view>
    <!-- 评价列表 -->
    <view class="comment">
      <view v-if="comments.length === 0" class="no-comments">
        暂无评价
      </view>
      <view class="comment-list">
        <view class="comment-item" v-for="(comment, index) in comments" :key="index">
          <view class="comment-header">
            <!-- 脱敏nickName -->
            <text class="comment-user">
              {{ comment.nickName ? (comment.nickName.slice(0, 1) + '***') : '匿名用户' }}
            </text>
            <u-rate :value="comment.rating || 0" size="30" inactive-color="#ff9900"></u-rate>
            <text class="comment-date">{{ comment.created ? timestampToDate(comment.created) : '未知日期' }}</text>
          </view>
          <view class="comment-content">
            <text>{{ comment.content }}</text>
          </view>
          <view class="comment-tags">
            <view class="tag" v-for="(tag, index) in (comment.tags || [])" :key="index">
              {{ tag }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 立即预约 -->
    <view class="nav">
      <u-row justify="flex-start" gutter="6" style="margin-top: 10upx">
        <u-col span="5" customStyle="margin-left: 50rpx;">
          <u-grid :border="false">
            <u-grid-item @click="customerService()">
              <u-icon color="#409EFF" name="kefu-ermai" size="35"></u-icon>
              <u-text size="35" text="客服" align="center"></u-text>
            </u-grid-item>
            <u-grid-item @click="collect()">
              <u-icon v-if="!isCollected" name="heart" size="35"></u-icon>
              <u-icon color="#F56C6C" v-if="isCollected" name="heart-fill" size="35"></u-icon>
              <u-text size="35" text="收藏" align="center"></u-text>
            </u-grid-item>
          </u-grid>
        </u-col>
        <u-col span="6" style="margin-right: 20rpx;">
          <u-button class="custom-style" type="primary" text="立即预约" color="#71d5a1" size="large" @click="
            goto(
              `/pages/business/payOrder/payOrder?goodsID=${this.goodsID}&goodsNum=1`
            )
            "></u-button>
        </u-col>
      </u-row>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      workerID: "", // 师傅ID
      // 师傅数据
      workerDetailData: {
        title: "加载中",
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
      // 分享者（邀请人）
      sharerOpenID: "",
      // 分享师傅
      sharerworkerID: "",
      // 评价列表
      comments: [
        {
          user: "人*",
          rating: 5,
          date: "2025-01-01",
          content: "点她不会踩雷",
          tags: ["热情礼貌", "着装规范", "服务态度好", "服务耐心"],
        }
      ],
      // 评价页数
      pageNum: 1,
      // 评价页大小
      pageSize: 4,
      // 是否有更多评价
      hasMoreComments: true,
    };
  },
  methods: {
    // 获取评价数据
    getCommentsWorkerData(workerID) {
      uniCloud.callFunction({
        name: "comments",
        data: {
          methods: "getCommentsWorkerDetail",
          workerID: workerID,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
        success: (res) => {
          this.comments = res.result.data || []; // 确保comments为数组
        },
        fail: (err) => {
          console.log("getCommentsWorkerDetail err", err);
        },
      });
    },
    // 获取师傅数据
    getWorkerDetailData(workerID) {
      console.log("getWorkerDetailData workerID:", workerID);
      //在当前页面显示导航条加载动画。
      uni.showNavigationBarLoading();
      // 调用云函数，获取列表
      uniCloud
        .callFunction({
          name: "worker",
          data: {
            methods: "getWorkersDetail",
            workerID: workerID, // 师傅ID
          },
        })
        .then((res) => {
          this.loadingText = "";
          // 师傅信息
          this.workerDetailData = res.result.data[0];
          // 缓存存储师傅ID
          uni.setStorageSync("workerID", workerID),
            // 隐藏loading
            uni.hideNavigationBarLoading();
          // 查询该师傅用户是否收藏
          this.isShowCollected(workerID);
        }) // success
        .catch((err) => {
          console.log(err);
        }); // fail
    },
    // 时间戳转年月日
    timestampToDate(timestamp) {
      // 确保时间戳是数字，并且是毫秒数
      const date = new Date(Number(timestamp) * 1000); // 如果是秒数，乘以1000转换为毫秒数
      if (isNaN(date.getTime())) {
        return '未知日期'; // 如果日期无效，返回默认值
      }
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    },
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
    // 预览图片多张
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
    // 页面跳转
    goto(url) {
      // 判断是否登录，未登录跳转登录页，已登录跳转指定页面
      if (
        uni.getStorageSync("openID") == "" ||
        uni.getStorageSync("openID") == undefined ||
        uni.getStorageSync("userID") == "" ||
        uni.getStorageSync("userID") == undefined
      ) {
        // 自有登录页
        uni.navigateTo({
          url: "/pages/business/login/login",
        });
        // // 统一登录页
        // uni.navigateTo({
        //   url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=weixin",
        // });
        return;
      } else {
        uni.navigateTo({
          url: url,
        });
      }
    },
    // 分享给微信好友
    shareFriend() { },
    // 分享到微信朋友圈
    shareFriendQuan() { },
    // 客服
    customerService() {
      // 跳转客服
    },
    // 查询该师傅用户是否收藏
    isShowCollected(workerID) {
      uniCloud.callFunction({
        name: "getIsCollectWorkerStatus",
        data: {
          workerID: workerID,
          openID: uni.getStorageSync("openID"),
          userID: uni.getStorageSync("userID"),
          isEnable: true,
        },
        success: (res) => {
          // 判断是否收藏
          if (res.result.data.isCollected == true) {
            this.isCollected = true;
            console.log("收藏");
          } else {
            this.isCollected = false;
            console.log("未收藏");
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
          name: "collectWorker",
          data: {
            methods: "addCollectWorker",
            openID: uni.getStorageSync("openID"),
            userID: uni.getStorageSync("userID"),
            workerID: this.workerID,
            workerPhoto: this.workerDetailData.workPhoto, // TODO 读取师傅详情数据的头像照片+修改collectWorker.schema.json
            lifePhoto: this.workerDetailData.lifePhoto,
            // 的workerImage字段
          },
          success: (res) => {
            // console.log(`addCollect userID :${uni.getStorageSync("userID")}`);
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
          name: "collectWorker",
          data: {
            methods: "deleteCollectWorker",
            openID: uni.getStorageSync("openID"),
            userID: uni.getStorageSync("userID"),
            workerID: this.workerID,
          },
          success: (res) => {
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
    // 加载更多评价
    loadMoreComments() {
      if (!this.hasMoreComments) return; // 如果没有更多数据，直接返回
      this.pageNum += 1; // 增加页码
      uniCloud.callFunction({
        name: "comments",
        data: {
          methods: "getCommentsWorkerDetail",
          workerID: this.workerID,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
        success: (res) => {
          const newComments = res.result.data || [];
          if (newComments.length < this.pageSize) {
            this.hasMoreComments = false; // 如果返回的数据小于页大小，说明没有更多数据
          }
          this.comments = this.comments.concat(newComments); // 合并新数据
        },
        fail: (err) => {
          console.log("getCommentsWorkerDetail err", err);
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
    // 接收路由参数
    this.workerID = options.workerID;
    console.log("options.workerID:", this.workerID);
    // 请求工作者详情数据
    this.getWorkerDetailData(this.workerID);
    // 请求评价数据
    this.getCommentsWorkerData(this.workerID);

    //  获取url路由参数
    var launchOptions = uni.getLaunchOptionsSync();
    console.log("workerDetail onLoad launchOptions", launchOptions.query);
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
      this.shareworkerID = query.workerID;
      console.log("sharerOpenID:", this.sharerOpenID);
      console.log("shareworkerID", this.shareworkerID);
    }

    // 当前页面
    console.log(`当前页面:workerDetailData`);
    console.log("options.workerID:", options.workerID);
    this.workerID = options.workerID;

  },
  onReachBottom() {
    this.loadMoreComments(); // 触底加载更多评价
  },
  // uniapp微信小程序分享页面到微信好友
  onShareAppMessage() {
    //	读取缓存分享人ID
    return {
      title: this.workerDetailData.title,
      path: `/pages/business/workerDetail/workerDetail?workerID=${this.workerID
        }&sharerOpenID=${uni.getStorageSync("openID")}`, //分享的页面路径
    };
  },
  // uniapp微信小程序分享页面到微信朋友圈
  onShareTimeline() {
    // 	读取缓存分享人ID
    return {
      title: this.workerDetailData.title,
      path: "/pages/business/workerDetail",
      query: `workerID=${this.workerID}&sharerOpenID=${uni.getStorageSync(
        "openID"
      )}`,
      imageUrl: this.workerDetailData["image"]["url"],
    };
  },
  created() { },
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

.rect {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.nav {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  height: 110rpx;
  z-index: 10; // 确保在其他元素之上
}


.title {
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 5%;
  margin-bottom: 5%;
  color: black;
}

.content {
  color: black;
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2%;
  margin-bottom: 1%;
}


.share {
  color: green;
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2%;
  margin-bottom: 2%;
}

.worker-info {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  color: rgb(130, 95, 54);

  .title {
    white-space: nowrap; // 防止换行
  }
}

.workerInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: url('/static/image/selftInfoBG.png');
  background-size: cover;
  background-position: center;
  padding: 20px;
  color: rgb(130, 95, 54);
  width: 90%;
  height: 50rpx;
}

.name-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  white-space: nowrap;
}

.attributes {
  display: flex;
  justify-content: space-around;
  width: 60%;
  white-space: nowrap;
}

.img {
  width: 100%;
}

.guarantee {
  background-color: #F3FFFC;
  margin-bottom: 3rpx;
  padding: 10px; // 根据需要调整内边距
  display: flex;
  align-items: center;
  height: 40rpx;

  .icon-text {
    display: flex;
    align-items: center;
    margin-right: 10px; // 调整图标和文本之间的间距
  }

  text {
    margin-left: 5px; // 调整文本和图标之间的间距
  }
}


.comment-list {
  padding: 10px;
  padding-bottom: 120rpx;
}

.comment-item {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 10px;
  // border-radius: 5px;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-user {
  font-weight: bold;
}

.comment-date {
  color: #999;
}

.comment-content {
  margin-top: 5px;
  font-size: 23rpx;
}

.comment-tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px;
}

.tag {
  background-color: #f0f0f0;
  border-radius: 3px;
  padding: 2px 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 12px;
}

.no-comments {
  text-align: center;
  color: #999;
  font-size: 25rpx;
  margin-top: 20px;
}
</style>
