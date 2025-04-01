<template>
  <view>
    <view class="header">
      <!-- 用户信息 -->
      <view class="userinfo">
        <view class="face" @click="toPage()">
          <image :src="pic"></image>
        </view>
        <view class="info">
          <!-- 微信昵称 -->
          <view class="username">{{ nickName }}</view>
          <!-- 微信openID -->
          <view class="openID">{{ openID }}</view>
        </view>
      </view>

      <!-- 	<view style="margin-top:100rpx;">
				<u-row gutter="11">
					<u-col span="4">
						<u-icon name="scan" color="#FFFFFF" size="50" @click="scan()"></u-icon>
					</u-col>
					<u-col span="4" offset="3">
						<uni-icons type="chat-filled" color="#FFFFFF" size="30" @click="goto('/pages/business/notice/notice')">
						</uni-icons>
					</u-col>
				</u-row>
			</view> -->
    </view>
    <view class="orders">
      <view class="box">
        <view
          class="label"
          v-for="(row, index) in orderTypeLise"
          :key="row.name"
          hover-class="hover"
          @tap="toOrderType(index)"
        >
          <view class="icon">
            <!-- 数量 -->
            <view class="badge" v-if="row.badge > 0">{{ row.badge }}</view>
            <!-- icon -->
            <view class="">
              <image
                :src="
                  'https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/' +
                  row.icon
                "
              >
              </image>
            </view>
          </view>
          <!-- 文字（全部、待付款、已完成、已取消） -->
          <view class="">
            {{ row.name }}
          </view>
        </view>
      </view>
    </view>
    <view class="list" v-for="(list, list_i) in severList" :key="list_i">
      <view
        class="li"
        v-for="(li, li_i) in list"
        @tap="toPage(list_i, li_i)"
        v-bind:class="{ noborder: li_i == list.length - 1 }"
        hover-class="hover"
        :key="li.name"
      >
        <view class="icon">
          <image
            :src="
              'https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/' +
              li.icon
            "
          >
          </image>
        </view>
        <view class="text">{{ li.name }}</view>
        <image
          class="to"
          src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-90b1b6ed-23fc-4b35-8a98-3f94eec2193b/6b24a9eb-8713-427e-be43-9704a90df7b1.png"
        >
        </image>
      </view>
    </view>
    <button open-type="contact" style="background-color: #ffffff">
      <image
        src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-90b1b6ed-23fc-4b35-8a98-3f94eec2193b/d0dcd8f9-6a06-4630-a4a2-81ac094a57d5.png"
        mode="widthFix"
        style="
          height: 46rpx;
          width: 42rpx;
          margin-top: 30rpx;
          margin-right: 20rpx;
        "
      >
        <text>联系客服</text>
      </image>
    </button>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pic: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
      nickName: "",
      openID: "",
      orderTypeLise: [
        //name-标题 icon-图标 badge-角标
        {
          name: "全部单",
          icon: "2d63f0a5-4ed1-487e-8ee5-b9c910eb7fd1.png", // l1.png
          // badge: 1
        },
        {
          name: "已付款",
          icon: "65703909-1608-4808-867d-31c1ddbce2e8.png", // l2.png
          // badge: 1
        },
        {
          name: "退款中",
          icon: "5ecfb347-38c1-4720-ae28-2d9670fcfec4.png", // l5.png
          // badge: 2
        },
        {
          name: "已退款",
          icon: "cefba98a-4caf-41ad-b87e-7b3aa064f62e.png", // l4.png
          // badge: 4
        },
        // {
        // 	name: '退换货',
        // 	icon: 'l5.png',
        // 	badge: 0
        // }
      ],
      severList: [
        // 第一列表选项
        [
          {
            name: "优惠券",
            icon: "29012969-3bc8-4d66-9ce4-031fa04eea5b.png",
          },
          {
            name: "消息",
            icon: "0bd37c7e-4f51-4182-85eb-723d9ac97c68.png",
          },
          {
            name: "收藏",
            icon: "aa18bd48-6e26-49cc-8299-76f7c606f94a.png",
          },
          // {
          // 	name: '会员卡',
          // 	icon: '37c99316-8a1b-4005-967c-4f79853b4891.jpg'
          // },
          {
            name: "测试",
            icon: "",
          },
        ],
        // 第二列表选项
        [
          {
            name: "服务地址",
            icon: "46c516fb-cd28-44be-9c8f-dca2c6f02f1f.png",
          },
          {
            name: "订阅",
            icon: "5bb22464-ff23-4ade-a301-45cb228a5e98.png",
          },
          {
            name: "登录退出",
            icon: "7a747f41-563a-4154-9ecb-96bb46e3f57d.png",
          },
        ],
      ],
    };
  },
  onShow() {
    // 初始化（点击tabbar预约记录引导登录，但再点击tabbar“我的”没有进行登录状态判断，故tabbar“”再“我的”）
    this.init();
  },
  onHide() {
    // 初始化（点击tabbar预约记录引导登录，但再点击tabbar“我的”没有进行登录状态判断，故tabbar“”再“我的”）
    this.init();
  },
  onLoad() {
    // 当前页面
    console.log(`当前页面:my`);
    // 初始化
    this.init();
  },
  methods: {
    init() {
      // 读取缓存内容
      this.pic = uni.getStorageSync("userInfo").avatarUrl;
      this.nickName = uni.getStorageSync("userInfo").nickName;
      this.openID = uni.getStorageSync("openID");
    },
    //用户点击订单类型
    toOrderType(index) {
      uni.showToast({
        title: this.orderTypeLise[index].name,
      });
      // 判断点击哪个订单状态
      console.log("my toOrderType index:", index);
      // 路由跳转
      this.goto(`/pages/business/order/order?orderStatus=${index}`); //
    },
    //用户点击列表项
    toPage(list_i, li_i) {
      // uni.showToast({
      // 	title: this.severList[list_i][li_i].name
      // });
      // 判断点击哪个列表选项
      console.log("list_i:", list_i);
      console.log("li_i:", li_i);
      switch (list_i) {
        // 第一列表
        case 0:
          switch (li_i) {
            case 0:
              // 页面跳转
              this.goto("/pages/business/coupon/coupon");
              break;
            case 1:
              this.goto("/pages/business/notice/notice");
              break;
            case 2:
              this.goto("/pages/business/myCollect/myCollect");
              break;
            case 3:
              this.goto("/pages/business/test/test");
              break;
            case 4:
              this.goto("/pages/business/myCard/myCard");
              break;
            default:
              uni.showToast({
                title: "没有此项目",
              });
              break;
          }
          break;
        // 第二列表
        default:
          switch (li_i) {
            case 0:
              this.goto("/pages/business/address/address");
              break;
            case 1:
              uni.openSetting({
                success(res) {
                  console.log(res.authSetting);
                },
              });
              break;
            default:
              this.isLogout();
              break;
          }
          break;
      }
    },
    // 页面跳转，并判断是否已登录
    goto(url) {
      // 判断是否已登录
      let openID = uni.getStorageSync("openID");
      if (
        openID === undefined ||
        openID === "" ||
        openID === "" ||
        openID === null
      ) {
        //不存在则跳转至登录页
        // 自有登录页
        uni.reLaunch({
          url: "/pages/business/login/login",
          success: () => {
            console.log("未登录跳转登录页");
          },
        });
        // // 统一登录页
        // uni.reLaunch({
        //   url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=weixin",
        // });
      } else {
        //已登录则才进入对应路由地址
        uni.navigateTo({
          url: url,
          animationType: "slide-in-right",
          animationDuration: 300,
        });
      }
    },
    // 退出登录
    isLogout() {
      // 判断登录状态，根据当前登录状态来执行登录或退出
      let openID = uni.getStorageSync("openID");
      if (
        openID === undefined ||
        openID === "" ||
        openID === "" ||
        openID === null
      ) {
        // 当前未登录，点击该菜单项后跳转到登录页
		// 自有登录页
        this.goto("/pages/business/login/login");
        // // 统一登录页
        // uni.navigateTo({
        //   url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=weixin",
        // });
      } else {
        // 弹窗确认
        uni.showModal({
          title: " 退出",
          content: "请确认",
          success: (res) => {
            if (res.confirm) {
              console.log("用户点击确定");
              try {
                // 清理缓存
                uni.clearStorageSync();
                // 路由跳转到登录页
                //  自有登录页
                this.goto("/pages/business/login/login");
                // // 统一登录页
                // uni.navigateTo({
                //   url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=weixin",
                // });
              } catch (e) {
                console.log(e);
              }
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          },
        });
      }
    },
    // 扫一扫
    scan() {
      // 只允许通过相机扫码
      uni.scanCode({
        onlyFromCamera: false,
        success: (res) => {
          console.log("条码类型：" + res.scanType);
          console.log("条码内容：" + res.result);
          //在起始页面跳转到test.vue页面并传递参数
          uni.navigateTo({
            url: `/pages/business/scanCode/scanCode?scanResult=${res.result}`,
          });
        },
      });
    },
    // wifi连接
    content_wf() {
      // 获取手机型号
      let that = this;
      uni.getSystemInfo({
        success: (res) => {
          let system = "";
          // console.log("当前手机型号===>",res)
          if (res.platform == "android") {
            system = parseInt(res.platform.substr(8));
          }
          if (res.platform == "ios") {
            system = parseInt(res.platform.substr(4));
          }
          if (res.platform == "android" && system < 6) {
            uni.showToast({
              title: "手机版本不支持",
              icon: "none",
            });
            return;
          }
          if (res.platform == "ios" && system < 11.2) {
            uni.showToast({
              title: "手机版本不支持",
              icon: "none",
            });
            return;
          }
          //初始wifi模块
          that.start_wifi();
        },
      });
    },
    // wifi连接
    start_wifi() {
      let that = this;
      uni.startWifi({
        success: (res) => {
          console.log("startWifi==>", res);
          that.connected();
        },
        fail: (error) => {
          console.log(error);
          uni.showToast({
            title: "链接失败",
            icon: "error",
          });
        },
      });
    },
    // wifi连接
    connected() {
      let that = this;
      uni.connectWifi({
        SSID: "好慷在家二组", //Wi-Fi 设备名称
        password: "hktest123456", //Wi-Fi 密码
        success: (res) => {
          uni.showToast({
            title: "链接成功",
          });
        },
        fail: (error) => {
          uni.showToast({
            title: "链接失败",
            icon: "error",
          });
        },
      });
    },
  },
  // uniapp微信小程序分享页面到微信好友
  onShareAppMessage() {
    // TODO	读取缓存分享人ID
    return {
      title: "师傅服务平台-用户端",
      path: "/pages/home/home", //分享的页面路径
    };
  },
  // uniapp微信小程序分享页面到微信朋友圈（仅安卓）
  onShareTimeline() {
    // TODO	读取缓存分享人ID

    // 分享卡片内容
    return {
      title: "师傅服务平台-用户端 ",
      // query: `openID=${openID}`,
      imageUrl:
        "https://mp-e51575a6-5952-4ad5-bb31-45ff909d7f65.cdn.bspapp.com/cloudstorage/c89fedc8-0f75-4e8e-b151-ce90a17e7ce3.jpg",
    };
  },
};
</script>

<style lang="scss">
page {
  background-color: #fff;
}

.header {
  background-color: #409eff;
  width: 100%;
  height: 25vw;
  padding: 0 4%;
  display: flex;
  align-items: center;

  .userinfo {
    width: 90%;
    display: flex;
    margin-top: 50rpx;
    margin-left: 50rpx;

    .face {
      flex-shrink: 0;
      width: 15vw;
      height: 15vw;

      image {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }

    .info {
      display: flex;
      flex-flow: wrap;
      padding-left: 30upx;

      .username {
        width: 100%;
        color: #fff;
        font-size: 40upx;
      }

      .openID {
        width: 100%;
        color: #fff;
        font-size: 28upx;
      }

      .integral {
        display: flex;
        align-items: center;
        padding: 0 20upx;
        height: 40upx;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 20upx;
        font-size: 24upx;
      }
    }
  }

  .setting {
    flex-shrink: 0;
    width: 10rpx;
    height: 10rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }
}

.hover {
  background-color: #eee;
}

.orders {
  background-color: #409eff;
  width: 100%;
  height: 11vw;
  padding: 0 4%;
  margin-bottom: calc(11vw + 40upx);
  display: flex;
  align-items: flex-start;
  border-radius: 0 0 100% 100%;
  margin-top: -1upx;

  .box {
    width: 90%;
    padding: 0 1%;
    height: 22vw;
    background-color: #fefefe;
    border-radius: 24upx;
    box-shadow: 0 0 20upx rgba(0, 0, 0, 0.15);
    margin-bottom: 40upx;
    display: flex;
    align-items: center;
    justify-content: center;

    .label {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-flow: wrap;
      width: 100%;
      height: 16vw;
      color: #666666;
      font-size: 26upx;

      .icon {
        position: relative;
        width: 7vw;
        height: 7vw;
        margin: 0 1vw;

        .badge {
          position: absolute;
          width: 4vw;
          height: 4vw;
          background-color: #ec6d2c;
          top: -1vw;
          right: -1vw;
          border-radius: 100%;
          font-size: 20upx;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        image {
          width: 7vw;
          height: 7vw;
          z-index: 9;
        }
      }
    }
  }
}

.list {
  width: 100%;
  border-bottom: solid 26upx #f1f1f1;

  .li {
    width: 92%;
    height: 100upx;
    padding: 0 4%;
    border-bottom: solid 1upx #e7e7e7;
    display: flex;
    align-items: center;

    &.noborder {
      border-bottom: 0;
    }

    .icon {
      flex-shrink: 0;
      width: 50upx;
      height: 50upx;

      image {
        width: 50upx;
        height: 50upx;
      }
    }

    .text {
      padding-left: 20upx;
      width: 100%;
      color: #666;
    }

    .to {
      flex-shrink: 0;
      width: 40upx;
      height: 40upx;
    }
  }
}
</style>