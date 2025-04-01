'use strict';
// 微信授权登录
const db = uniCloud.database(); // 云数据库对象
exports.main = async (event, context) => {
exports.main = async (event, context) => {
	let js_code = event.code; // 客户端入参（uniapp前端调用云函数传递过来）
	const appid = 'wx9d6bd1da77d1287f' //appid  
	const secret = 'd70fc8a88a953d6593bfd8a2005733bd' //secret  
	const loginUrl = 'https://api.weixin.qq.com/sns/jscode2session'
	let res = await uniCloud.httpclient.request(loginUrl, {
		method: 'GET',
		data: {
			appid: appid,
			secret: secret,
			js_code: js_code,
			grant_type: 'authorization_code'
		},
		contentType: 'json', // 指定以application/json发送data内的数据
		dataType: 'json' // 指定返回值为json格式，自动进行parse
	})
	console.log(res.data);// 调试输出，请求结果
	return res.data // 返回结果给客户端
}

// 新
