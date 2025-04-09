# 百度千帆应用-AI对话-用户端


## 版本

- HBuilder 版本3.6.4
- UView 2.0.31
- Vue 2.X
- nodejs 12
- unicloud-阿里云云空间

# 主题颜色

- 主色：#71d5a1 青绿色
- 辅助色：#dbdbdb
- 背景色：#F3FFFC
- 文字色：#ffffff
- 文字色：#424242
- 文字色：#CDCDCD
- 其他：#9aceb3

## 百度千帆appBuilder

[百度千帆-数字人网站嵌入](https://cloud.baidu.com/doc/AppBuilder/s/hm202zkxz)
### 使用前需要：
1. 在uniCloud 云函数speech-to-text和qianfan-chat配置好百度智能云的语音识别和对话接口
2. 在百度智能云控制台开通「短语音识别」服务
3. 在manifest.json中添加录音权限：
```json
"mp-weixin": {
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    },
    "scope.record": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    }
  }
}
```

### 百度智能云语音识别

- 语音识别

>https://console.bce.baidu.com/ai_apaas/personalSpace/app

- 语音合成

>https://console.bce.baidu.com/ai_apaas/personalSpace/app

1. 应用

>https://console.bce.baidu.com/ai_apaas/personalSpace/app

- 语音技术

>https://console.bce.baidu.com/ai-engine/old/#/ai/speech/app/list

### 百度智能云API Key

API Key秘钥

>https://console.bce.baidu.com/iam/#/iam/apikey/list


### 百度智能云羲灵(数字人)

App ID 和 App Key

>https://xiling.cloud.baidu.com/open/appConsole/list





2. 登录状态判断

pages/my/my.vue

```javascript
goto(url) {
			// let openID = uni.getStorageSync("openID");
			let openID = uni.getStorageSync("token");

			if (!openID) {
				uni.reLaunch({
					url: "/pages/business/login/login",
					success: () => {
						console.log("未登录跳转登录页");
					},
				});
			} else {
				uni.navigateTo({
					url: url,
					animationType: "slide-in-right",
					animationDuration: 300,
				});
			}
		},
```

3. 部署

## 隐私政策

>pages/business/privacyPolicy/privacyPolicy.vue

## 服务协议

>pages/business/serviceAgreement/serviceAgreement.vue

## 责任声明

>pages/business/disclaimer/disclaimer.vue

修改“公司名称”、“官网地址”、“电话”

## 初始化配置

1. 生成新项目应用ID
[Dcloud APPID](https://dev.dcloud.net.cn/pages/app/list)
2. 上传云函数 uniCloud/cloudfunctions/
3. 上传数据库 uniCloud/database
4. 修改配置 manifest.json（微信APPID、定位接口权限）
5. 导入icon图片（由于发布微信大小限制问题，使用网络icon图片）
>导入icon图片
6. 数据库表文件导入

- (1) uni-id-users 创建管理后台登录账号数据

在新云服务空间数据库表导入文件“数据库表导入/uni-id-users/20241224144825_6f7d6f84-68ee-4a07-b458-f379f3a16412.json”

修改下面的appid和dcloud_appid，把项目manifest.json中基础配置应用ID重新生成新的并修改到下面json种。
```json
{
    "username": "admin",
    "password": "66779b63db271c65e074cab4907604a01a31981a",
    "nickname": "超级管理员",
    "role": [
        "admin"
    ],
    "register_env": {
        "appid": "__UNI__67030C1",
        "uni_platform": "web",
        "os_name": "macos",
        "app_name": "tongcheng-worker-management-background",
        "app_version": "1.0.0",
        "app_version_code": "100",
        "channel": "1001",
        "client_ip": "222.76.204.13"
    },
    "register_date": 1675650915519,
    "dcloud_appid": [
        "__UNI__67030C1"
    ],
    "last_login_date": 1731241070346,
    "last_login_ip": "36.161.115.40",
    "token": [
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2M2UwNjc2M2UxYTM1Y2RlNGMwYzljZTAiLCJyb2xlIjpbImFkbWluIl0sInBlcm1pc3Npb24iOltdLCJ1bmlJZFZlcnNpb24iOiIxLjAuMTYiLCJpYXQiOjE3MzEyNDEwNzAsImV4cCI6MTczMTI0ODI3MH0.pYciIIXka9OOd8jJiK0n1P9vA4zQVYM9zLPIM5XamZE"
    ],
    "login_ip_limit": []
}
```

- (2) uni-id-roles 账号角色


在新云服务空间数据库表导入文件“数据库表导入/uni-id-roles/20241224145250_f1c4bb74-852b-42ba-a7f1-c6aa4811e734.json”


```json
{
    "role_id": "admin",
    "role_name": "超级管理员",
    "permission": [],
    "comment": "超级管理员拥有所有权限",
    "create_date": 0
}
```

- (3) opendb-admin-menus 配置菜单

在新云服务空间数据库表导入文件“数据库表导入/opendb-admin-menus/20241224144132_a9a36ad8-4a8b-4937-bd70-cd43d5078ea6.json”

- (4) brand 品牌

在新云服务空间数据库表导入文件“数据库表导入/brand/20241225153742_83a677af-346e-41b5-befa-b14802487639.json”

- （5）classType 分类

在新云服务空间数据库表导入文件“数据库表导入/classType/”

- （6）commissionScheme 佣金方案

在新云服务空间数据库表导入文件“数据库表导入/commissionScheme/”

- （7）导入“./数据库表导入”文件下所有文件

6. 启动管理后台，登录账号：admin 密码：abc123456

7. 产线地址

后台web项目打包发布到云服务器静态托管

[]()

8. 微信登录

微信授权机制
- 1. 获取手机号码：通过 getPhoneNumber 按钮触发，用户同意后可以获取用户的手机号码。
- 2. 获取用户信息（昵称和头像）：通过 wx.getUserProfile 获取，需要用户主动触发（如点击按钮）。


如果您只想在用户点击一次按钮时同时获取手机号码和用户信息（昵称和头像），您需要确保在用户同意获取手机号码后，再请求获取用户信息。

实现步骤：
- 1. 用户点击微信登录按钮：触发 getPhoneNumber。
- 2. 在 getPhoneNumber 成功后：调用 wx.getUserProfile 来获取用户的昵称和头像。



（1）微信授权手机号登录
>pages/business/login/login.vue
>./uniCloud-aliyun/cloudfunctions/getOpenID/index.js

配置微信小程序**appid**和**appsecret**

```json
const appid = '' //appid  
const secret = '' //secret  
const loginUrl = 'https://api.weixin.qq.com/sns/jscode2session'
```



（2）微信授权登录
>pages/business/login/login copy.vue
>uniCloud-aliyun/cloudfunctions/getOpenID/index copy.js
 

## uview 2.0

1.前端UI uview组件库

[安装引入](https://www.uviewui.com/components/install.html)

（1）安装

```
npm install uview-ui@2.0.31
```

2.在main.js中进行如下配置

```
// main.js，注意要在use方法之后执行
import uView from 'uview-ui'
Vue.use(uView)
// 如此配置即可
uni.$u.config.unit = 'rpx'
```

3.在项目src目录的uni.scss中引入此文件。
```
/* uni.scss */
@import 'uview-ui/theme.scss';
```

4.引入uView基础样式 App.vue
```
<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
```

5.配置easycom组件模式(可以不用引用组件直接用)pages.json

```
// pages.json
	"easycom": {
		// 下载安装的方式需要前面的"@/"，npm安装的方式无需"@/"
		// 下载安装方式
		"^u-(.*)": "@/uni_modules/uview-ui/components/u-$1/u-$1.vue"
		// npm安装方式
		// "^u-(.*)": "uview-ui/components/u-$1/u-$1.vue"
	},
```


6.项目根目录的vue.config.js文
```
// vue.config.js，如没有此文件则手动创建
module.exports = {
    transpileDependencies: ['uview-ui']
}
```



7.第三方组件

[商品列表](https://ext.dcloud.net.cn/plugin?id=45)

[商品多规格sku选择器组件](https://ext.dcloud.net.cn/plugin?id=2848)

[uni-goods-nav 商品导航](https://ext.dcloud.net.cn/plugin?id=865)

[]()


9.常用、常见配置

（1）自定义按钮跳转微信客服（非企微）

```javascript
open-type="contact"
```


（2）分享好友
```javascript
open-type="share"
```

备注：open-type属性，有些uview组件用不了，一般用于button、text、icon


 (3)商品详情底栏
 ```html
 <view class="nav">
 	<!-- <view class="uni-tabbar-border"></view> -->
 	<u-row>
 		<u-col span="5">
 			<u-grid :border="false">
 				<u-grid-item @click="customerService()" >
 					<u-icon name="kefu-ermai" size="30" open-type="contact"></u-icon>
 					<u-text size="30" text="客服" align="center" open-type="contact"></u-text>
 				</u-grid-item>
 				<u-grid-item @click="collect()">
 					<!-- 未收藏 -->
 					<u-icon v-if="!isCollected" name="heart" size="30"></u-icon>
 					<!-- 已收藏 -->
 					<u-icon v-if="isCollected" name="heart-fill" size="30"></u-icon>
 					<u-text size="30" text="收藏" align="center"></u-text>
 				</u-grid-item>
 				<u-grid-item >
 					<u-icon name="share-square" size="30" open-type="share"></u-icon>
 					<u-text size="30" text="分享" align="center" open-type="share"></u-text>
 				</u-grid-item>
 			</u-grid>
 		</u-col>
 		<u-col span="7" customStyle="padding-right:15px;margin:5px 0">
 			<u-button type="primary" text="立即购买" shape="circle" color="#e1251b"></u-button>
 		</u-col>
 	</u-row>
 </view>
 ```
 ```scss
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
 	height: 150rpx;// 调整底栏高度
 }
 ```

 （4）图片宽度100%、高度自适应

 ```vue
 <template>
  <view class="container">
    <image class="img" mode="widthFix" :src="imageUrl" :style="{ height: imgHeight + 'px' }" @load="onImgLoad" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: 'https://picsum.photos/400/300',
      imgHeight: 0,
    };
  },
  methods: {
    onImgLoad(e) {
      // 当图片加载完成后，获取图片的原始宽度和高度，并根据宽度计算出高度
      const { width, height } = e.mp.detail;
      this.imgHeight = (height / width) * 100; // 高度 = 原始高度 / 原始宽度 * 100
    },
  },
};
</script>

<style>
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
 ```

[CSDN](https://blog.csdn.net/u013302168/article/details/130868023)

 （5）微信商户支付

先进行微信公众号认证、微信小程序认证（公众号资质认证可同步到小程序），再进行微信商户支付认证，认证通过后接入微信小程序appId（即把微信小程序关联到商户支付）

先用官方uni-pay 示例项目跑通调起微信支付流程，再把uni-pay集成到自己项目，以保障配置没问题；


① 微信商户号、微信商户API秘钥获取方式

>https://blog.csdn.net/u013302168/article/details/130542095

② [unipay 版本1.0]uniapp使用unipay云函数完成微信支付

>https://blog.csdn.net/u013302168/article/details/130542169


③ [unipay 版本1.0]uniapp + uniCloud+unipay 实现微信小程序支付功能
>https://blog.csdn.net/u013302168/article/details/130542206


④ [unipay 版本2.0] 

- 如何集成到自己项目？

**必须先跑通官方示例项目，再集成到自己项目**

[示例项目运行教程](https://doc.dcloud.net.cn/uniCloud/uni-pay/uni-app.html#rundemo)

[uni-pay 2](https://doc.dcloud.net.cn/uniCloud/uni-pay/uni-app.html)

**注意**：需要先调通授权登录成功，因为支付需要用到openID，先配置getOpenID的微信appid和appsecret 

>./uniCloud-aliyun/cloudfunctions/getOpenID/index.js

配置微信小程序appid和appsecret

```json
const appid = '' //appid  
const secret = '' //secret  
const loginUrl = 'https://api.weixin.qq.com/sns/jscode2session'
```

⑤ uni-pay的config-center配置

>https://uniapp.dcloud.net.cn/uniCloud/uni-pay.html#config

 [查看支付配置介绍](https://doc.dcloud.net.cn/uniCloud/uni-pay/uni-app.html#config)



⑥ 支付成功后，业务处理

商品：/uni-pay-co/notify/goods.js
余额充值：/uni-pay-co/notify/recharge.js
测试支付回调：/uni-pay-co/notify/test.js


⑦ 调用微信支付常见问题：

a. 微信支付调用失败，提示“商户号mch_id与appid不匹配”

[解决办法] 
		
检查微信支付商户号mch_id是否正确，检查微信支付商户号是否与appid绑定。

b. Error: 无法将输入源“/body/xml/total_fee”映射到目标字段“标价金额”中，此字段需要一个合法的 64 位有符号整数

解决办法：

APIv2，total_fee给分为单位的字符串就行

total_fee类型是int，单位为分，检查一下你的传参

c. Error: 签名错误，请检查后再试

出现该提示的原因是：商户号、商户API密钥填错、或者小程序未关联商户号

解决办法：

>https://blog.csdn.net/u013302168/article/details/130542475


[全局错误码uni-pay](https://doc.dcloud.net.cn/uniCloud/uni-pay/uni-app.html#errorcode)

- 【微信小程序认证】

公众号后台>设置>基本设置>基本信息>微信认证

>https://mp.weixin.qq.com/wxamp/basicprofile/index?token=2128596652&lang=zh_CN

- 【微信支付APIv2秘钥】

- 微信商户支付后台，生成APIv2秘钥

>https://kf.qq.com/faq/180830UVRZR7180830Ij6ZZz.html

如果已认证过微信公众号，可以直接复用资质认证到微信小程序

- 【微信支付证书】

>https://pay.weixin.qq.com/

pfx：微信支付v2需要用到的证书，是一个后缀名为.p12的文件，如果你的.p12文件不是apiclient_cert.p12，则将它改名成apiclient_cert.p12，并复制到 uni-config-center/uni-pay/wxpay/ 目录下

微信支付所需参数和证书生成教程

>https://docs.qq.com/doc/DWUpGTW1kSUdpZGF5

**注意：**过程中会让输入密码，默认就是证书对应的商户号。

- 【微信支付接口签名校验工具(自己的服务器/非uni-pay)】

>https://pay.weixin.qq.com/wiki/doc/api/micropay.php?chapter=20_1


【（个体工商户）如何提交接入申请资料？】

>https://kf.qq.com/faq/180910eUfeyu180910BFZNJN.html

【如何获取付款证书】

>https://www.kancloud.cn/jinhong/mendian/986283

（6）Uniapp + UniCloud 云开发微信小程序获取用户信息（完整版）

>https://blog.csdn.net/u013302168/article/details/130542284


（7）微信小程序 分包

上传体验版时，提示：分包大小不能超过2M

**解决办法**：分包 page.json 配置subpackage

>https://blog.csdn.net/u013302168/article/details/130797988


（8）微信小程序顶栏小房子

①方法一：reLaunch()

```JavaScript
goto(url) {
	// reLaunch会关闭之前所有页面，navigateTo保留之前访问所有页面
	uni.reLaunch({
		url: url
		})
	},
```

选择了wx.relaunch(关闭所有页面，打开到应用内的某个页面)，它出现的问题就是会出现小房子。

另，跳转页面的 wx.relaunch() 改成了 wx.navigateTo()

②方法二

pages.json里面定义路径和样式的时候一定要去掉这个 "navigationStyle" : "custom"（custom即取消默认的原生导航栏不显示小房子）

（9）统计

[uni统计2.0](https://uniapp.dcloud.net.cn/uni-stat-v2.html)

前端采集模块：内置在uni-app框架中，manifest.json》uni统计配置》版本统计2.0》启用微信小程序统计；
云端统计模块：内置在uni-admin项目模板中，和业务App复用同样的uniCloud服务空间，manifest.json》uni统计配置》版本统计2.0》启用微信小程序统计；

**注意事项：**

由于各家小程序对可访问的域名要配置白名单，否则无法联网。所以需要发布小程序时需要在各厂商的小程序管理后台配置域名白名单。

部署uni统计时可以选择使用uniCloud的阿里云版或腾讯云版，不同云厂商对应的域名不同（文章后面章节会有服务空间相关配置）

- 【客户端报错上报】

生成 sourceMap，线上运行端在各种用户环境下可能会有报错，需要开发者统计和分析。但三方统计系统（如友盟、阿拉丁、百度），对运行端的报错采集，提示的是uni-app编译器编译后的代码报错的行数，相当于乱码，无法告知开发者是uni-app的vue或js的哪一行代码报错。

uni统计的sourceMap功能可以解决这一问题，在统计后台可以清晰的看到报错的环境和准确的报错代码，是uni-app编译前的vue或js的具体信息。

发行 -> web 平台在发行-> 网站时，勾选 生成 sourceMap 选项。

（10）微信开放平台 API 

[错误码](https://developers.weixin.qq.com/doc/oplatform/Return_codes/Return_code_descriptions_new.html#%E5%85%B6%E4%BB%96%E9%94%99%E8%AF%AF%E7%A0%81)


（11）uni-modules插件制作

[如何制作并发布插件](https://uniapp.dcloud.net.cn/plugin/uni_modules.html)


（12）uni-id-pagge

[统一登录页面](https://uniapp.dcloud.net.cn/uniCloud/uni-id-pages.html)


（13）短信验证码

[uni短信验证码](https://uniapp.dcloud.net.cn/uniCloud/uni-id-pages.html#%E7%9F%AD%E4%BF%A1%E9%AA%8C%E8%AF%81%E7%A0%81)
为了方便开发调试，uni-id-pages未配置短信登录时，自动启动测试模式；直接使用：123456作为短信验证码即可。
使用本功能需要在DCloud开发者中心 -> 短信验证码开通并充值
教程参考[短信服务开通指南](https://ask.dcloud.net.cn/article/37534)
密钥配置：uni-id配置文件 --> service --> sms 填写相关密钥信息。



（14）创建Dcloud

[Dcloud应用创建](https://dev.dcloud.net.cn/pages/app/list)


（15）答疑提问

[官方开发者解答问题](https://ask.dcloud.net.cn/publish/)


（16）基础库

[新版！用户头像和昵称获取方式](https://blog.csdn.net/irisMoon06/article/details/128527706)


- 头像获取：

需要将 button 组件 open-type 的值设置为 chooseAvatar，当用户选择需要使用的头像之后，可以通过 bindchooseavatar 事件回调获取到头像信息的临时路径。

从基础库2.24.4版本起，若用户上传的图片未通过安全监测，不触发bindchooseavatar 事件。

- 昵称获取：

需要将 input 组件 type 的值设置为 nickname，当用户在此 input 进行输入时，键盘上方会展示微信昵称。

从基础库2.24.4版本起，在onBlur 事件触发时，微信将异步对用户输入的内容进行安全监测，若未通过安全监测，微信将清空用户输入的内容，建议开发者通过 form 中form-type 为submit 的button 组件收集用户输入的内容。



（17）发起退款

[uni-pay 2.0 发起退款](https://uniapp.dcloud.net.cn/uniCloud/uni-pay.html#refund)


（18）没有返回openID

解决办法：没有正确配置微信appid和appsecret

>./uniCloud-aliyun/cloudfunctions/getOpenID/index.js



10. 前端组件直接查询数据库

[unicloud-db](https://uniapp.dcloud.net.cn/uniCloud/unicloud-db.html)



# 二、常见问题

1. 云函数文件，上传失败：阿里云云函数运行环境（runtime）已不支持Nodejs8，请检查云函数目录下package.json的相关配置。参考：https://doc.dcloud.net.cn/uniCloud/cf-functions.html#cloudfunction-config

解决办法：打开uniCloud/cloudfunctions/uni-pay-co/pageage.json 修改runtime版本

```json
  "cloudfunction-config": {
  "concurrency": 1, // 单个云函数实例最大并发量，不配置的情况下默认是1
  "memorySize": 512, // 函数的最大可用内存，单位MB，可选值： 128|256|512|1024|2048，默认值256，阿里云正式版默认512
  "path": "/uni-pay-co",
  "timeout": 60,// 函数的超时时间，单位秒，默认值5。阿里云最长为120秒，阿里云在定时触发时最长可以是7200秒
  "triggers": [],// 定时触发
  "runtime": "Nodejs12" // nodejs版本，可选Nodejs8、Nodejs12、Nodejs14、Nodejs16、Nodejs18、Nodejs20
}
```


2. 定时触发


```json
// triggers 字段是触发器数组，目前仅支持一个触发器，即数组只能填写一个，不可添加多个
  "triggers": [{ // 阿里云腾讯云均为此形式，请阅读下方说明
      // name: 触发器的名字，规则见https://uniapp.dcloud.net.cn/uniCloud/trigger，name不对阿里云生效
      "name": "myTrigger",
      // type: 触发器类型，目前仅支持 timer (即 定时触发器)，type不对阿里云生效
      "type": "timer",
      // config: 触发器配置，在定时触发器下，config 格式为 cron 表达式，规则见https://uniapp.dcloud.net.cn/uniCloud/trigger。使用阿里云时会自动忽略最后一位，即代表年份的一位在阿里云不生效
      "config": "0 0 2 1 * * *"
  }],
```

3. 图片上传

- 前端

```html
<u-form-item label="本人近期照片" prop="photo" borderBottom class="form-item" :labelWidth="200">
						<view class="example-body">
							<uni-file-picker limit="1" v-model="imageValue" fileMediatype="image" mode="grid"
								:cloudPath="generateCloudPath" @success="success" @fail="fail" @progress="progress"
								@select="select">
							</uni-file-picker>
						</view>
</u-form-item>
```

```javascript
data() {
		return {
			formData: {
				username: '',
				gender: '',
				age: '',
				phone: '',
				photo: "",
				city: '',
				agree: [] // 使用数组来绑定复选框
			},
			imageValue: [],
			}
	},
	methods: {
		// 获取上传状态
		select(e) {
			console.log('选择文件：', e)
		},
		// 获取上传进度
		progress(e) {
			console.log('上传进度：', e)
		},
		// 生成自定义的文件名
		generateCloudPath(file) {
			const timestamp = Date.now();
			const fileName = `photo-${timestamp}.${file.extname}`;
			return `photos/${fileName}`;
		},
		// 上传成功
		success(e) {
			console.log('上传成功');
			console.log("e.tempFilePaths[0]", e.tempFilePaths[0]);
			console.log("e", e);
			const fileInfo = {
				extname: e.tempFiles[0].extname,
				fileType: e.tempFiles[0].fileType,
				image: e.tempFiles[0].image, // 包含宽度和高度
				name: e.tempFiles[0].name,
				path: e.tempFiles[0].path,
				size: e.tempFiles[0].size,
				fileID: e.tempFiles[0].fileID,
				url: e.tempFiles[0].url,
				uuid: e.tempFiles[0].uuid,
				status: e.tempFiles[0].status,
				cloudPath: e.tempFiles[0].cloudPath
			};
			this.formData.registrationPhoto =fileInfo; // 存储为数组
			console.log("this.formData.registrationPhoto", this.formData.registrationPhoto);
		},
		// 上传失败
		fail(e) {
			console.log('上传失败：', e);
			uni.showToast({
				title: '照片上传失败，请联系客服',
				icon: 'none'
			});
		},
		submitForm() {
			this.$refs.uForm.validate().then(() => {
				uni.showLoading({ title: '提交中...' }); // 显示加载动画
				console.log('表单数据:', this.formData);
				// 请求云函数，并返回结果
				uniCloud.callFunction({
					name: 'worker',
					data: {
						methods: 'addWorkers',
						username: this.formData.username,
						gender: this.formData.gender === '男' ? 1 : 2,
						age: this.formData.age,
						phone: this.formData.phone,
						city: this.formData.city,
						agree: this.formData.agree,
						registrationPhoto: this.formData.registrationPhoto
					}
				}).then(res => {
					console.log('云函数返回结果:', res);
					console.log("formData", this.formData)
					uni.hideLoading(); // 隐藏加载动画
					if (res.result && res.result.code === 200) {
						uni.showToast({
							title: '提交成功',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: '已提交，请勿重复提交',
							icon: 'none'
						});
					}
				}).catch(err => {
					console.error('云函数调用失败:', err);
					uni.hideLoading(); // 隐藏加载动画
					uni.showToast({
						title: '提交失败，请重试',
						icon: 'none'
					});
				});

			}).catch(() => {
				uni.showToast({
					title: '请检查表单输入',
					icon: 'none'
				});
			});
		},
	}
```

- 后端云函数

```javascript
/**
 * 新增师傅
 */
res = await collection.where({
	"phone": event.phone
}).get()
// 判断数据库是否存在该师傅
if (res.data.length > 0) {
	return {
		code: 500,
			msg: "该师傅已存在",
			data: res.data
	}
}
res = await collection.add({
	username: event.username,
	phone: event.phone,
	age: event.age,
	gender: event.gender=="男"?1:2,// 判断如果性别为男值1，女值2
	city: event.city,
	avatarUrl:"",// 头像（职业照）
	balance: 0,// 余额
	contactAddress:"",// 联系地址
	residentAddress:"",// 居住地址
	latitude:"",// 纬度
	longitude:"",// 经度
	IDFront:"",// 身份证正面
	IDReverse:"",// 身份证反面
	IDReverse:"",// 身份证反面
	skillCertificate:[],// 技能证书
	workPhoto:[],// 工作照片（职业照）
	lifePhoto:[],// 生活照片
	registrationPhoto:event.registrationPhoto,// 报名时所用照片
	auditStatus:1,// 1审核中 2审核通过 3审核不通过
	businessID:"",// 所属商家 0为非商家下的师傅
	updated: Date.now(),// 当前时间戳
	created: Date.now(),// 当前时间戳
})
console.log('res: ', res)
// 判断是否新增成功
if (res.id) {
	return {
		code: 200,
			msg: "新增成功",
			data: res.data
	}
}else{
	return {
		code: 500,
			msg: "新增失败",
			data: res.data
	}
}
```

- schema2code

先建数据库表，再创建云函数，最后页面调用云函数。

```json
```



4. 定位经纬度、地址、城市

获取用户当前经纬度，逆地理编码

[uniapp 微信小程序开发使用高德地图定位SDK](https://blog.csdn.net/u013302168/article/details/144831511)

（1） 微信小程序

* 【高德地图】

- 创建应用

[高德地图开放平台](https://console.amap.com/dev/key/app)

- 下载

[高德地图微信小程序插件](https://lbs.amap.com/api/wx/download)

- 引入

./assets/GD/amap-wx.130.js
./utils/locationGps.js

```javascript

/** 使用第三方地图逆地址解析经纬度获取用户当前所在位置信息
 * @param {Number} lat
 * @param {Number} lng
 */
 
export const getUserCurrentLocationInfo = (lat, lng) => {
	var GDMapWX = require('../assets/GD/amap-wx.js');
	var GDMapSdk = new GDMapWX.AMapWX({
		key: '第2步申请的key' // 必填
	});
	return new Promise((resolve, reject) => {
		GDMapSdk.getRegeo({
			location: lng + ',' + lat,
			success: res => {
				resolve()
			},
			fail: function(error) {
				reject()
			}
		})
	})
}

```

代码中使用

1. 定位（经纬度）
2. 进行逆地理编码（经纬度换地址、城市）

参考home页

[CSDN使用高德地图微信小程序插件及逆地址解析返回poi数据问题](https://blog.csdn.net/ltc_Yan/article/details/139866882)

* 【腾讯地图】
[腾讯地图开放平台](https://lbs.qq.com/dev/console/home)