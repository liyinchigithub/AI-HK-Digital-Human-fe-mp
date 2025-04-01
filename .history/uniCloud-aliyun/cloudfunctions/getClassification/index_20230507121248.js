'use strict';
const db = uniCloud.database();

/*
 * @description 获取分类、分类所属商品
 */
exports.main = async (event, context) => {
	var goodsRes = [];
	var classificationData = [];
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
	console.log("classTypeRes.data:",JSON.stringify(classTypeRes.data));
	var classTypeResData=classTypeRes.data
	classTypeResData.forEach(async (c) => {
		classificationData.push({
			label: c.classTypeName,
			value: c.classTypeName,
			classificationID: c._id,
			children: []
		});
		console.log("classTypeResData forEach classTypeName：",c.classTypeName)
		console.log("classTypeResData forEach c._id：",c._id)
		// 根据ID请求商品数据
		goodsRes =await goodsCollection
			.where({
				"classTypeID": c._id,
				"isEnable": event.isEnable
			})
			.get();
		// 注意这边需要使用await
		await console.log('goodsRes.data：', JSON.stringify(goodsRes.data));
		// 判断是否没有该分类的商品
	
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
