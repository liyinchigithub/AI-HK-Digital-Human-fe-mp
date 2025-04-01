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
		for (let i = 0; i < goodsRes.data.length; i++) {
			classificationData.forEach((item) => {
				if (item.classificationID == goodsRes.data[i].classificationID) {
					item.children.push({
						label: goodsRes.data[i].goodsName,
						value: goodsRes.data[i].goodsName,
						goodsID: goodsRes.data[i]._id,
						favourPrice: goodsRes.data[i].favourPrice,
						originalPrice: goodsRes.data[i].originalPrice,
						url: goodsRes.data[i].url,
						children: 'children'
					});
				}
			});


		//返回数据给客户端
		return {
			code: 200,
			msg: '查询成功',
			data: {
				classificationData: classificationData
			}
		};
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
