'use strict';
const db = uniCloud.database()
/*
 * @description 基础信息
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	var collection = "";
	var res = "";
	// 数据库对象
	collection = db.collection('basicInformation')
	// 获取数据集合（分页查询）pageNum 第几页、pageSize 每页几个
	res = await collection.where({
		"isEnable": event.isEnable,
	}).get()
	console.log(JSON.stringify(res.data))
	//返回数据给客户端
	return {
		code: 200,
		msg: "查询成功",
		data: res.data
	}


};