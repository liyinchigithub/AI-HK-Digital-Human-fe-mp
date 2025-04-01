'use strict';
const db = uniCloud.database()
/*
 * @description 订单详情
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 数据库对象
	const collection = db.collection('order')
	// 获取数据集合（分页查询）pageNum 第几页、pageSize 每页几个
	const res = await collection.where({
		"_id": event._id
	}).get()
	console.log(JSON.stringify(res.data))

	//返回数据给客户端
	return {
		code: 200,
		msg: "查询成功",
		data: res.data
	}


};
