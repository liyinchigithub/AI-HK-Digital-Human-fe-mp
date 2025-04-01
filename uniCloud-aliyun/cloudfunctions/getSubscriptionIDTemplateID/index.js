'use strict';
const db = uniCloud.database()
const dbCmd = db.command;
/*
 * @description 微信模版消息
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	//查询数据库
	var res = await db.collection("subscriptionIDTemplateID").where({
		"isEnable": true
	}).get()
	//查询结果
	console.log('res data: ', res.data)
	var list = res.data
	//仅展示状态为启用的数据
	var response_data = []
	for (var i = 0; i < list.length; i++) {
		console.log("list[i]", list[i])
		await response_data.push({
			"teamplateName": list[i].teamplateName,
			"teamplateID": list[i].teamplateID
		})
	}
	console.log("response_data:", response_data)
	//返回数据给客户端
	return {
		code: 200,
		data: response_data,
		message: "success"
	}
};
