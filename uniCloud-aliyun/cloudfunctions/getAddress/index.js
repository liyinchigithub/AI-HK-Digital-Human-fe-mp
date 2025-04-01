'use strict';
const db = uniCloud.database()
const dbCmd = db.command;

/*
 * @description 获取用户地址列表
 * */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	//查询数据库
	var res = await db.collection("address").where({
		"openID":event.openID
	}).get()
	//查询结果
	console.log('res: ', res)
	//返回数据给客户端
	return {
		code: 200,
		data: res.data,
		message: "success"
	}
};
