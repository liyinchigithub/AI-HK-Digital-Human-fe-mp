'use strict';
const db = uniCloud.database();
var goodsRes = [];
var classificationData = [];
/*
 * @description 获取分类、分类所属商品
 */
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event);
	// 数据库对象 分类
	const classTypeCollection = db.collection('classType');
	// 数据库对象 商品
	const goodsCollection = db.collection('goods');
	// 分类
	const classTypeRes = await classTypeCollection
		.where({
			isEnable: event.isEnable
		})
		.get();
	//
	console.log(JSON.stringify(classTypeRes.data));

	classTypeRes.data.forEach(async (c) => {
		classificationData.push({
			label: c.classTypeName,
			value: c.classTypeName,
			classificationID: c._id,
			children: []
		});

		goodsRes = await goodsCollection
			.where({
				classificationID: c._id
			})
			.get();
		console.log('goodsRes.data：', JSON.stringify(goodsRes.data));
		// 遍历每个分类中所有商品
		goodsRes.data.forEach(async (g) => {
			await classificationData[classificationData.length - 1].children.push({
				label: g.goodsName,
				value: g.goodsName,
				goodsID: g._id,
				favourPrice: g.favourPrice,
				originalPrice: g.originalPrice,
				url: g.url,
				children: []
			});
		});
		//返回数据给客户端
		return {
			code: 200,
			msg: '查询成功',
			data: {
				classificationData: classificationData
			}
		};
	});

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
