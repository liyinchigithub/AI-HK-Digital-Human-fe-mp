<template>
  <view>
    <!-- 理疗师列表 -->
    <view class="search">
      <u-row justify="around">
        <u-col span="5">
          <u-row>
            <u-col span="4" offset="1" @click="showActionSheet = true">
              <u--text :text="selectedCityCurrent" color="#FFFFFF" size="35" margin="30rpx 10rpx 20rpx 0rpx"></u--text>
            </u-col>
            <u-col span="2" @click="showActionSheet = true">
              <u-icon name="arrow-down" color="#FFFFFF" size="50" margin="40rpx 10rpx 20rpx 20rpx"></u-icon>
            </u-col>
          </u-row>
        </u-col>
        <u-col span="7">
          <u-search placeholder="有熟悉的理疗师吗？" v-model="searchVal" @custom="search()" @clear="clear()"
            borderColor="#dbdbdb" searchIconColor="#71d5a1" :animation="true" :searchIconSize="60" height="70"
            @search="search()" margin="10rpx 0 0 0"></u-search>
        </u-col>
      </u-row>
    </view>
    <!-- 城市选择弹窗 -->
    <u-action-sheet :show="showActionSheet" :actions="cities" @select="selectCity" @close="showActionSheet = false">
    </u-action-sheet>
    <!-- 空数据 -->
    <view class="">
      <view class="empty-container" v-if="isEmpty">
        <u-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png" textSize="40">
          <!-- 没有搜索结果 -->
        </u-empty>
      </view>
      <!-- 列表内容 -->
      <view class="content" v-show="!isEmpty">
        <view class="uni-worker-list">
          <view class="uni-worker" v-for="(worker, index) in listData" :key="index">
            <view class="card-item" @click="handleClick($event, worker._id)">
              <u-row>
                <u-col span="3">
                  <image class="worker-image" :src="worker['workPhoto'][0]['url']"
                    @click.stop="previewImageSingle(worker['workPhoto'][0]['url'])"></image>
                </u-col>
                <u-col span="5">
                  <view class="worker-header">
                    <text class="worker-name">{{ worker.username }}</text>
                    <text class="worker-rating">⭐ 5</text>
                    <text class="worker-tag" @click.stop="previewImageMultiple(worker.lifePhoto)">生活照</text>
                  </view>
                  <text class="worker-orders">近半年已服务{{ worker.serviceOrderNumber }}单</text>
                  <view class="worker-actions">
                    <u-row justify="space-between" customStyle="margin-top: 20rpx;margin-bottom: 5rpx">
                      <u-col span="8">
                        <u-tag plain :text="worker.isOnline ? '可服务' : '邀上线'" type="warning"></u-tag>
                      </u-col>
                      <u-col span="5" offset="1">
                        <u-icon name="chat" :size="30"></u-icon><text class="worker-stats"> {{
                          worker.workerEvaluationNumber }}</text>
                      </u-col>
                      <u-col span="5" offset="1">
                        <u-icon name="heart" :size="30"></u-icon><text class="worker-stats"> {{ worker.workerFavorited
                          }}</text>
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
      <!-- 遮罩 -->
      <u-overlay :show="isSearching" @click="isSearching = false">
        <view class="overlay-content">
          搜索中...
        </view>
      </u-overlay>
      <!-- 底部弹出商品选择 -->
      <u-popup :show="showGoodsSelect" mode="bottom" :mask="true" @close="showGoodsSelect = false" closeable
        closeOnClickOverlay>
        <view class="popup-content">
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
          <view class="goods-list">
            <view class="goods-item" v-for="(goods, index) in goodsListData" :key="index">
              <image :src="goods.image.url" class="goods-image"></image>
              <view class="goods-info">
                <u-row>
                  <u-col span="8">
                    <text class="goods-name">{{ goods.title }}</text>
                  </u-col>
                </u-row>
                <u-row>
                  <u-col span="8" >
                    <text class="goods-duration-text">{{ goods.serviceDuration }}分钟</text>
                    <text class="goods-sales-volume"> | {{ goods.salesVolume }}人选择</text>
                  </u-col>
                </u-row>
                <u-row>
                  <u-col span="4">
                    <text class="goods-price">¥{{ goods.favourPrice }}</text>
                    <text class="goods-original-price">¥{{ goods.originalPrice }}</text>
                  </u-col>
                  <u-col span="4">
                   
                  </u-col>
                  <u-col span="5"> <u-number-box v-model="goods.quantity" @change="debounceCalculateTotalPrice" :min="0" :max="99"
                    :step="1" width="20rpx" height="30rpx" bg-color="#71d5a1" color="#000000"></u-number-box></u-col>
                </u-row>
              </view>
            </view>
          </view>
          <view class="popup-footer">
            <u-row>
              <u-col span="5">
                <text class="total-price">合计：¥ {{ totalPrice }} 元</text>
              </u-col>
              <u-col span="4">
                <button class="submit-order" @click="submitOrder">提交订单</button>
              </u-col>
            </u-row>
          </view>
        </view>
      </u-popup>
      <!-- 返回顶部 -->
      <view class="wrap">
        <u-back-top :scroll-top="scrollTop" :mode="mode" :icon-style="iconStyle"></u-back-top>
      </view>
    </view>
  </view>
</template>

<script>
import _ from 'lodash';
export default {
  data() {
    return {
      screenHeight: 0,
      screenWidth: 0,
      isEmpty: false, // 是否显示“空数据”
      workerID: "", // 师傅ID
      goodsID: "", // 商品ID
      searchVal: "", // 搜索
      worker: {},// 
      isSearching: false, // 控制遮罩显示
      // 
      title: "worker-list",
      listData: [],
      renderImage: false,
      // 返回顶部
      scrollTop: 0,
      mode: "square",
      iconStyle: {
        fontSize: "32rpx",
        color: "#71d5a1",
      },
      // tab列表分页
      pageNum: 1,
      pageSize: 7,
      total: 0,
      index: "",
      hasMoreWorkers: true, // 是否有更多理疗师
      // 城市选择
      showActionSheet: false,
      cities: [
        // { name: "泉州市" },
        // { name: "厦门市" },
        // { name: "漳州市" },
        // { name: "福州市" }
      ],
      selectedCityCurrent: "",// 当前选中城市
      selectedCityCurrentID: "",// 当前选中城市ID
      showGoodsSelect: false,// 商品选择弹窗
      goodsListData: [], // 商品数据
      totalPrice: 0,
    };
  },
  methods: {
    // 城市选择-获取城市数据
    async fetchCities() {
      try {
        const res = await uniCloud.callFunction({
          name: 'getCities',
          data: {
            methods: 'getCities',
          }
        });
        if (res.result.code === 0) {
          // 数据格式转换
          this.cities = res.result.data.map(city => ({ name: city.cityName, value: city._id }));
        } else {
          console.error(res.result.message);
        }
      } catch (error) {
        console.error('获取城市数据失败', error);
      }
    },
    // 城市选择
    selectCity(action) {
      this.selectedCityCurrent = action.name;
      this.showActionSheet = false;
      console.log("this.selectedCityCurrent:", this.selectedCityCurrent);
      this.selectedCityCurrentID = action.value;
      console.log("this.selectedCityCurrentID", action.value)
      this.getListData(action.value);
    },
    // 搜索
    search(val) {
      if (!this.searchVal.trim()) {
        // 如果搜索条件为空，调用 getListData
        this.getListData(this.selectedCityCurrentID);
        return;
      }

      var that = this;
      console.log(val);
      // 隐藏遮罩
      that.isSearching = true;
      //
      uniCloud.callFunction({
        name: "worker",
        data: {
          methods: "getWorkersSearch",
          isEnable: true,
          username: that.searchVal,
          pageNum: that.pageNum,
          pageSize: that.pageSize,
        },
        success: (res) => {
          that.listData = res.result.data;
          console.log("res:", res)
          console.log("空数据")
          console.log("that.listData:", that.listData);
          // 是否空数据
          if (that.listData.length == 0) {
            that.isEmpty = true;
          } else {
            that.isEmpty = false;
          }
          // 隐藏遮罩
          that.isSearching = false

        },
        fail: (err) => {
          console.log("getWorkersSearch err", err);
          // 隐藏为空
          that.isEmpty = true;
          // 隐藏遮罩
          that.isSearching = false;
        }
      });
    },
    // 搜索-清除
    clear() {
      this.searchVal = "";
      // 隐藏空数据
      this.isEmpty = false;
    },
    // 获取理疗师数据
    getListData(cityID) {
      this.pageNum = 1;
      // 显示遮罩
      this.isSearching = true;
      // 重写this为that
      var that = this;
      // 请求云函数
      uniCloud.callFunction({
        name: "worker",
        data: {
          methods: "getWorkers",
          cityName: that.selectedCityCurrent,
          cityID: cityID,
          sortType: "created",
          isEnable: true,
          pageNum: that.pageNum,
          pageSize: that.pageSize,
        },
        success: (res) => {
          that.listData = res.result.data;
          console.log("that.listData:", that.listData);
          // 是否空数据
          if (that.listData.length == 0) {
            that.isEmpty = true;
          } else {
            that.isEmpty = false;
          }
          // 隐藏遮罩
          that.isSearching = false;
        }, failure: (err) => {
          console.log("getListData err", err);
          // 隐藏为空
          that.isEmpty = true;
          // 隐藏遮罩
          that.isSearching = false;
        }
      });
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
    loadMoreWorkers() {
      if (!this.hasMoreWorkers) return; // 如果没有更多数据，直接返回

      this.pageNum += 1; // 增加页码
      uniCloud.callFunction({
        name: "worker",
        data: {
          methods: "getWorkers",
          cityName: this.selectedCityCurrent,
          cityID: this.selectedCityCurrentID,
          sortType: "created",
          isEnable: true,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
        success: (res) => {
          const newWorkers = res.result.data || [];
          if (newWorkers.length < this.pageSize) {
            this.hasMoreWorkers = false; // 如果返回的数据小于页大小，说明没有更多数据
            console.log("Loaded more workers:", newWorkers); // 添加日志
          }
          this.listData = this.listData.concat(newWorkers); // 合并新数据
        },
        fail: (err) => {
          console.log("getWorkers err", err);
        },
      });
    },
    // 点击理疗师卡片
    handleClick(event, workerID) {
      // 这里不需要再检查特定元素，因为点击事件已经在特定元素上被阻止了
      this.goto(`/pages/business/workerDetail/workerDetail?workerID=${workerID}`);
    },
    // 立即预约
    toOrder(workerID) {
      // 如果是，跳转提交订单页，并路由传参workerID和商品ID
      this.workerID = workerID;
      // 当前点击立即预约的师傅ID
      console.log("this.workerID:", this.workerID);

      // 判断是否是首页跳转过来
      if (this.isHomeGoTo) {
        // 跳转页面
        uni.navigateTo({
          url: `/pages/business/payOrder/payOrder?workerID=${this.workerID}&goodsID=${this.goodsID}`,
        });
        console.log("从首页商品（项目）跳转过来，商品ID:", this.goodsID);
      } else {
        // 否则，底部弹出商品选择（项目选择）
        this.showGoodsSelect = true; // 显示商品选择弹窗
        console.log("不是从首页商品（项目）跳转过来")
        // 所选商品数组 TODO
      }
    },
    // 获取商品数据
    getGoodsData(index) {
      var that = this;
      uniCloud.callFunction({
        name: "goods",
        data: {
          methods: "getGoods",
          sortType: index,
          pageNum: that.pageNum,
          pageSize: that.pageSize + 50,
          cityName: uni.getStorageSync("cityName"),
          cityID: uni.getStorageSync("cityID"),
          isEnable: true,
        },
        success: (res) => {
          console.log("worker getGoods res.result.data:", res.result.data);
          that.goodsListData = res.result.data.map(goods => ({
            ...goods,
            quantity: goods.quantity || 0 // 初始化 quantity 为 0
          }));
        },
        fail: (err) => {
          console.log("getGoodsData err", err);
        }
      });
    },
    calculateTotalPrice() {
      this.totalPrice = this.goodsListData.reduce((total, goods) => {
        const price = Number(goods.favourPrice);
        const quantity = Number(goods.quantity) || 0;
        console.log("worker calculateTotalPrice total:", total);
        console.log("worker calculateTotalPrice goods.favourPrice:", price);
        console.log("worker calculateTotalPrice goods.quantity:", quantity);
        return total + price * quantity;
      }, 0);
      console.log("worker calculateTotalPrice this.totalPrice:", this.totalPrice);
    },
    debounceCalculateTotalPrice: _.debounce(function () {
      this.calculateTotalPrice();
    }, 300), // 300ms 的防抖时间,
    // 提交订单
    submitOrder() {
      console.log("订单提交");
      // 过滤出数量大于0的商品
      const selectedGoods = this.goodsListData
        .filter(goods => goods.quantity > 0)
        .map(goods => ({
          id: goods._id,
          quantity: goods.quantity,
          price: goods.favourPrice
        }));
      console.log("worker selectedGoods:", selectedGoods);
      // 跳转到提交订单页，并传递商品数据
      uni.navigateTo({
        url: `/pages/business/payOrder/payOrder?selectedGoods=${encodeURIComponent(JSON.stringify(selectedGoods))}`,
      });
    },
    goto(url) {
      uni.navigateTo({
        url: url,
      });
    },
  },
  onReachBottom() {
    this.loadMoreWorkers(); // 触底加载更多理疗师
    console.log("Reached bottom, loading more workers..."); // 添加日志
  },
  created() {
    // 判断selectedCityCurrentID是否为空，为空取缓存默认城市
    if (this.selectedCityCurrent == "" || this.selectedCityCurrent == undefined || this.selectedCityCurrent == null) {
      this.selectedCityCurrentID = uni.getStorageSync("cityID");
      console.log("worker selectedCityCurrentID为空获取缓存城市ID:", this.selectedCityCurrentID)
    } else {
      console.log("worker 城市ID不为空 this.selectedCityCurrentID:", this.selectedCityCurrentID)
    }
    // 获取商品数据
    this.getGoodsData(0);

    //
    this.getListData(this.selectedCityCurrentID);
  },
  // 接收路由传参
  onLoad(options) {
    // 获取屏幕宽高
    this.screenHeight = uni.getSystemInfoSync().windowHeight;
    this.screenWidth = uni.getSystemInfoSync().windowWidth;
    // 获取城市数据
    this.fetchCities();
    // 获取缓存城市
    this.selectedCityCurrent = uni.getStorageSync("cityName");
    console.log("this.selectedCityCurrent:", this.selectedCityCurrent);
    // console.log("options.workerID:", options.workerID)
    // this.workerID = options.workerID;
  },
  onShow() {
    // 获取是否是首页跳转过来的参数
    this.isHomeGoTo = uni.getStorageSync("isHomeGoTo");// 缓存
    this.goodsID = uni.getStorageSync("goodsID");// 缓存
    console.log("worker this.isHomeGoTo:", this.isHomeGoTo);
    console.log("worker this.goodsID:", this.goodsID);
    // 获取是否是首页跳转过来的参数
    this.isHomeGoTo = uni.getStorageSync("isHomeGoTo"); // 缓存
    this.goodsID = uni.getStorageSync("goodsID"); // 缓存
    console.log("worker this.isHomeGoTo:", this.isHomeGoTo);
    console.log("worker this.goodsID:", this.goodsID);
  },

  onPullDownRefresh() {
  },
  // 分享微信好友
  onShareAppMessage() {
    // TODO	读取缓存分享人ID
    return {
      title: "师傅服务平台-用户端",
      path: `/pages/business/brand/brand`, //分享的页面路径
    };
  },
  // 分享微信朋友圈
  onShareTimeline() {
    // TODO	读取缓存分享人ID
    return {
      title: "师傅服务平台-用户端",
      path: "/pages/business/brand/brand",
      // query: 'name=1&age=2',
      imageUrl:
        "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/c89fedc8-0f75-4e8e-b151-ce90a17e7ce3.jpg",
    };
  },
};
</script>

<style lang="scss">
/* 搜索 */

/* 列表内容 */
content {
  margin-top: 20rpx;
}

/* worker */
page {
  background: #ffffff;
}

view {
  font-size: 28upx;
}

.search {
  /* 水平偏移 5 像素、垂直偏移 3 像素、模糊半径 2 像素、颜色为红色的阴影 */
  /* box-shadow: 20px 10px 5px rgba(0, 0, 0, .2); */
  background-color: #71d5a1;
  height: 100rpx;
}

.uni-worker-list {
  /* border: 2px solid #303133; */
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
}


.info {
  position: absolute;
  right: 20rpx;
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



s .card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}



/* .content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	} */




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
  /* 向左移动 */
}

.service-status {
  background-color: #ff9800;
  color: #fff;
  /* padding: 10rpx 20rpx; */
  border-radius: 10rpx;
  /* margin-right: 10rpx; */
  font-size: 23rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110rpx;
  height: 50rpx;
}

.worker-evaluation {
  font-size: 28rpx;
  color: #888;
  margin-left: -60rpx;
  /* 向左移动 */
}

.worker-stats {
  margin-left: 0rpx;
  /* 向左移动 */
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

.custom-style {
  color: #71d5a1;
  width: 400rpx;
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
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100%;
  /* 确保父容器的高度 */
  width: 100%;
  /* 确保父容器的宽度 */
}

.popup-content {
  padding: 20rpx;
  background-color: #fff;
}

.popup-header {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20rpx;
  font-size: 30rpx;
  color: #888;
}

.goods-list {
  max-height: 570rpx;
  overflow-y: auto;
}

.goods-item {
  display: flex;
  margin-bottom: 20rpx;
}

.goods-image {
  width: 100rpx;
  height: 100rpx;
  margin-right: 20rpx;
}

.goods-info {
  flex: 1;
}

.goods-name {
  font-size: 28rpx;
  margin-bottom: 10rpx;
  font-weight: bold;
}

.goods-price {
  color: #f00;
  font-size: 35rpx;
}

.goods-original-price {
  text-decoration: line-through;
  color: #888;
  font-size: 26rpx;
}

.goods-quantity {
  display: flex;
  align-items: center;
}

.goods-quantity button {
  width: 40rpx;
  height: 40rpx;
  background-color: #71d5a1;
  color: #fff;
  border: none;
  border-radius: 50%;
}

.popup-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
}

.submit-order {
  background-color: #71d5a1;
  color: #fff;
  border-top-right-radius: 90rpx;
  border-bottom-right-radius: 90rpx;
  width: 230rpx;
  height: 80rpx;
  font-size: 35rpx;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  margin-left: 120rpx !important;
}


.total-price {
  font-size: 40rpx;
  color: #888;
  // margin-right: 20rpx;
  width: 490rpx;
  height: 60rpx !important;
  display: flex;
  // align-items: center;
  // justify-content: center;
  background-color: #333;
  color: #fff;
  border-top-left-radius: 90rpx;
  border-bottom-left-radius: 90rpx;
  padding: 10rpx 20rpx;
}

.guarantee {
  background-color: #F3FFFC;
  margin-bottom: 3rpx;
  padding: 10px;
  display: flex;
  align-items: center;
  height: 40rpx;

  .icon-text {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  text {
    margin-left: 5px;
  }
}

.popup-content {
  padding: 20rpx;
  background-color: #fff;
  height: 750rpx; // 设置高度为500rpx
}

.goods-duration-text {
  font-size: 20 rpx;
  color: #CDCDCD;
}

.goods-sales-volume {
  font-size: 20 rpx;
  color: #CDCDCD;
}

</style>
