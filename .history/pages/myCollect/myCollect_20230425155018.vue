<template>
  <view class="list">
    <!-- 列表数据 -->
	<view>
      <u-swipe-action>
        <u-swipe-action-item
          :options="options1"
        >
          <view class="swipe-action u-border-top u-border-bottom">
            <view class="swipe-action__content">
              <text class="swipe-action__content__text">基础使用</text>
            </view>
          </view>
        </u-swipe-action-item>
      </u-swipe-action>
	</view>
    <!-- 模态框 -->
    <u-modal
      :show="modalShow"
      @confirm="showModalConfirm"
      @cancel="showModalCancel"
      :title="showModalTitle"
      :content="showModalContent"
      :confirmText="confirmText"
      :cancelText="cancelText"
      :showConfirmButton="true"
      :showCancelButton="true"
      ref="uModal"
      :asyncClose="true"
    ></u-modal>
    <u-button @click="showModal">弹起Modal</u-button>
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
  components: {},
  data() {
    return {
      cancelText: "取消",
      confirmText: "确认",
      modalShow: false,
      loadingText: "加载中...",
      scrollTop: 0,
      mode: "fixed",
      iconStyle: "line",
      page: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      loadingMore: false,
      loadingMoreLoading: false,
      loadingMoreEnd: false,
      loadingMoreEndLoading: false,
      collectList: [],
      showModalTitle: "二次确认",
      showModalContent: "是否移除收藏",
    };
  },
  onLoad(opt) {
    this.getMyColletList();
  },
  methods: {
    // 确认弹窗
    showModal() {
      this.modalShow = true;
    },
    //  确认弹窗确认按钮
    showModalConfirm() {
      //  关闭确认弹窗
      this.modalShow = false;
      // 执行移除收藏
      this.deleteCollect();
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
    deleteCollect() {
      // 重写this为that
      var that = this;
      // 请求云函数-获取分类第2个数据，即约定第2个分类是家政
      uniCloud.callFunction({
        name: "collect",
        data: {
          method: "deleteCollect",
          _id: "",
          userID: uni.getStorageSync("userID"),
          openID: uni.getStorageSync("openID"),
        },
        success: (res) => {
          that.collectList = res.result.data;
          console.log("that.collectList:", that.collectList);
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
    getMyColletList() {
      this.pageNum = 1;
      // 显示loading
      uni.showNavigationBarLoading();
      // 重写this为that
      var that = this;
      // 请求云函数-获取分类第2个数据，即约定第2个分类是家政
      uniCloud.callFunction({
        name: "collect",
        data: {
          method: "getMyCollect",
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          isEnable: true,
          userID: uni.getStorageSync("userID"),
          openID: uni.getStorageSync("openID"),
        },
        success: (res) => {
          that.collectList = res.result.data;
          console.log("that.collectList:", that.collectList);
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
          name: "collect",
          data: {
            method: "getMyCollect",
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            isEnable: true,
            userID: uni.getStorageSync("userID"),
            openID: uni.getStorageSync("openID"),
          },
        })
        .then((res) => {
          that.loadingText = "";
          console.log(res);
          // 新旧数据拼接
          that.collectList = that.collectList.concat(res.result.data);
          that.loadingText = "加载更多";
          // 判断是否加载完毕
          if (res.result.data.length == 0) {
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
  /**
   * 下拉刷新回调函数
   */
  onPullDownRefresh() {},
  /**
   * 上拉加载回调函数
   */
  onReachBottom() {
    this.getMore();
  },
};
</script>

<style lang="scss">
@import "@/common/uni-ui.scss";

page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #efeff4;
  min-height: 100%;
  height: auto;
}

.tips {
  color: #67c23a;
  font-size: 14px;
  line-height: 40px;
  text-align: center;
  background-color: #f0f9eb;
  height: 0;
  opacity: 0;
  transform: translateY(-100%);
  transition: all 0.3s;
}

.tips-ani {
  transform: translateY(0);
  height: 40px;
  opacity: 1;
}

.shop {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.shop-picture {
  width: 110px;
  height: 110px;
}

.shop-picture-column {
  width: 100%;
  height: 170px;
  margin-bottom: 10px;
}

.shop-price {
  margin-top: 5px;
  font-size: 12px;
  color: #ff5a5f;
}

.shop-price-text {
  font-size: 16px;
}

.hot-tag {
  background: #ff5a5f;
  border: none;
  color: #fff;
}

.button-box {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  background: #007aff;
  color: #fff;
}

.uni-link {
  flex-shrink: 0;
}

.ellipsis {
  display: flex;
  overflow: hidden;
}

.uni-ellipsis-1 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.uni-ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 默认加入 scoped ，所以外面加一层提升权重
.list {
  .uni-list--waterfall {
    /* #ifndef H5 || APP-VUE */
    // 小程序 编译后会多一层标签，而其他平台没有，所以需要特殊处理一下
    ::v-deep .uni-list {
      /* #endif */
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 5px;
      box-sizing: border-box;

      /* #ifdef H5 || APP-VUE */
      // h5 和 app-vue 使用深度选择器，因为默认使用了 scoped ，所以样式会无法穿透
      ::v-deep
				/* #endif */
				.uni-list-item--waterfall {
        width: 50%;
        box-sizing: border-box;

        .uni-list-item__container {
          padding: 5px;
          flex-direction: column;
        }
      }

      /* #ifndef H5 || APP-VUE */
    }

    /* #endif */
  }
}
</style>