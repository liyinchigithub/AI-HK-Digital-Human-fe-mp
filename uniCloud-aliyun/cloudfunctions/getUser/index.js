'use strict';
const db = uniCloud.database()
/*
 * @description 用户信息
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 数据库对象
	const collection = db.collection('user')
	// 获取数据集合
	const res = await collection.where({
		"openID": event.openID,
	}).get()
	console.log(JSON.stringify(res.data))
	//返回数据给客户端
	return {
		code: 200,
		msg: "查询成功",
		data: res.data
	}


};
