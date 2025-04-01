import App from './App'
import i18n from './lang/i18n'


// #ifndef VUE3
import Vue from 'vue'
// npm安装方式
// main.js，注意要在use方法之后执行
// import uView from 'uview-ui'
// Vue.use(uView)
// 插件市场安装方式
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

Vue.config.productionTip = false
Vue.prototype.APPID = 'wxeeccbe00085e4fc7';
Vue.prototype.SECRET = '';
Vue.prototype.WX_AUTH_URL = 'https://api.weixin.qq.com/sns/jscode2session';
App.mpType = 'app'
const app = new Vue({
	i18n,
	...App
})
app.$mount()
// #endif




// 如此配置即可
uni.$u.config.unit = 'rpx'


// #ifdef VUE3
import {createSSRApp} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	return {app}
}
// #endif
