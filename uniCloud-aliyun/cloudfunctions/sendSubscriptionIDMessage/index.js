'use strict';

/*
 * @description 发送微信模版消息
 */

var wx_appid = "wx9d6bd1da77d1287f"
var wx_appsecret = "e206a8448c9beb9017831409a4acba76"
var get_access_token_url =
	`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wx_appid}&secret=${wx_appsecret}`;
var access_token = "";
var send_url = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='
let that = this;
var template_id = ""; // 模板ID，由前端传入模板名称，云函数查询对应模板ID
const db = uniCloud.database()
const dbCmd = db.command;
exports.main = async (event, context) => {

	// 请求获取access_token
	const get_access_token_url_res = await uniCloud.httpclient.request(get_access_token_url, {
		method: 'POST',
		data: {},
		dataType: 'json'
	})
	console.log("get_access_token_url_res:", JSON.stringify(get_access_token_url_res))
	access_token = get_access_token_url_res.data.access_token
	// console.log("access_token:", JSON.stringify(access_token))

	// 查询云数据库，获取订阅模板id array
	var subscriptionIDs = await db.collection("subscriptionIDTemplateID").where({
		"isEnable": true
	}).get();
	subscriptionIDs = subscriptionIDs.data
	console.log("subscriptionIDs:", subscriptionIDs)
	// TODO 判断使用哪个模板ID
	for (var i = 0; i < subscriptionIDs.length; i++) {
		if (subscriptionIDs[i]["teamplateName"] == event.teampleName) {
			// 复制给当前模板ID
			template_id = subscriptionIDs[i]["teamplateID"]
			console.log('teamplateName:', subscriptionIDs[i]["teamplateName"])
			break;
		}
	}
	// pushMsg的thing1，thing2和其他，对应的是你选取模板的模板详情中的字段名称(可在小程序后台模板查看对应的字段，要和上面的字段一样)，需要更改成你自己的
	var pushMsg = {
		"touser": event.openId,
		"template_id": template_id,
		"page": "index",
		"data": event.data
	}


	console.log("send_url + access_token:", send_url + access_token)
	// 请求微信发送消息模板接口
	const res = await uniCloud.httpclient.request(send_url + access_token, {
		method: 'POST',
		data: JSON.stringify(pushMsg),
		dataType: 'json'
	})
	console.log(res)
	if (res.data.errcode == 0) {
		return {
			code: 200,
			data: res.data,
			message: "success"
		}
	} else {
		return {
			code: 302,
			data: res.data,
			message: "fail"
		}
	}
}
