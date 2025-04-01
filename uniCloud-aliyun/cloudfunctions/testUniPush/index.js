// 简单的使用示例
'use strict';
const uniPush = uniCloud.getPushManager({
	appId: "__UNI__C0819F1"
}) //注意这里需要传入你的应用appId
exports.main = async (event, context) => {

	var res=await uniPush.sendMessage({
		"push_clientid": event.push_clientid, //填写上一步在uni-app客户端获取到的客户端推送标识push_clientid
		"title": "通知栏显示的标题",
		"content": "通知栏显示的内容",
		"payload": {
			"text": "体验一下uni-push2.0"
		}
	})
	
	return {
		code: 200,
		msg: "成功",
		data: res
	}
};
