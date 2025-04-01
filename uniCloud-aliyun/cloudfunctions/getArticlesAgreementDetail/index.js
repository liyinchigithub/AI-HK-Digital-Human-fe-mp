'use strict';
const db = uniCloud.database()
/*
 * @description 获取条款协议详情
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	var collection = 0
	var res = 0
	switch (event.method) {
		case "settleInAgreement":
			// 数据库对象
			collection = db.collection('entryInstructions');
			res = await collection.where({
				"isEnable": event.isEnable
			}).get()
			break;
		default:
			// 数据库对象
			collection = db.collection('articlesAgreement');
			res = await collection.where({
				"isEnable": event.isEnable
			}).get()

			break;
	}

	//返回数据给客户端
	return {
		code: 200,
		msg: "查询成功",
		data: res.data
	}


};