'use strict';
const db = uniCloud.database();

/*
 * @description 支付订单
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event);
	// 数据库对象 分类
	const collection = db.collection('uni-pay-orders');
	// 数据库对象 商品
	// 所有分类数据
	const res = await collection.where({order_no: event.orderNo}).get();
	
	//返回数据给客户端
	return {
		code: 200,
		msg: '查询成功',
		data:res.data
	};
	// 查询分类的所有的商品
	// var classificationData = [{
	// 	label: '分类1',
	// 	value: '分类1',
	// 	classificationID: "",
	// 	children: [{
	// 		label: '',
	// 		value: '',
	// 		goodsID: "",
	// 		favourPrice: 0,
	// 		originalPrice: 0,
	// 		url: "",
	// 		children: 'children'
	// 	}]
	// }]
};